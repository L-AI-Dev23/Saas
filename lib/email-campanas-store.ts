"use client";

import { useSyncExternalStore } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { emailCampanas } from "@/lib/mock-data";

export type EmailCampana = (typeof emailCampanas)[number];
export type ReporteCampana = NonNullable<EmailCampana["reporte"]>;

export interface EmailCampanaInput {
  nombre: string;
  lista: string;
  plantilla: string;
}

let campanas: EmailCampana[] = emailCampanas;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function useEmailCampanas() {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => campanas,
    () => emailCampanas
  );
}

export function getEmailCampana(id: number) {
  return campanas.find((c) => c.id === id) ?? null;
}

function crear(data: EmailCampanaInput, estado: string, fecha: string) {
  const nextId = campanas.length ? Math.max(...campanas.map((c) => c.id)) + 1 : 1;
  campanas = [...campanas, { id: nextId, ...data, estado, fecha, reporte: null }];
  emit();
  return nextId;
}

// Genera métricas de reporte simuladas pero plausibles a partir del tamaño de la lista.
function simularReporte(contactosLista: number): ReporteCampana {
  const enviados = Math.max(contactosLista, 1);
  const tasaApertura = 0.45 + Math.random() * 0.25; // 45% - 70%
  const aperturas = Math.round(enviados * tasaApertura);
  const tasaClic = 0.15 + Math.random() * 0.2; // 15% - 35% de quienes abrieron
  const clics = Math.round(aperturas * tasaClic);
  const rebotes = Math.round(enviados * (0.005 + Math.random() * 0.015)); // 0.5% - 2%
  return { enviados, aperturas, clics, rebotes };
}

export function crearBorrador(data: EmailCampanaInput) {
  return crear(data, "Borrador", "—");
}

export function enviarAhora(data: EmailCampanaInput, contactosLista: number) {
  const fecha = format(new Date(), "d MMM yyyy", { locale: es });
  const nextId = campanas.length ? Math.max(...campanas.map((c) => c.id)) + 1 : 1;
  campanas = [
    ...campanas,
    { id: nextId, ...data, estado: "Enviada", fecha, reporte: simularReporte(contactosLista) },
  ];
  emit();
  return nextId;
}

export function programar(data: EmailCampanaInput, fecha: string) {
  return crear(data, "Programada", fecha);
}

export function enviarCampanaExistente(id: number, contactosLista: number) {
  const fecha = format(new Date(), "d MMM yyyy", { locale: es });
  campanas = campanas.map((c) =>
    c.id === id ? { ...c, estado: "Enviada", fecha, reporte: simularReporte(contactosLista) } : c
  );
  emit();
}

export function updateEmailCampana(id: number, data: Partial<EmailCampanaInput>) {
  campanas = campanas.map((c) => (c.id === id ? { ...c, ...data } : c));
  emit();
}

export function deleteEmailCampana(id: number) {
  campanas = campanas.filter((c) => c.id !== id);
  emit();
}
