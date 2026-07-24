"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface EmailLista {
  id: string;
  nombre: string;
  tipo: "Manual" | "Dinámica";
  contactos: number;
  actualizado: string;
}

export interface EmailListaInput {
  nombre: string;
  tipo: "Manual" | "Dinámica";
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

async function fetchListas(supabase: ReturnType<typeof createClient>, businessId: string): Promise<EmailLista[]> {
  const { data, error } = await supabase
    .from("email_lists")
    .select("id, name, type, created_at, list_contacts(count)")
    .eq("business_id", businessId)
    .order("name");

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.name ?? "",
    tipo: row.type === "dynamic" ? "Dinámica" : "Manual",
    contactos: row.list_contacts?.[0]?.count ?? 0,
    actualizado: timeAgo(row.created_at),
  }));
}

export function useEmailListas() {
  const { businessId } = useBusiness();
  const [listas, setListas] = useState<EmailLista[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setListas(await fetchListas(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`email-lists-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_lists", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return listas;
}

export async function addEmailLista(data: EmailListaInput) {
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

  const { data: row, error } = await supabase
    .from("email_lists")
    .insert({
      business_id: membership.business_id,
      name: data.nombre,
      type: data.tipo === "Dinámica" ? "dynamic" : "manual",
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function deleteEmailLista(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("email_lists").delete().eq("id", id);
  if (error) throw error;
}
