"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function EmailConfiguracionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración de Email" description="Remitente y dominio de envío (vía Resend)." />

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre del remitente</Label>
          <Input defaultValue="Codew Agencia" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Email del remitente</Label>
          <Input defaultValue="hola@codew.pe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Dominio propio</Label>
          <div className="flex items-center gap-2">
            <Input defaultValue="codew.pe" className="flex-1" />
            <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              DKIM sin verificar
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-fit">
          Verificar dominio
        </Button>
        <div className="border-t border-border pt-5">
          <Button className="bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
        </div>
      </div>
    </div>
  );
}
