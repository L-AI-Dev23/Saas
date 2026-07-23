"use client";

import { useSyncExternalStore } from "react";
import { automatizacionesActivas } from "@/lib/mock-data";

export type ReglaAutomatizacion = (typeof automatizacionesActivas)[number];

export interface AutomationRuleInput {
  nombre: string;
  evento: string;
  pasos: string[];
}

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

export function addAutomationRule(data: AutomationRuleInput) {
  const nextId = reglas.length ? Math.max(...reglas.map((r) => r.id)) + 1 : 1;
  reglas = [...reglas, { id: nextId, estado: true, ...data }];
  emit();
}

export function updateAutomationRule(id: number, data: AutomationRuleInput) {
  reglas = reglas.map((r) => (r.id === id ? { ...r, ...data } : r));
  emit();
}

export function duplicateAutomationRule(id: number) {
  const original = reglas.find((r) => r.id === id);
  if (!original) return;
  const nextId = Math.max(...reglas.map((r) => r.id)) + 1;
  reglas = [
    ...reglas,
    { ...original, id: nextId, nombre: `${original.nombre} (copia)`, estado: false },
  ];
  emit();
}

export function deleteAutomationRule(id: number) {
  reglas = reglas.filter((r) => r.id !== id);
  emit();
}

export function toggleAutomationRule(id: number) {
  reglas = reglas.map((r) => (r.id === id ? { ...r, estado: !r.estado } : r));
  emit();
}
