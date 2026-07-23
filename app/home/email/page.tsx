"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { EnviosChart } from "@/components/dashboard/EnviosChart";
import { emailKpis, emailCampanas, emailEnviosPorDia } from "@/lib/mock-data";

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

export default function EmailDashboardPage() {
  const [rangoDias, setRangoDias] = useState(30);

  // Nota: el mock solo tiene 30 días de datos. Con datos reales, "90 días"
  // haría un query distinto en vez de solo recortar el array.
  const datosChart = emailEnviosPorDia.slice(-Math.min(rangoDias, emailEnviosPorDia.length));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Email"
        description="Métricas generales de tu panel de Email marketing."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/email/campanas">
              <Plus size={16} /> Nueva campaña
            </Link>
          </Button>
        }
      />

      <KpiRow items={emailKpis} />

      <div id="envios-chart" className="mt-8 flex h-[320px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Envíos por día</h2>
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
          <EnviosChart data={datosChart} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Campañas recientes</h2>
        {emailCampanas.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="text-center text-sm text-text-muted">Todavía no enviaste ninguna campaña.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Lista</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {emailCampanas.map((c) => (
                  <tr key={c.id} className="hover:bg-surface">
                    <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                    <td className="px-5 py-3 text-text-secondary">{c.lista}</td>
                    <td className="px-5 py-3">
                      <StatusBadge label={c.estado} />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{c.fecha}</td>
                    <td className="px-5 py-3 text-right">
                      {c.estado === "Enviada" && (
                        <Link href="/home/email/campanas" className="text-xs font-semibold text-cta hover:underline">
                          Ver reporte
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
