"use client";

import { useSyncExternalStore } from "react";
import { emailPlantillas } from "@/lib/mock-data";

export type EmailPlantilla = (typeof emailPlantillas)[number];

export interface EmailPlantillaInput {
  nombre: string;
  asunto: string;
  cuerpo: string;
}

let plantillas: EmailPlantilla[] = emailPlantillas;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEmailPlantillas() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => plantillas,
    () => emailPlantillas
  );
}

// Snapshot no-reactivo, útil para leer una plantilla puntual en la página de detalle.
export function getEmailPlantilla(id: number) {
  return plantillas.find((p) => p.id === id) ?? null;
}

export function addEmailPlantilla(data: Partial<EmailPlantillaInput> = {}) {
  const nextId = plantillas.length ? Math.max(...plantillas.map((p) => p.id)) + 1 : 1;
  plantillas = [
    ...plantillas,
    {
      id: nextId,
      nombre: data.nombre?.trim() || "Nueva plantilla",
      asunto: data.asunto ?? "",
      cuerpo: data.cuerpo ?? "",
      editado: "recién creada",
    },
  ];
  emit();
  return nextId;
}

export function updateEmailPlantilla(id: number, data: Partial<EmailPlantillaInput>) {
  plantillas = plantillas.map((p) => (p.id === id ? { ...p, ...data, editado: "hace instantes" } : p));
  emit();
}

export function duplicateEmailPlantilla(id: number) {
  const original = plantillas.find((p) => p.id === id);
  if (!original) return null;
  const nextId = Math.max(...plantillas.map((p) => p.id)) + 1;
  const copia = { ...original, id: nextId, nombre: `${original.nombre} (copia)`, editado: "recién creada" };
  plantillas = [...plantillas, copia];
  emit();
  return nextId;
}

export function deleteEmailPlantilla(id: number) {
  plantillas = plantillas.filter((p) => p.id !== id);
  emit();
}
