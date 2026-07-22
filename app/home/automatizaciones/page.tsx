import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { automatizacionesKpis } from "@/lib/mock-data";

export default function AutomatizacionesDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Automatizaciones" description="Triggers basados en eventos de negocio, ejecutados con Trigger.dev." />
      <KpiRow items={automatizacionesKpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-error" />
          <h2 className="text-base font-semibold text-text-primary">Últimas ejecuciones fallidas</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { nombre: "Etiquetado interés curso", motivo: "Contacto sin email válido", fecha: "hoy 09:14" },
            { nombre: "Recordatorio de carrito", motivo: "Plantilla de email eliminada", fecha: "ayer 22:03" },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-text-primary">{f.nombre}</p>
                <p className="text-xs text-text-secondary">{f.motivo}</p>
              </div>
              <span className="text-xs text-text-muted">{f.fecha}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
