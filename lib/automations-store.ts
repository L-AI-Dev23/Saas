"use client";

import { useSyncExternalStore } from "react";
import { automatizacionesActivas } from "@/lib/mock-data";

export type ReglaAutomatizacion = (typeof automatizacionesActivas)[number];

let reglas: ReglaAutomatizacion[] = automatizacionesActivas;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useAutomationRules() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => reglas,
    () => automatizacionesActivas
  );
}

export function addAutomationRule(data: { nombre: string; evento: string; accion: string }) {
  const nextId = reglas.length ? Math.max(...reglas.map((r) => r.id)) + 1 : 1;
  reglas = [...reglas, { id: nextId, estado: true, ...data }];
  emit();
}

export function toggleAutomationRule(id: number) {
  reglas = reglas.map((r) => (r.id === id ? { ...r, estado: !r.estado } : r));
  emit();
}
