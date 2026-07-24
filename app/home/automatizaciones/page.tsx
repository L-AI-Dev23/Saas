"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useAutomationRules } from "@/lib/automations-store";
import { useEmailAutomatizaciones } from "@/lib/email-automatizaciones-store";

export default function AutomatizacionesDashboardPage() {
  const reglas = useAutomationRules();
  const emailAutos = useEmailAutomatizaciones();

  const activas = reglas.filter((r) => r.estado);
  const emailActivas = emailAutos.filter((a) => a.estado === "Activa");

  const kpis = [
    { label: "Automatizaciones activas", value: activas.length.toString(), href: "/home/automatizaciones/activas" },
    { label: "Email automatizaciones activas", value: emailActivas.length.toString(), href: "/home/email/automatizaciones" },
    { label: "Total de reglas", value: (reglas.length + emailAutos.length).toString(), href: "/home/automatizaciones/activas" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones"
        description="Triggers basados en eventos de negocio."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/automatizaciones/activas">
              <Plus size={16} /> Nueva automatización
            </Link>
          </Button>
        }
      />

      <KpiRow items={kpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Reglas activas</h2>
        {activas.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            No tienes automatizaciones activas.{" "}
            <Link href="/home/automatizaciones/activas" className="text-cta underline">
              Crear una
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {activas.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{r.nombre}</p>
                  <p className="text-xs text-text-secondary">Evento: {r.evento}</p>
                </div>
                <span className="text-xs text-success font-semibold">Activa</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
