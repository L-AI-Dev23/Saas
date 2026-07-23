"use client";

import { useSyncExternalStore } from "react";

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

// Genera los registros DNS que Resend pediría para verificar un dominio propio.
// Los valores del DKIM son ilustrativos: Resend entrega la clave pública real
// recién cuando el dominio se agrega desde su API.
function generarRegistrosDns(dominio: string): RegistroDns[] {
  return [
    { tipo: "TXT", host: `send.${dominio}`, valor: "v=spf1 include:amazonses.com ~all" },
    { tipo: "MX", host: `send.${dominio}`, valor: "feedback-smtp.us-east-1.amazonses.com", prioridad: 10 },
    { tipo: "TXT", host: `resend._domainkey.${dominio}`, valor: "p=MIGfMA0GCSqGSIb3DQEBAQ… (clave pública provista por Resend)" },
  ];
}

let config: EmailConfig = {
  nombreRemitente: "Codew Agencia",
  emailRemitente: "hola@codew.pe",
  replyTo: "",
  dominio: "codew.pe",
  estadoDominio: "pendiente",
  registrosDns: generarRegistrosDns("codew.pe"),
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEmailConfig() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => config,
    () => config
  );
}

export function updateRemitente(data: { nombreRemitente: string; emailRemitente: string; replyTo: string }) {
  config = { ...config, ...data };
  emit();
}

// Registra un dominio nuevo (o reemplaza el actual) y genera sus registros DNS pendientes.
export function agregarDominio(dominio: string) {
  const limpio = dominio.trim().toLowerCase();
  if (!limpio) return;
  config = {
    ...config,
    dominio: limpio,
    estadoDominio: "pendiente",
    registrosDns: generarRegistrosDns(limpio),
  };
  emit();
}

// Simula la verificación contra Resend. En producción esto llama a la API de
// Resend, que resuelve los registros DNS reales del dominio.
export function verificarDominio() {
  config = { ...config, estadoDominio: "verificado" };
  emit();
}
