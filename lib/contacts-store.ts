"use client";

import { useSyncExternalStore } from "react";
import { contactos } from "@/lib/mock-data";

export type Contacto = (typeof contactos)[number];

export interface ContactoInput {
  nombre: string;
  email: string;
  telefono: string;
  origen: string;
  etapa: string;
  tags: string[];
}

let registros: Contacto[] = contactos;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useContactos() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => registros,
    () => contactos
  );
}

export function addContacto(data: ContactoInput) {
  const nextId = registros.length ? Math.max(...registros.map((r) => r.id)) + 1 : 1;
  registros = [...registros, { id: nextId, tiempo: "hace instantes", ...data }];
  emit();
}

export function updateContacto(id: number, data: Partial<ContactoInput>) {
  registros = registros.map((r) => (r.id === id ? { ...r, ...data } : r));
  emit();
}

export function deleteContacto(id: number) {
  registros = registros.filter((r) => r.id !== id);
  emit();
}

export function addTagToContacto(id: number, tag: string) {
  registros = registros.map((r) =>
    r.id === id && !r.tags.includes(tag) ? { ...r, tags: [...r.tags, tag] } : r
  );
  emit();
}

export function removeTagFromContacto(id: number, tag: string) {
  registros = registros.map((r) =>
    r.id === id ? { ...r, tags: r.tags.filter((t) => t !== tag) } : r
  );
  emit();
}
