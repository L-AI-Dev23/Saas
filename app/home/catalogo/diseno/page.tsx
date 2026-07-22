"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { FileUploadDropZone } from "@/components/application/file-upload/file-upload-base";
import { cn } from "@/lib/utils";
import {
  WhatsappLogo,
  InstagramLogo,
} from "@phosphor-icons/react/dist/ssr";

const botonesContacto = ["WhatsApp", "Instagram", "Messenger"];

export default function DisenoPage() {
  const [botonContacto, setBotonContacto] = useState(botonesContacto[0]);

  const [colorPrimario, setColorPrimario] = useState("#f65858");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Diseño de la página"
        description="Así se verá tu catálogo público en tudominio.com/c/codew."
        action={
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface"
          >
            Ver página pública <ExternalLink size={14} />
          </a>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Controles */}
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-5 shadow-sg-sm">
          <div className="flex flex-col gap-1.5">
            <Label>Logo</Label>
            <FileUploadDropZone accept="image/*" hint="SVG, PNG o JPG (máx. 2MB)" allowsMultiple={false} maxSize={2 * 1024 * 1024} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Portada</Label>
            <FileUploadDropZone accept="image/*" hint="SVG, PNG o JPG (máx. 5MB)" allowsMultiple={false} maxSize={5 * 1024 * 1024} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Color primario</Label>
            <div className="flex gap-2">
              {["#f65858", "#00c98d", "#009fc1", "#111827"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColorPrimario(c)}
                  aria-label={`Color ${c}`}
                  className={cn(
                    "h-7 w-7 rounded-full border border-border ring-offset-2 transition",
                    colorPrimario === c && "ring-2 ring-cta"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Botón de contacto</Label>
            <SelectDropdown options={botonesContacto} value={botonContacto} onChange={setBotonContacto} />
          </div>
          <Button className="bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-2xl border border-border bg-dashboard-bg p-6">
          <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-sg-md">
            <div className="h-24 bg-accent/20" />
            <div className="flex flex-col items-center gap-2 border-b border-border p-4 text-center">
              <div className="-mt-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-accent text-white font-bold">
                C
              </div>
              <p className="text-sm font-semibold text-text-primary">Codew Agencia</p>
              <p className="text-xs text-text-secondary">Cursos y plantillas para tu negocio</p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {["Curso de Excel", "Plantilla Finanzas", "Mentoría 1:1", "Curso Power BI"].map((n) => (
                <div key={n} className="rounded-lg border border-border p-2">
                  <div className="mb-2 h-14 rounded-md bg-surface" />
                  <p className="text-[11px] font-medium text-text-primary">{n}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center p-4">
              <span className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white">
                <WhatsappLogo size={14} weight="fill" /> Contactar por WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
