"use client";

import { useSyncExternalStore } from "react";
import { equipo } from "@/lib/mock-data";

export type MiembroEquipo = (typeof equipo)[number];

export interface InvitacionInput {
  email: string;
  rol: "admin" | "empleado";
  modulos: string[];
}

let miembros: MiembroEquipo[] = equipo;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEquipo() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => miembros,
    () => equipo
  );
}

export function invitarMiembro(data: InvitacionInput) {
  const nextId = miembros.length ? Math.max(...miembros.map((m) => m.id)) + 1 : 1;
  const nombreDesdeEmail = data.email.split("@")[0];
  miembros = [
    ...miembros,
    {
      id: nextId,
      nombre: nombreDesdeEmail,
      email: data.email,
      rol: data.rol,
      modulos: data.rol === "admin" ? ["Todos"] : data.modulos,
      estado: "Invitado",
    },
  ];
  emit();
  return nextId;
}

export function reenviarInvitacion(id: number) {
  // No hay backend real de emails todavía; esto solo confirma la acción en UI.
  return miembros.find((m) => m.id === id) ?? null;
}

export function actualizarMiembro(id: number, data: Partial<InvitacionInput>) {
  miembros = miembros.map((m) => {
    if (m.id !== id) return m;
    const rolEfectivo = data.rol ?? m.rol;
    return {
      ...m,
      ...data,
      modulos: rolEfectivo === "admin" ? ["Todos"] : data.modulos ?? m.modulos,
    };
  });
  emit();
}

export function eliminarMiembro(id: number) {
  miembros = miembros.filter((m) => m.id !== id);
  emit();
}
