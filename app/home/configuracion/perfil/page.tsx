"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";

const zonasHorarias = ["America/Lima"];

export default function PerfilPage() {
  const [zonaHoraria, setZonaHoraria] = useState(zonasHorarias[0]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Perfil" description="Datos de tu negocio y de tu cuenta personal." />

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Negocio</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre del negocio</Label>
              <Input defaultValue="Codew Agencia" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Zona horaria</Label>
              <SelectDropdown options={zonasHorarias} value={zonaHoraria} onChange={setZonaHoraria} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Usuario</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dashboard-bg text-lg font-semibold text-text-secondary">
              L
            </div>
            <button className="text-xs font-semibold text-cta hover:underline">Cambiar foto</button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre completo</Label>
              <Input defaultValue="Luis Ramírez" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Teléfono</Label>
              <Input defaultValue="+51 987 654 321" />
            </div>
          </div>
        </div>

        <Button className="w-fit bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
      </div>
    </div>
  );
}
