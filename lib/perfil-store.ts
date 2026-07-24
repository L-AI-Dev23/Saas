"use client";

import { useSyncExternalStore } from "react";

export interface PerfilConfig {
  nombreNegocio: string;
  zonaHoraria: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
}

let perfil: PerfilConfig = {
  nombreNegocio: "Codew Agencia",
  zonaHoraria: "America/Lima",
  nombreCompleto: "Luis Ramírez",
  email: "luis@codew.pe",
  telefono: "+51 987 654 321",
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function usePerfil() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => perfil,
    () => perfil
  );
}

export function updatePerfil(data: Partial<PerfilConfig>) {
  perfil = { ...perfil, ...data };
  emit();
}
