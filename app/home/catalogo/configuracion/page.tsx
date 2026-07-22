"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { TextArea } from "@/components/base/textarea/textarea";

const monedas = ["PEN (S/)", "USD ($)"];

export default function CatalogoConfiguracionPage() {
  const [moneda, setMoneda] = useState(monedas[0]);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración del catálogo" description="Slug, dominio, SEO y moneda de tu página pública." />

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div className="flex flex-col gap-1.5">
          <Label>Slug</Label>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>tudominio.com/c/</span>
            <Input defaultValue="codew" className="max-w-[160px]" />
            <span className="text-xs font-semibold text-success">Disponible</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Dominio personalizado</Label>
          <Input placeholder="catalogo.codew.pe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Título SEO</Label>
          <Input defaultValue="Codew — Cursos y plantillas para tu negocio" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Meta descripción</Label>
          <TextArea
            rows={2}
            defaultValue="Cursos de Excel, Power BI y plantillas de finanzas para negocios en Perú."
            aria-label="Meta descripción"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Moneda</Label>
          <SelectDropdown options={monedas} value={moneda} onChange={setMoneda} className="w-32" />
        </div>
        <div className="border-t border-border pt-5">
          <Button className="bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
        </div>
      </div>
    </div>
  );
}
