"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ExecutionsChart } from "@/components/dashboard/ExecutionsChart";
import { automatizacionesKpis, automatizacionesFallidas, automatizacionesEjecucionesPorDia } from "@/lib/mock-data";

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

export default function AutomatizacionesDashboardPage() {
  const [rangoDias, setRangoDias] = useState(30);

  // Nota: el mock solo tiene 30 días de datos. Con datos reales, "90 días"
  // haría un query distinto en vez de solo recortar el array.
  const datosChart = automatizacionesEjecucionesPorDia.slice(
    -Math.min(rangoDias, automatizacionesEjecucionesPorDia.length)
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones"
        description="Triggers basados en eventos de negocio, ejecutados con Trigger.dev."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/automatizaciones/activas">
              <Plus size={16} /> Nueva automatización
            </Link>
          </Button>
        }
      />

      <KpiRow items={automatizacionesKpis} />

      <div id="ejecuciones-chart" className="mt-8 flex h-[320px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Ejecuciones por día</h2>
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
        <div className="min-h-0 flex-1">
          <ExecutionsChart data={datosChart} />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-error" />
          <h2 className="text-base font-semibold text-text-primary">Últimas ejecuciones fallidas</h2>
        </div>
        {automatizacionesFallidas.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">
            Sin ejecuciones fallidas recientes 🎉
          </p>
        ) : (
          <div className="divide-y divide-border">
            {automatizacionesFallidas.map((f) => (
              <Link
                key={f.id}
                href={f.href}
                className="flex items-center justify-between gap-3 rounded-md py-3 pl-2 pr-2 transition-colors hover:bg-background"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text-primary">{f.nombre}</p>
                  <p className="text-xs text-text-secondary">{f.motivo}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-text-muted">{f.fecha}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
