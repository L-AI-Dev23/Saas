"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  origen: string;
  etapa: string;
  tags: string[];
  tiempo: string;
}

export interface ContactoInput {
  nombre: string;
  email: string;
  telefono: string;
  origen: string;
  etapa: string;
  tags: string[];
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "hace instantes";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} día${days === 1 ? "" : "s"}`;
}

async function fetchContactos(supabase: ReturnType<typeof createClient>): Promise<Contacto[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, email, phone, source, stage, created_at, contact_tags(tags(name))")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "",
    email: row.email ?? "",
    telefono: row.phone ?? "",
    origen: row.source ?? "manual",
    etapa: row.stage ?? "nuevo",
    tags: (row.contact_tags ?? []).map((ct: any) => ct.tags?.name).filter(Boolean),
    tiempo: timeAgo(row.created_at),
  }));
}

// Hook reactivo: carga los contactos del negocio actual y se mantiene
// sincronizado en vivo vía Supabase Realtime.
export function useContactos() {
  const { businessId } = useBusiness();
  const [contactos, setContactos] = useState<Contacto[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setContactos(await fetchContactos(supabase));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`contacts-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contacts", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_tags" }, () => reload())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return contactos;
}

export async function addContacto(data: ContactoInput, businessId: string) {
  const supabase = createClient();

  // Respeta el límite de contactos del plan (ver check_and_increment_usage en Supabase)
  const { data: allowed, error: usageError } = await supabase.rpc("check_and_increment_usage", {
    p_business_id: businessId,
    p_metric: "contacts",
  });
  if (usageError) throw usageError;
  if (!allowed) throw new Error("Llegaste al límite de contactos de tu plan. Actualiza tu plan para agregar más.");

  const { data: row, error } = await supabase
    .from("contacts")
    .insert({
      business_id: businessId,
      name: data.nombre,
      email: data.email || null,
      phone: data.telefono || null,
      source: data.origen,
      stage: data.etapa,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function updateContacto(id: string, data: Partial<ContactoInput>) {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (data.nombre !== undefined) patch.name = data.nombre;
  if (data.email !== undefined) patch.email = data.email;
  if (data.telefono !== undefined) patch.phone = data.telefono;
  if (data.origen !== undefined) patch.source = data.origen;
  if (data.etapa !== undefined) patch.stage = data.etapa;

  const { error } = await supabase.from("contacts").update(patch).eq("id", id);
  if (error) throw error;
}

// Soft delete: así lo pide el modelo de datos (deleted_at, no DELETE físico).
export async function deleteContacto(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("contacts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function addTagToContacto(contactId: string, tagName: string, businessId: string) {
  const supabase = createClient();
  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .select("id")
    .eq("business_id", businessId)
    .eq("name", tagName)
    .single();
  if (tagError || !tag) throw tagError ?? new Error("Etiqueta no encontrada");

  const { error } = await supabase.from("contact_tags").insert({ contact_id: contactId, tag_id: tag.id });
  if (error) throw error;
}

export async function removeTagFromContacto(contactId: string, tagName: string, businessId: string) {
  const supabase = createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("business_id", businessId)
    .eq("name", tagName)
    .single();
  if (!tag) return;

  const { error } = await supabase
    .from("contact_tags")
    .delete()
    .eq("contact_id", contactId)
    .eq("tag_id", tag.id);
  if (error) throw error;
}
