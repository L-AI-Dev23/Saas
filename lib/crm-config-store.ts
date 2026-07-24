"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export interface EtapaCrm {
  key: string;
  label: string;
}

const DEFAULT_ETAPAS = [
  { key: "nuevo", label: "Nuevo" },
  { key: "en_conversacion", label: "En conversación" },
  { key: "cliente", label: "Cliente" },
  { key: "inactivo", label: "Inactivo" },
];

async function fetchCrmSettings(supabase: ReturnType<typeof createClient>, businessId: string) {
  let { data, error } = await supabase
    .from("crm_settings")
    .select("stage_labels, show_value_field")
    .eq("business_id", businessId)
    .maybeSingle();

  if (error || !data) {
    // Si no existe, creamos los valores por defecto
    const defaultLabels = {
      nuevo: "Nuevo",
      en_conversacion: "En conversación",
      cliente: "Cliente",
      inactivo: "Inactivo",
    };
    await supabase.from("crm_settings").insert({
      business_id: businessId,
      stage_labels: defaultLabels,
      show_value_field: false,
    });
    return {
      etapas: DEFAULT_ETAPAS,
      mostrarValorVenta: false,
    };
  }

  const labels = data.stage_labels as Record<string, string>;
  const etapas = DEFAULT_ETAPAS.map((e) => ({
    key: e.key,
    label: labels[e.key] ?? e.label,
  }));

  return {
    etapas,
    mostrarValorVenta: data.show_value_field,
  };
}

export function useEtapasCrm() {
  const { businessId } = useBusiness();
  const [etapas, setEtapas] = useState<EtapaCrm[]>(DEFAULT_ETAPAS);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    const settings = await fetchCrmSettings(supabase, businessId);
    setEtapas(settings.etapas);
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`crm-settings-etapas-${businessId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crm_settings", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return etapas;
}

export function useMostrarValorVenta() {
  const { businessId } = useBusiness();
  const [mostrarValorVenta, setMostrarValorVenta] = useState<boolean>(false);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    const settings = await fetchCrmSettings(supabase, businessId);
    setMostrarValorVenta(settings.mostrarValorVenta);
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`crm-settings-valor-${businessId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crm_settings", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return mostrarValorVenta;
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

export async function setEtapaLabel(key: string, label: string) {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  const { data } = await supabase
    .from("crm_settings")
    .select("stage_labels")
    .eq("business_id", businessId)
    .single();

  const labels = { ...(data?.stage_labels as Record<string, string> || {}) };
  labels[key] = label;

  await supabase
    .from("crm_settings")
    .update({ stage_labels: labels })
    .eq("business_id", businessId);
}

export async function setEtapasLabels(labels: Record<string, string>) {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  const { data } = await supabase
    .from("crm_settings")
    .select("stage_labels")
    .eq("business_id", businessId)
    .single();

  const currentLabels = { ...(data?.stage_labels as Record<string, string> || {}) };
  const nextLabels = { ...currentLabels, ...labels };

  await supabase
    .from("crm_settings")
    .update({ stage_labels: nextLabels })
    .eq("business_id", businessId);
}

export async function setMostrarValorVenta(value: boolean) {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  await supabase
    .from("crm_settings")
    .update({ show_value_field: value })
    .eq("business_id", businessId);
}

export function getEtapas() {
  // Retorna las etapas por defecto de forma estática o se espera a que se carguen reactivamente.
  return DEFAULT_ETAPAS;
}
