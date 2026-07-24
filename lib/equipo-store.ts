"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface MiembroEquipo {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  modulos: string[];
  estado: string;
}

export interface InvitacionInput {
  email: string;
  rol: "admin" | "empleado";
  modulos: string[];
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

async function fetchEquipo(supabase: ReturnType<typeof createClient>, businessId: string): Promise<MiembroEquipo[]> {
  const { data, error } = await supabase
    .from("business_members")
    .select(`
      id,
      role,
      allowed_modules,
      status,
      user_id,
      profiles:user_id (
        full_name
      )
    `)
    .eq("business_id", businessId);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    nombre: row.profiles?.full_name ?? "Usuario Invitado",
    email: `miembro_${row.id.substring(0, 4)}@empresa.com`,
    rol: row.role,
    modulos: row.allowed_modules ?? [],
    estado: row.status === "invited" ? "Invitado" : row.status === "active" ? "Activo" : "Inactivo",
  }));
}

export function useEquipo() {
  const { businessId } = useBusiness();
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setMiembros(await fetchEquipo(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`equipo-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "business_members", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return miembros;
}

export async function invitarMiembro(data: InvitacionInput) {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) throw new Error("No business context found");

  const dummyUserId = crypto.randomUUID();
  const { data: row, error } = await supabase
    .from("business_members")
    .insert({
      business_id: businessId,
      user_id: dummyUserId,
      role: data.rol,
      allowed_modules: data.rol === "admin" ? ["Todos"] : data.modulos,
      status: "invited",
    })
    .select("id")
    .single();

  if (error) throw error;
  return row.id as string;
}

export async function reenviarInvitacion(id: string) {
  // Simulación: en producción enviaría un correo real.
  const supabase = createClient();
  const { data, error } = await supabase
    .from("business_members")
    .update({ invited_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarMiembro(id: string, data: Partial<InvitacionInput>) {
  const supabase = createClient();
  const patch: Record<string, any> = {};
  if (data.rol !== undefined) {
    patch.role = data.rol;
    patch.allowed_modules = data.rol === "admin" ? ["Todos"] : data.modulos;
  } else if (data.modulos !== undefined) {
    patch.allowed_modules = data.modulos;
  }

  const { error } = await supabase.from("business_members").update(patch).eq("id", id);
  if (error) throw error;
}

export async function eliminarMiembro(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("business_members").delete().eq("id", id);
  if (error) throw error;
}
