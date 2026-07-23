"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { emailAutomatizaciones } from "@/lib/mock-data";

const eventos = ["Contacto nuevo", "Carrito abandonado", "Compra realizada", "Etiqueta agregada"];
const plantillas = ["Bienvenida", "Carrito abandonado", "Agradecimiento post-compra"];

export default function EmailAutomatizacionesPage() {
  const [evento, setEvento] = useState(eventos[0]);
  const [plantilla, setPlantilla] = useState(plantillas[0]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones de email"
        description="Correos que se disparan solos ante un evento (bienvenida, agradecimiento, recordatorio)."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva automatización
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva automatización de email</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input placeholder="Ej. Bienvenida a nuevo suscriptor" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Evento disparador</Label>
                  <SelectDropdown options={eventos} value={evento} onChange={setEvento} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Plantilla</Label>
                  <SelectDropdown options={plantillas} value={plantilla} onChange={setPlantilla} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button className="bg-cta text-white hover:bg-cta-hover">Activar automatización</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Evento disparador</th>
              <th className="px-5 py-3">Plantilla</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {emailAutomatizaciones.map((a) => (
              <tr key={a.id} className="hover:bg-surface">
                <td className="px-5 py-3 font-medium text-text-primary">{a.nombre}</td>
                <td className="px-5 py-3 text-text-secondary">{a.evento}</td>
                <td className="px-5 py-3 text-text-secondary">{a.plantilla}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={a.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}