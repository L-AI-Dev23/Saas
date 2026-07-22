"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function CrmConfiguracionPage() {
  const [mostrarValorVenta, setMostrarValorVenta] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración de CRM" description="Renombra las etapas fijas y activa campos opcionales." />

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div>
          <p className="mb-3 text-sm font-semibold text-text-primary">Nombres de las etapas</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Etapa 1", value: "Nuevo" },
              { label: "Etapa 2", value: "En conversación" },
              { label: "Etapa 3", value: "Cliente" },
              { label: "Etapa 4", value: "Inactivo" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <Label className="w-20 shrink-0 text-xs text-text-muted">{s.label}</Label>
                <Input defaultValue={s.value} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Mostrar campo de valor de venta</p>
            <p className="text-xs text-text-secondary">Solo actívalo si vendes productos con precio.</p>
          </div>
          <Toggle isSelected={mostrarValorVenta} onChange={setMostrarValorVenta} aria-label="Mostrar campo de valor de venta" />
        </div>

        <div className="border-t border-border pt-5">
          <Button className="bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
        </div>
      </div>
    </div>
  );
}
