"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface NotificacionConfig {
  evento: string;
  inapp: boolean;
  email: boolean;
}

const DEFAULT_CONFIG: NotificacionConfig[] = [
  { evento: "Nuevo lead", inapp: true, email: true },
  { evento: "Error de conexión de cuenta", inapp: true, email: true },
  { evento: "Campaña finalizada", inapp: true, email: false },
  { evento: "Límite de uso alcanzado", inapp: true, email: true },
];

async function fetchNotificationSettings(supabase: ReturnType<typeof createClient>, businessId: string): Promise<NotificacionConfig[]> {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("event_type, channel, enabled")
    .eq("business_id", businessId);

  if (error || !data || data.length === 0) {
    // Si no existen configuraciones en base de datos, creamos las filas por defecto
    const rowsToInsert = [];
    for (const c of DEFAULT_CONFIG) {
      rowsToInsert.push({ business_id: businessId, event_type: c.evento, channel: "inapp", enabled: c.inapp });
      rowsToInsert.push({ business_id: businessId, event_type: c.evento, channel: "email", enabled: c.email });
    }
    await supabase.from("notification_settings").insert(rowsToInsert);
    return DEFAULT_CONFIG;
  }

  // Mapeamos los datos planos de base de datos al formato del store
  const map: Record<string, { inapp: boolean; email: boolean }> = {};
  for (const c of DEFAULT_CONFIG) {
    map[c.evento] = { inapp: c.inapp, email: c.email };
  }

  for (const row of data) {
    if (!map[row.event_type]) {
      map[row.event_type] = { inapp: true, email: true };
    }
    if (row.channel === "inapp") {
      map[row.event_type].inapp = row.enabled;
    } else if (row.channel === "email") {
      map[row.event_type].email = row.enabled;
    }
  }

  return Object.keys(map).map((evento) => ({
    evento,
    inapp: map[evento].inapp,
    email: map[evento].email,
  }));
}

export function useNotificacionesConfig() {
  const { businessId } = useBusiness();
  const [config, setConfig] = useState<NotificacionConfig[]>(DEFAULT_CONFIG);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setConfig(await fetchNotificationSettings(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`notification-settings-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification_settings", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return config;
}

async function getActiveBusinessId(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return membership?.business_id ?? null;
}

export async function toggleNotificacion(evento: string, canal: "inapp" | "email") {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  // Obtener estado actual
  const { data } = await supabase
    .from("notification_settings")
    .select("id, enabled")
    .eq("business_id", businessId)
    .eq("event_type", evento)
    .eq("channel", canal)
    .maybeSingle();

  if (data) {
    await supabase
      .from("notification_settings")
      .update({ enabled: !data.enabled })
      .eq("id", data.id);
  } else {
    // Si por alguna razón no existía la fila
    await supabase.from("notification_settings").insert({
      business_id: businessId,
      event_type: evento,
      channel: canal,
      enabled: false, // Invertido del default de true
    });
  }
}
