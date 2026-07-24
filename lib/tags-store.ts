"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface CrmTag {
  id: string;
  nombre: string;
  color: string;
  contactos: number;
}

export interface TagInput {
  nombre: string;
  color: string;
}

async function fetchTags(supabase: ReturnType<typeof createClient>): Promise<CrmTag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, color, contact_tags(count)")
    .order("name");

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.name,
    color: row.color ?? "#00c98d",
    contactos: row.contact_tags?.[0]?.count ?? 0,
  }));
}

export function useTags() {
  const { businessId } = useBusiness();
  const [tags, setTags] = useState<CrmTag[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setTags(await fetchTags(supabase));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`tags-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tags", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_tags" }, () => reload())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return tags;
}

export async function addTag(data: TagInput, businessId: string) {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("tags")
    .insert({ business_id: businessId, name: data.nombre, color: data.color })
    .select("id")
    .single();
  if (error) throw error;
  return row.id as string;
}

// contact_tags se limpia solo (ON DELETE CASCADE definido en el esquema).
export async function deleteTag(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
}

export async function renameTag(id: string, data: Partial<TagInput>) {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (data.nombre !== undefined) patch.name = data.nombre;
  if (data.color !== undefined) patch.color = data.color;

  const { error } = await supabase.from("tags").update(patch).eq("id", id);
  if (error) throw error;
}
