"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { emailCampanas } from "@/lib/mock-data";

const listas = ["Newsletter general", "Clientes VIP", "No compró en 30 días"];
const plantillas = ["Newsletter mensual", "Bienvenida"];

export default function EmailCampanasPage() {
  const [lista, setLista] = useState(listas[0]);
  const [plantilla, setPlantilla] = useState(plantillas[0]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Campañas de email"
        description="Lanza envíos masivos y revisa el reporte de cada una."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva campaña
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva campaña</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre de la campaña</Label>
                  <Input placeholder="Ej. Lanzamiento de curso nuevo" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Lista destino</Label>
                  <SelectDropdown options={listas} value={lista} onChange={setLista} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Plantilla</Label>
                  <SelectDropdown options={plantillas} value={plantilla} onChange={setPlantilla} />
                </div>
                <p className="text-xs text-text-muted">Paso siguiente: elegir enviar ahora o programar fecha.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Continuar</Button>
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
              <th className="px-5 py-3">Lista destino</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {emailCampanas.map((c) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                <td className="px-5 py-3 text-text-secondary">{c.lista}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={c.estado} />
                </td>
                <td className="px-5 py-3 text-text-secondary">{c.fecha}</td>
                <td className="px-5 py-3 text-right">
                  {c.estado === "Enviada" && (
                    <button className="text-xs font-semibold text-cta hover:underline">Ver reporte</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}