"use client";

import { useSyncExternalStore } from "react";

export interface EtapaCrm {
  key: string;
  label: string;
}

// Las 4 etapas son fijas (el key no cambia), pero el label es editable desde
// Configuración de CRM y se refleja en Contactos y en el modal de nuevo contacto.
let etapas: EtapaCrm[] = [
  { key: "nuevo", label: "Nuevo" },
  { key: "en_conversacion", label: "En conversación" },
  { key: "cliente", label: "Cliente" },
  { key: "inactivo", label: "Inactivo" },
];

let mostrarValorVenta = false;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function useEtapasCrm() {
  return useSyncExternalStore(
    subscribe,
    () => etapas,
    () => etapas
  );
}

export function useMostrarValorVenta() {
  return useSyncExternalStore(
    subscribe,
    () => mostrarValorVenta,
    () => mostrarValorVenta
  );
}

export function setEtapaLabel(key: string, label: string) {
  etapas = etapas.map((e) => (e.key === key ? { ...e, label } : e));
  emit();
}

export function setEtapasLabels(labels: Record<string, string>) {
  etapas = etapas.map((e) => (labels[e.key] !== undefined ? { ...e, label: labels[e.key] } : e));
  emit();
}

export function setMostrarValorVenta(value: boolean) {
  mostrarValorVenta = value;
  emit();
}

// Snapshot no-reactivo, útil cuando se necesita el label fuera de un componente React.
export function getEtapas() {
  return etapas;
}
