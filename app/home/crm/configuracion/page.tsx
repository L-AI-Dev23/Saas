"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  useEtapasCrm,
  useMostrarValorVenta,
  setEtapasLabels,
  setMostrarValorVenta,
} from "@/lib/crm-config-store";

export default function CrmConfiguracionPage() {
  const etapas = useEtapasCrm();
  const mostrarValorVentaGuardado = useMostrarValorVenta();

  const [labels, setLabels] = useState<Record<string, string>>(() =>
    Object.fromEntries(etapas.map((e) => [e.key, e.label]))
  );
  const [mostrarValorVenta, setMostrarValorVentaLocal] = useState(mostrarValorVentaGuardado);
  const [guardado, setGuardado] = useState(false);

  function guardarCambios() {
    setEtapasLabels(labels);
    setMostrarValorVenta(mostrarValorVenta);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración de CRM" description="Renombra las etapas fijas y activa campos opcionales." />

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div>
          <p className="mb-3 text-sm font-semibold text-text-primary">Nombres de las etapas</p>
          <div className="flex flex-col gap-3">
            {etapas.map((etapa, i) => (
              <div key={etapa.key} className="flex items-center gap-3">
                <Label className="w-20 shrink-0 text-xs text-text-muted">Etapa {i + 1}</Label>
                <Input
                  value={labels[etapa.key] ?? etapa.label}
                  onChange={(e) => setLabels((prev) => ({ ...prev, [etapa.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Estos nombres se reflejan en Contactos y en el formulario de nuevo contacto.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Mostrar campo de valor de venta</p>
            <p className="text-xs text-text-secondary">Solo actívalo si vendes productos con precio.</p>
          </div>
          <Toggle
            isSelected={mostrarValorVenta}
            onChange={setMostrarValorVentaLocal}
            aria-label="Mostrar campo de valor de venta"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-5">
          <Button className="bg-cta text-white hover:bg-cta-hover" onClick={guardarCambios}>
            Guardar cambios
          </Button>
          {guardado && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <Check size={14} /> Cambios guardados
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
