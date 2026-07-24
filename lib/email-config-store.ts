"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/lib/supabase/business-context";

export type EstadoDominio = "sin_configurar" | "pendiente" | "verificado";

export interface RegistroDns {
  tipo: "TXT" | "MX" | "CNAME";
  host: string;
  valor: string;
  prioridad?: number;
}

export interface EmailConfig {
  nombreRemitente: string;
  emailRemitente: string;
  replyTo: string;
  dominio: string;
  estadoDominio: EstadoDominio;
  registrosDns: RegistroDns[];
}

function generarRegistrosDns(dominio: string): RegistroDns[] {
  return [
    { tipo: "TXT", host: `send.${dominio}`, valor: "v=spf1 include:amazonses.com ~all" },
    { tipo: "MX", host: `send.${dominio}`, valor: "feedback-smtp.us-east-1.amazonses.com", prioridad: 10 },
    { tipo: "TXT", host: `resend._domainkey.${dominio}`, valor: "p=MIGfMA0GCSqGSIb3DQEBAQ… (clave pública provista por Resend)" },
  ];
}

const DEFAULT_CONFIG: EmailConfig = {
  nombreRemitente: "Codew Agencia",
  emailRemitente: "hola@codew.pe",
  replyTo: "",
  dominio: "codew.pe",
  estadoDominio: "pendiente",
  registrosDns: generarRegistrosDns("codew.pe"),
};

async function fetchEmailConfig(supabase: ReturnType<typeof createClient>, businessId: string): Promise<EmailConfig> {
  const { data, error } = await supabase
    .from("email_config")
    .select("sender_name, sender_email, reply_to, domain, domain_status")
    .eq("business_id", businessId)
    .maybeSingle();

  if (error || !data) {
    // Si no existe, creamos la fila inicial por defecto
    await supabase.from("email_config").insert({
      business_id: businessId,
      sender_name: DEFAULT_CONFIG.nombreRemitente,
      sender_email: DEFAULT_CONFIG.emailRemitente,
      reply_to: DEFAULT_CONFIG.replyTo || null,
      domain: DEFAULT_CONFIG.dominio || null,
      domain_status: "none", // none maps to sin_configurar / pendiente
    });
    return DEFAULT_CONFIG;
  }

  // Mapeamos domain_status de db a EstadoDominio
  let estadoDominio: EstadoDominio = "sin_configurar";
  if (data.domain_status === "verified") {
    estadoDominio = "verificado";
  } else if (data.domain) {
    estadoDominio = "pendiente";
  }

  return {
    nombreRemitente: data.sender_name ?? "",
    emailRemitente: data.sender_email ?? "",
    replyTo: data.reply_to ?? "",
    dominio: data.domain ?? "",
    estadoDominio,
    registrosDns: data.domain ? generarRegistrosDns(data.domain) : [],
  };
}

export function useEmailConfig() {
  const { businessId } = useBusiness();
  const [config, setConfig] = useState<EmailConfig>(DEFAULT_CONFIG);

  const reload = useCallback(async () => {
    if (!businessId) return;
    const supabase = createClient();
    setConfig(await fetchEmailConfig(supabase, businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
    if (!businessId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`email-config-${businessId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_config", filter: `business_id=eq.${businessId}` },
        () => reload()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, reload]);

  return config;
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

export async function updateRemitente(data: { nombreRemitente: string; emailRemitente: string; replyTo: string }) {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  await supabase
    .from("email_config")
    .update({
      sender_name: data.nombreRemitente,
      sender_email: data.emailRemitente,
      reply_to: data.replyTo || null,
    })
    .eq("business_id", businessId);
}

export async function agregarDominio(dominio: string) {
  const limpio = dominio.trim().toLowerCase();
  if (!limpio) return;

  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  await supabase
    .from("email_config")
    .update({
      domain: limpio,
      domain_status: "pending",
    })
    .eq("business_id", businessId);
}

export async function verificarDominio() {
  const supabase = createClient();
  const businessId = await getActiveBusinessId(supabase);
  if (!businessId) return;

  await supabase
    .from("email_config")
    .update({
      domain_status: "verified",
    })
    .eq("business_id", businessId);
}
