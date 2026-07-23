"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ContactsChart } from "@/components/dashboard/ContactsChart";
import { crmKpis, contactos, contactosNuevosPorDia } from "@/lib/mock-data";

const etapas: Record<string, string> = {
  nuevo: "Nuevo",
  en_conversacion: "En conversación",
  cliente: "Cliente",
  inactivo: "Inactivo",
};

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

export default function CrmDashboardPage() {
  const recientes = contactos.slice(0, 5);
  const [rangoDias, setRangoDias] = useState(30);

  // Nota: el mock solo tiene 30 días de datos. Con datos reales, "90 días"
  // haría un query distinto en vez de solo recortar el array.
  const datosChart = contactosNuevosPorDia.slice(-Math.min(rangoDias, contactosNuevosPorDia.length));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="CRM"
        description="Leads nuevos, conversión a cliente y actividad reciente."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/crm/contactos">
              <Plus size={16} /> Nuevo contacto
            </Link>
          </Button>
        }
      />

      <KpiRow items={crmKpis} />

      <div id="leads-chart" className="mt-8 flex h-[320px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Leads nuevos por día</h2>
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
          <ContactsChart data={datosChart} />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Actividad reciente de contactos</h2>
        {recientes.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">Sin actividad reciente todavía.</p>
        ) : (
          <div className="divide-y divide-border">
            {recientes.map((c) => (
              <Link
                key={c.id}
                href="/home/crm/contactos"
                className="flex items-center justify-between gap-3 rounded-md py-3 pl-2 pr-2 transition-colors hover:bg-background"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dashboard-bg text-xs font-semibold text-text-secondary">
                    {c.nombre.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-text-primary">{c.nombre}</span>
                      <StatusBadge label={etapas[c.etapa] ?? c.etapa} />
                    </div>
                    {c.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <span key={t} className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-text-muted">
                  <span>Origen: {c.origen}</span>
                  <span>·</span>
                  <span>{c.tiempo}</span>
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
