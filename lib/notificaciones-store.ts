"use client";

import { useSyncExternalStore } from "react";
import { notificacionesConfig } from "@/lib/mock-data";

export type NotificacionConfig = (typeof notificacionesConfig)[number];

let config: NotificacionConfig[] = notificacionesConfig;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useNotificacionesConfig() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => config,
    () => notificacionesConfig
  );
}

export function toggleNotificacion(evento: string, canal: "inapp" | "email") {
  config = config.map((n) => (n.evento === evento ? { ...n, [canal]: !n[canal] } : n));
  emit();
}
