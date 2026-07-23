"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, ArrowRight, PartyPopper } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow, KpiRowSkeleton } from "@/components/dashboard/KpiCard";
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

  // Simula la carga de datos desde el backend. Hoy mock-data.ts es un import
  // síncrono, pero cuando esto se conecte a Supabase cada sección (KPIs,
  // gráfico, actividad) probablemente resuelva en momentos distintos —
  // por eso el loading vive acá y no en el import.
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Muestra un mensaje de éxito cuando el onboarding pasa de "con pendientes"
  // a "completo", en vez de que la caja desaparezca de golpe.
  const [showOnboardingSuccess, setShowOnboardingSuccess] = useState(false);
  const eraIncompleto = useRef(pendientes.length > 0);
  useEffect(() => {
    if (eraIncompleto.current && pendientes.length === 0) {
      setShowOnboardingSuccess(true);
      const t = setTimeout(() => setShowOnboardingSuccess(false), 4000);
      return () => clearTimeout(t);
    }
    eraIncompleto.current = pendientes.length > 0;
  }, [pendientes.length]);

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

      {pendientes.length === 0 && showOnboardingSuccess && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-5">
          <PartyPopper size={20} className="shrink-0 text-success" />
          <p className="text-sm font-medium text-text-primary">
            ¡Listo, ya configuraste todo! Tu cuenta está lista para trabajar a full.
          </p>
        </div>
      )}

      {isLoading ? <KpiRowSkeleton /> : <KpiRow items={kpisDashboard} />}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="flex h-[340px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Contactos nuevos</h2>
            <div className="flex gap-1 rounded-md bg-background p-1">
              {RANGOS.map((r) => (
                <button
                  key={r.dias}
                  onClick={() => setRangoDias(r.dias)}
                  disabled={isLoading}
                  className={
                    rangoDias === r.dias
                      ? "rounded px-2.5 py-1 text-xs font-medium bg-white text-text-primary shadow-sg-sm disabled:opacity-50"
                      : "rounded px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary disabled:opacity-50"
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="w-full flex-1 animate-pulse rounded-md bg-background" />
          ) : (
            <div className="min-h-0 flex-1">
              <ContactsChart data={datosChart} />
            </div>
          )}
        </div>

        <div className="flex h-[340px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Actividad reciente</h2>
          </div>
          {isLoading ? (
            <div className="flex flex-col gap-4 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5 border-l-2 border-border py-2 pl-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-border" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-border" />
                  <div className="h-2.5 w-10 animate-pulse rounded bg-border" />
                </div>
              ))}
            </div>
          ) : actividadReciente.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-muted">
              Sin actividad reciente todavía.
            </p>
          ) : (
            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {actividadReciente.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex flex-col gap-1 rounded-md border-l-2 border-border py-2 pl-3 pr-2 transition-colors hover:border-cta hover:bg-background"
                  >
                    <span className="text-xs font-semibold text-cta">{item.modulo}</span>
                    <span className="text-sm text-text-primary">{item.texto}</span>
                    <span className="text-xs text-text-muted">{item.tiempo}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
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