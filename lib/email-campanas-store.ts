"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface ReporteCampana {
  enviados: number;
  aperturas: number;
  clics: number;
  rebotes: number;
}

export interface EmailCampana {
  id: string;
  nombre: string;
  lista: string;
  plantilla: string;
  estado: string;
  fecha: string;
  reporte: ReporteCampana | null;
}

export interface EmailCampanaInput {
  nombre: string;
  lista: string; // Nombre de la lista
  plantilla: string; // Nombre de la plantilla
}

function simularReporte(contactosLista: number): ReporteCampana {
  const enviados = Math.max(contactosLista, 1);
  const tasaApertura = 0.45 + Math.random() * 0.25; // 45% - 70%
  const aperturas = Math.round(enviados * tasaApertura);
  const tasaClic = 0.15 + Math.random() * 0.2; // 15% - 35% de quienes abrieron
  const clics = Math.round(aperturas * tasaClic);
  const rebotes = Math.round(enviados * (0.005 + Math.random() * 0.015)); // 0.5% - 2%
  return { enviados, aperturas, clics, rebotes };
}

async function resolveIds(supabase: ReturnType<typeof createClient>, businessId: string, data: EmailCampanaInput) {
  // Buscar list_id
  const { data: listaRow } = await supabase
    .from("email_lists")
    .select("id")
    .eq("business_id", businessId)
    .eq("name", data.lista)
    .maybeSingle();

  // Buscar template_id
  const { data: templateRow } = await supabase
    .from("email_templates")
    .select("id")
    .eq("business_id", businessId)
    .eq("name", data.plantilla)
    .maybeSingle();

  return {
    list_id: listaRow?.id ?? null,
    template_id: templateRow?.id ?? null,
  };
}

async function fetchCampanas(supabase: ReturnType<typeof createClient>, businessId: string): Promise<EmailCampana[]> {
  const { data, error } = await supabase
    .from("email_campaigns")
    .select(`
      id,
      name,
      status,
      scheduled_at,
      sent_at,
      created_at,
      email_templates (
        name
      ),
      email_lists (
        name,
        list_contacts (
          count
        )
      )
    `)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => {
    let estado = "Borrador";
    let fecha = "—";
    if (row.status === "sent") {
      estado = "Enviada";
      fecha = row.sent_at ? format(new Date(row.sent_at), "d MMM yyyy", { locale: es }) : "—";
    } else if (row.status === "scheduled") {
      estado = "Programada";
      fecha = row.scheduled_at ? format(new Date(row.scheduled_at), "d MMM yyyy", { locale: es }) : "—";
    }

    const contactosLista = row.email_lists?.list_contacts?.[0]?.count ?? 0;
    const reporte = row.status === "sent" ? simularReporte(contactosLista) : null;

    return {
      id: row.id,
      nombre: row.name ?? "",
      lista: row.email_lists?.name ?? "—",
      plantilla: row.email_templates?.name ?? "—",
      estado,
      fecha,
      reporte,
    };
  });
}

export function useEmailCampanas() {
  const { businessId } = useBusiness();
  const [campanas, setCampanas] = useState<EmailCampana[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setCampanas(await fetchCampanas(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`email-campaigns-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_campaigns", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return campanas;
}

export async function crearBorrador(data: EmailCampanaInput) {
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

  const { list_id, template_id } = await resolveIds(supabase, membership.business_id, data);

  const { data: row, error } = await supabase
    .from("email_campaigns")
    .insert({
      business_id: membership.business_id,
      name: data.nombre,
      list_id,
      template_id,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function enviarAhora(data: EmailCampanaInput, contactosLista: number) {
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

  const { list_id, template_id } = await resolveIds(supabase, membership.business_id, data);

  const { data: row, error } = await supabase
    .from("email_campaigns")
    .insert({
      business_id: membership.business_id,
      name: data.nombre,
      list_id,
      template_id,
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function programar(data: EmailCampanaInput, fecha: string) {
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

  const { list_id, template_id } = await resolveIds(supabase, membership.business_id, data);

  // Convertir fecha de string (ej. "22 jul 2026") o asumir ahora + 1 día si es inválida
  const scheduledDate = new Date(fecha).toString() !== "Invalid Date" ? new Date(fecha).toISOString() : new Date(Date.now() + 86400000).toISOString();

  const { data: row, error } = await supabase
    .from("email_campaigns")
    .insert({
      business_id: membership.business_id,
      name: data.nombre,
      list_id,
      template_id,
      status: "scheduled",
      scheduled_at: scheduledDate,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function enviarCampanaExistente(id: string, contactosLista: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("email_campaigns")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function updateEmailCampana(id: string, data: Partial<EmailCampanaInput>) {
  const supabase = createClient();

  const { data: current } = await supabase
    .from("email_campaigns")
    .select("business_id")
    .eq("id", id)
    .single();

  if (!current) return;

  const patch: Record<string, any> = {};
  if (data.nombre !== undefined) patch.name = data.nombre;

  // Si actualizamos lista o plantilla, resolvemos los ids correspondientes
  if (data.lista !== undefined || data.plantilla !== undefined) {
    const mockInput: EmailCampanaInput = {
      nombre: "",
      lista: data.lista ?? "",
      plantilla: data.plantilla ?? "",
    };
    const { list_id, template_id } = await resolveIds(supabase, current.business_id, mockInput);
    if (data.lista !== undefined) patch.list_id = list_id;
    if (data.plantilla !== undefined) patch.template_id = template_id;
  }

  const { error } = await supabase.from("email_campaigns").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteEmailCampana(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("email_campaigns").delete().eq("id", id);
  if (error) throw error;
}
