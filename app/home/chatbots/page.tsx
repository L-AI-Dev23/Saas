"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { MessagesChart } from "@/components/dashboard/MessagesChart";
import { chatbotsKpis, chatbotsActivos, chatbotsMensajesPorDia } from "@/lib/mock-data";

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

export default function ChatbotsDashboardPage() {
  const necesitanAtencion = chatbotsActivos.filter((b) => b.estado === "Necesita atención");
  const [rangoDias, setRangoDias] = useState(30);

  // Nota: el mock solo tiene 30 días de datos. Con datos reales, "90 días"
  // haría un query distinto en vez de solo recortar el array.
  const datosChart = chatbotsMensajesPorDia.slice(-Math.min(rangoDias, chatbotsMensajesPorDia.length));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Chatbots"
        description="Automatizaciones conversacionales dentro de tus redes sociales."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/chatbots/plantillas">
              <Plus size={16} /> Nuevo chatbot
            </Link>
          </Button>
        }
      />

      <KpiRow items={chatbotsKpis} />

      {necesitanAtencion.length > 0 && (
        <div className="mt-8 flex flex-col gap-2 rounded-lg border border-error/30 bg-error/5 p-4">
          {necesitanAtencion.map((bot) => (
            <div key={bot.id} className="flex items-center gap-3">
              <AlertTriangle size={18} className="shrink-0 text-error" />
              <p className="text-sm text-text-primary">
                <span className="font-semibold">{bot.nombre}</span> necesita atención — el post/video
                vinculado ya no está disponible.{" "}
                <Link href="/home/chatbots/activos" className="font-semibold text-error underline">
                  Revisar
                </Link>
              </p>
            </div>
          ))}
        </div>
      )}

      <div id="mensajes-chart" className="mt-8 flex h-[320px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Mensajes por día</h2>
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
          <MessagesChart data={datosChart} />
        </div>
      </div>
    </div>
  );
}
