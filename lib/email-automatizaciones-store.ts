"use client";

import { useSyncExternalStore } from "react";
import { emailAutomatizaciones } from "@/lib/mock-data";

export type EmailAutomatizacion = (typeof emailAutomatizaciones)[number];

export interface EmailAutomatizacionInput {
  nombre: string;
  evento: string;
  plantilla: string;
}

let automatizaciones: EmailAutomatizacion[] = emailAutomatizaciones;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEmailAutomatizaciones() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => automatizaciones,
    () => emailAutomatizaciones
  );
}

export function addEmailAutomatizacion(data: EmailAutomatizacionInput) {
  const nextId = automatizaciones.length ? Math.max(...automatizaciones.map((a) => a.id)) + 1 : 1;
  automatizaciones = [...automatizaciones, { id: nextId, estado: "Activa", ...data }];
  emit();
  return nextId;
}

export function updateEmailAutomatizacion(id: number, data: Partial<EmailAutomatizacionInput>) {
  automatizaciones = automatizaciones.map((a) => (a.id === id ? { ...a, ...data } : a));
  emit();
}

export function toggleEmailAutomatizacion(id: number) {
  automatizaciones = automatizaciones.map((a) =>
    a.id === id ? { ...a, estado: a.estado === "Activa" ? "Pausada" : "Activa" } : a
  );
  emit();
}

export function deleteEmailAutomatizacion(id: number) {
  automatizaciones = automatizaciones.filter((a) => a.id !== id);
  emit();
}
