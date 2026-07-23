"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { ContactsChart } from "@/components/dashboard/ContactsChart";
import { kpisDashboard, actividadReciente, onboardingSteps, contactosNuevosPorDia } from "@/lib/mock-data";

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

export default function HomePage() {
  const pendientes = onboardingSteps.filter((s) => !s.done);
  const [rangoDias, setRangoDias] = useState(30);

  // Nota: el mock solo tiene 30 días de datos. Con datos reales de Supabase,
  // "90 días" haría un query distinto en vez de solo recortar el array.
  const datosChart = contactosNuevosPorDia.slice(-Math.min(rangoDias, contactosNuevosPorDia.length));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Hola de nuevo 👋"
        description="Esto es lo que pasó en tu negocio hoy y esta semana, en todos los módulos."
      />

      {pendientes.length > 0 && (
        <div className="mb-8 rounded-lg border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">
              Completa tu configuración inicial
            </h2>
            <span className="text-sm font-medium text-text-secondary">
              {onboardingSteps.length - pendientes.length}/{onboardingSteps.length} completados
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {onboardingSteps.map((step) =>
              step.done ? (
                <div
                  key={step.step}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sg-sm"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-cta" />
                  <span className="text-sm text-text-muted line-through">{step.label}</span>
                </div>
              ) : (
                <Link
                  key={step.step}
                  href={step.href}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sg-sm transition-shadow hover:shadow-sg-md"
                >
                  <Circle size={18} className="shrink-0 text-text-muted" />
                  <span className="text-sm font-medium text-text-primary">{step.label}</span>
                  <ArrowRight size={16} className="ml-auto shrink-0 text-cta" />
                </Link>
              )
            )}
          </div>
        </div>
      )}

      <KpiRow items={kpisDashboard} />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Contactos nuevos</h2>
            <div className="flex gap-1 rounded-md bg-background p-1">
              {RANGOS.map((r) => (
                <button
                  key={r.dias}
                  onClick={() => setRangoDias(r.dias)}
                  className={
                    rangoDias === r.dias
                      ? "rounded px-2.5 py-1 text-xs font-medium bg-white text-text-primary shadow-sg-sm"
                      : "rounded px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <ContactsChart data={datosChart} />
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Actividad reciente</h2>
          </div>
          <ul className="flex flex-col gap-1">
            {actividadReciente.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className="flex flex-col gap-0.5 rounded-md border-l-2 border-border py-1.5 pl-3 pr-2 transition-colors hover:border-cta hover:bg-background"
                >
                  <span className="text-xs font-semibold text-cta">{item.modulo}</span>
                  <span className="text-sm text-text-primary">{item.texto}</span>
                  <span className="text-xs text-text-muted">{item.tiempo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Ver conversaciones pendientes", href: "/home/inbox" },
          { label: "Crear un chatbot", href: "/home/chatbots/plantillas" },
          { label: "Lanzar una campaña de email", href: "/home/email/campanas" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center justify-between rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
          >
            <span className="text-sm font-semibold text-text-primary">{a.label}</span>
            <ArrowRight size={16} className="text-cta" />
          </Link>
        ))}
      </div>
    </div>
  );
}
