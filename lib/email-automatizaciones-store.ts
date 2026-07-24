"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface EmailAutomatizacion {
  id: string;
  nombre: string;
  evento: string;
  plantilla: string;
  estado: string;
}

export interface EmailAutomatizacionInput {
  nombre: string;
  evento: string;
  plantilla: string;
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

async function resolveIds(supabase: ReturnType<typeof createClient>, businessId: string, templateName: string) {
  const { data } = await supabase
    .from("email_templates")
    .select("id")
    .eq("business_id", businessId)
    .eq("name", templateName)
    .maybeSingle();

  return data?.id ?? null;
}

async function fetchEmailAutomations(supabase: ReturnType<typeof createClient>, businessId: string): Promise<EmailAutomatizacion[]> {
  const { data, error } = await supabase
    .from("email_automations")
    .select(`
      id,
      name,
      trigger_event,
      status,
      email_templates (
        name
      )
    `)
    .eq("business_id", businessId);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "",
    evento: REVERSE_EVENT_MAP[row.trigger_event] ?? row.trigger_event ?? "",
    plantilla: row.email_templates?.name ?? "—",
    estado: row.status === "active" ? "Activa" : "Pausada",
  }));
}

export function useEmailAutomatizaciones() {
  const { businessId } = useBusiness();
  const [automatizaciones, setAutomatizaciones] = useState<EmailAutomatizacion[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setAutomatizaciones(await fetchEmailAutomations(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`email-automations-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_automations", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return automatizaciones;
}

export async function addEmailAutomatizacion(data: EmailAutomatizacionInput) {
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

  const templateId = await resolveIds(supabase, membership.business_id, data.plantilla);
  const dbEvent = EVENT_MAP[data.evento] ?? data.evento;

  const { data: row, error } = await supabase
    .from("email_automations")
    .insert({
      business_id: membership.business_id,
      name: data.nombre,
      trigger_event: dbEvent,
      template_id: templateId,
      status: "active",
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function updateEmailAutomatizacion(id: string, data: Partial<EmailAutomatizacionInput>) {
  const supabase = createClient();

  const { data: current } = await supabase
    .from("email_automations")
    .select("business_id")
    .eq("id", id)
    .single();

  if (!current) return;

  const patch: Record<string, any> = {};
  if (data.nombre !== undefined) patch.name = data.nombre;
  if (data.evento !== undefined) patch.trigger_event = EVENT_MAP[data.evento] ?? data.evento;

  if (data.plantilla !== undefined) {
    const templateId = await resolveIds(supabase, current.business_id, data.plantilla);
    patch.template_id = templateId;
  }

  const { error } = await supabase.from("email_automations").update(patch).eq("id", id);
  if (error) throw error;
}

export async function toggleEmailAutomatizacion(id: string) {
  const supabase = createClient();
  const { data: current } = await supabase
    .from("email_automations")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) return;

  const nextStatus = current.status === "active" ? "paused" : "active";
  const { error } = await supabase.from("email_automations").update({ status: nextStatus }).eq("id", id);
  if (error) throw error;
}

export async function deleteEmailAutomatizacion(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("email_automations").delete().eq("id", id);
  if (error) throw error;
}
