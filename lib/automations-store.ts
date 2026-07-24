"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface ReglaAutomatizacion {
  id: string;
  nombre: string;
  evento: string;
  pasos: string[];
  estado: boolean;
}

export interface AutomationRuleInput {
  nombre: string;
  evento: string;
  pasos: string[];
}

const EVENT_MAP: Record<string, string> = {
  "Contacto nuevo": "contact_created",
  "Carrito abandonado": "cart_abandoned",
  "Compra realizada": "purchase_completed",
  "Etiqueta agregada": "tag_added",
  "Formulario enviado": "form_submitted",
};

const REVERSE_EVENT_MAP: Record<string, string> = {
  contact_created: "Contacto nuevo",
  cart_abandoned: "Carrito abandonado",
  purchase_completed: "Compra realizada",
  tag_added: "Etiqueta agregada",
  form_submitted: "Formulario enviado",
};

async function fetchAutomations(supabase: ReturnType<typeof createClient>, businessId: string): Promise<ReglaAutomatizacion[]> {
  const { data, error } = await supabase
    .from("automations")
    .select("id, name, trigger_event, action_config, status")
    .eq("business_id", businessId);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "",
    evento: REVERSE_EVENT_MAP[row.trigger_event] ?? row.trigger_event ?? "",
    pasos: (row.action_config as any)?.steps ?? [],
    estado: row.status === "active",
  }));
}

export function useAutomationRules() {
  const { businessId } = useBusiness();
  const [reglas, setReglas] = useState<ReglaAutomatizacion[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setReglas(await fetchAutomations(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`automations-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "automations", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return reglas;
}

export async function addAutomationRule(data: AutomationRuleInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user session");

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!membership?.business_id) throw new Error("No business context");

  const dbEvent = EVENT_MAP[data.evento] ?? data.evento;
  const { error } = await supabase.from("automations").insert({
    business_id: membership.business_id,
    name: data.nombre,
    trigger_event: dbEvent,
    action_config: { steps: data.pasos },
    status: "active",
  });

  if (error) throw error;
}

export async function updateAutomationRule(id: string, data: AutomationRuleInput) {
  const supabase = createClient();
  const dbEvent = EVENT_MAP[data.evento] ?? data.evento;
  const { error } = await supabase
    .from("automations")
    .update({
      name: data.nombre,
      trigger_event: dbEvent,
      action_config: { steps: data.pasos },
    })
    .eq("id", id);

  if (error) throw error;
}

export async function duplicateAutomationRule(id: string) {
  const supabase = createClient();
  const { data: original } = await supabase
    .from("automations")
    .select("business_id, name, trigger_event, action_config")
    .eq("id", id)
    .single();

  if (!original) return;

  const { error } = await supabase.from("automations").insert({
    business_id: original.business_id,
    name: `${original.name} (copia)`,
    trigger_event: original.trigger_event,
    action_config: original.action_config,
    status: "paused",
  });

  if (error) throw error;
}

export async function deleteAutomationRule(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("automations").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleAutomationRule(id: string) {
  const supabase = createClient();
  const { data: current } = await supabase
    .from("automations")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) return;

  const nextStatus = current.status === "active" ? "paused" : "active";
  const { error } = await supabase.from("automations").update({ status: nextStatus }).eq("id", id);
  if (error) throw error;
}
