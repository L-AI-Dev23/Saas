"use client";

import { useSyncExternalStore } from "react";
import { crmTags } from "@/lib/mock-data";
import { removeTagFromAllContactos } from "@/lib/contacts-store";

export type CrmTag = (typeof crmTags)[number];

export interface TagInput {
  nombre: string;
  color: string;
}

let tags: CrmTag[] = crmTags;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useTags() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => tags,
    () => crmTags
  );
}

export function addTag(data: TagInput) {
  const nextId = tags.length ? Math.max(...tags.map((t) => t.id)) + 1 : 1;
  tags = [...tags, { id: nextId, contactos: 0, ...data }];
  emit();
  return nextId;
}

export function deleteTag(id: number) {
  const tag = tags.find((t) => t.id === id);
  if (!tag) return;
  tags = tags.filter((t) => t.id !== id);
  // Al eliminar una etiqueta, también se quita de los contactos que la tenían.
  removeTagFromAllContactos(tag.nombre);
  emit();
}

export function renameTag(id: number, data: Partial<TagInput>) {
  tags = tags.map((t) => (t.id === id ? { ...t, ...data } : t));
  emit();
}
