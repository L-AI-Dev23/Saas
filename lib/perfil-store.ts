"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface PerfilConfig {
  nombreNegocio: string;
  zonaHoraria: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
}

export function usePerfil(): PerfilConfig {
  const { user, businessId } = useBusiness();
  const [perfil, setPerfil] = useState<PerfilConfig>({
    nombreNegocio: "Codew Agencia",
    zonaHoraria: "America/Lima",
    nombreCompleto: "Luis Ramírez",
    email: user?.email ?? "luis@codew.pe",
    telefono: "+51 987 654 321",
  });

  const reload = useCallback(async () => {
    if (!user || !businessId) return;
    const supabase = createClient();

    // Obtener nombre del negocio y zona horaria
    const { data: biz } = await supabase
      .from("businesses")
      .select("name, timezone")
      .eq("id", businessId)
      .single();

    // Obtener nombre completo del perfil y teléfono
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();

    setPerfil({
      nombreNegocio: biz?.name ?? "",
      zonaHoraria: biz?.timezone ?? "America/Lima",
      nombreCompleto: prof?.full_name ?? "",
      email: user.email ?? "",
      telefono: prof?.phone ?? "",
    });
  }, [user, businessId]);

  useEffect(() => {
    reload();
    if (!user || !businessId) return;

    const supabase = createClient();
    const ch1 = supabase
      .channel(`perfil-biz-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "businesses", filter: `id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    const ch2 = supabase
      .channel(`perfil-prof-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
    };
  }, [user, businessId, reload]);

  return perfil;
}

export async function updatePerfil(data: Partial<PerfilConfig>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (data.nombreCompleto !== undefined || data.telefono !== undefined) {
    const patch: Record<string, any> = {};
    if (data.nombreCompleto !== undefined) patch.full_name = data.nombreCompleto;
    if (data.telefono !== undefined) patch.phone = data.telefono;
    await supabase.from("profiles").update(patch).eq("id", user.id);
  }

  // Obtener la membresía activa del negocio
  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (membership?.business_id && (data.nombreNegocio !== undefined || data.zonaHoraria !== undefined)) {
    const patch: Record<string, any> = {};
    if (data.nombreNegocio !== undefined) patch.name = data.nombreNegocio;
    if (data.zonaHoraria !== undefined) patch.timezone = data.zonaHoraria;
    await supabase.from("businesses").update(patch).eq("id", membership.business_id);
  }
}
