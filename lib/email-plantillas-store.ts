"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface EmailPlantilla {
  id: string;
  nombre: string;
  editado: string;
  asunto: string;
  cuerpo: string;
}

export interface EmailPlantillaInput {
  nombre: string;
  asunto: string;
  cuerpo: string;
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

function parseHtmlContent(content: string) {
  try {
    const parsed = JSON.parse(content);
    return {
      asunto: parsed.asunto ?? "",
      cuerpo: parsed.cuerpo ?? "",
    };
  } catch {
    return {
      asunto: "",
      cuerpo: content ?? "",
    };
  }
}

async function fetchPlantillas(supabase: ReturnType<typeof createClient>, businessId: string): Promise<EmailPlantilla[]> {
  const { data, error } = await supabase
    .from("email_templates")
    .select("id, name, html_content, updated_at")
    .eq("business_id", businessId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => {
    const { asunto, cuerpo } = parseHtmlContent(row.html_content);
    return {
      id: row.id,
      nombre: row.name ?? "",
      editado: timeAgo(row.updated_at),
      asunto,
      cuerpo,
    };
  });
}

export function useEmailPlantillas() {
  const { businessId } = useBusiness();
  const [plantillas, setPlantillas] = useState<EmailPlantilla[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setPlantillas(await fetchPlantillas(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`email-templates-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_templates", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return plantillas;
}

export async function addEmailPlantilla(data: Partial<EmailPlantillaInput> = {}) {
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

  const nombre = data.nombre?.trim() || "Nueva plantilla";
  const jsonContent = JSON.stringify({
    asunto: data.asunto ?? "",
    cuerpo: data.cuerpo ?? "",
  });

  const { data: row, error } = await supabase
    .from("email_templates")
    .insert({
      business_id: membership.business_id,
      name: nombre,
      html_content: jsonContent,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function updateEmailPlantilla(id: string, data: Partial<EmailPlantillaInput>) {
  const supabase = createClient();

  // Si actualizamos asunto o cuerpo, debemos primero obtener la plantilla actual para no pisar el otro campo
  let jsonContent: string | undefined;
  if (data.asunto !== undefined || data.cuerpo !== undefined) {
    const { data: current } = await supabase
      .from("email_templates")
      .select("html_content")
      .eq("id", id)
      .single();

    const currentParsed = current ? parseHtmlContent(current.html_content) : { asunto: "", cuerpo: "" };
    jsonContent = JSON.stringify({
      asunto: data.asunto !== undefined ? data.asunto : currentParsed.asunto,
      cuerpo: data.cuerpo !== undefined ? data.cuerpo : currentParsed.cuerpo,
    });
  }

  const patch: Record<string, any> = {};
  if (data.nombre !== undefined) patch.name = data.nombre;
  if (jsonContent !== undefined) patch.html_content = jsonContent;
  patch.updated_at = new Date().toISOString();

  const { error } = await supabase.from("email_templates").update(patch).eq("id", id);
  if (error) throw error;
}

export async function duplicateEmailPlantilla(id: string) {
  const supabase = createClient();
  const { data: original, error: fetchError } = await supabase
    .from("email_templates")
    .select("business_id, name, html_content")
    .eq("id", id)
    .single();

  if (fetchError || !original) return null;

  const { data: row, error } = await supabase
    .from("email_templates")
    .insert({
      business_id: original.business_id,
      name: `${original.name} (copia)`,
      html_content: original.html_content,
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function deleteEmailPlantilla(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("email_templates").delete().eq("id", id);
  if (error) throw error;
}
