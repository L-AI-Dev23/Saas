"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toggle } from "@/components/base/toggle/toggle";
import { AutomationConfigModal } from "@/components/dashboard/AutomationConfigModal";
import { useAutomationRules, addAutomationRule, toggleAutomationRule } from "@/lib/automations-store";

export default function AutomatizacionesActivasPage() {
  const reglas = useAutomationRules();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones activas"
        description="Reglas activas de disparador → acción."
        action={
          <AutomationConfigModal
            trigger={
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva automatización
              </Button>
            }
            onSave={addAutomationRule}
          />
        }
      />

      {reglas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes automatizaciones activas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una desde cero o parte de una plantilla en la sección Plantillas.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Evento disparador</th>
                <th className="px-5 py-3">Acción</th>
                <th className="px-5 py-3">Activa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reglas.map((a) => (
                <tr key={a.id} className="hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{a.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.evento}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.accion}</td>
                  <td className="px-5 py-3">
                    <Toggle isSelected={a.estado} onChange={() => toggleAutomationRule(a.id)} aria-label={`Activar ${a.nombre}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
