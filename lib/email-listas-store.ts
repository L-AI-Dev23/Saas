"use client";

import { useSyncExternalStore } from "react";
import { emailListas } from "@/lib/mock-data";

export type EmailLista = (typeof emailListas)[number];

export interface EmailListaInput {
  nombre: string;
  tipo: "Manual" | "Dinámica";
}

let listas: EmailLista[] = emailListas;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEmailListas() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => listas,
    () => emailListas
  );
}

export function addEmailLista(data: EmailListaInput) {
  const nextId = listas.length ? Math.max(...listas.map((l) => l.id)) + 1 : 1;
  listas = [...listas, { id: nextId, contactos: 0, actualizado: "recién creada", ...data }];
  emit();
  return nextId;
}

export function deleteEmailLista(id: number) {
  listas = listas.filter((l) => l.id !== id);
  emit();
}
