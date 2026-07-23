"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { Toggle } from "@/components/base/toggle/toggle";
import { automatizacionesActivas } from "@/lib/mock-data";

const eventos = ["Carrito abandonado", "Contacto nuevo", "Compra realizada", "Etiqueta agregada", "Formulario enviado"];
const acciones = ["Enviar email", "Agregar etiqueta", "Esperar X días", "Crear notificación"];

export default function AutomatizacionesActivasPage() {
  const [evento, setEvento] = useState(eventos[0]);
  const [accion, setAccion] = useState(acciones[0]);
  const [reglas, setReglas] = useState(automatizacionesActivas);

  const toggleEstado = (id: (typeof automatizacionesActivas)[number]["id"]) => {
    setReglas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: !r.estado } : r)));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones activas"
        description="Reglas activas de disparador → acción."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva automatización
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva automatización</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input placeholder="Ej. Recordatorio de carrito" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Evento disparador</Label>
                  <SelectDropdown options={eventos} value={evento} onChange={setEvento} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Acción</Label>
                  <SelectDropdown options={acciones} value={accion} onChange={setAccion} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button className="bg-cta text-white hover:bg-cta-hover">Guardar y activar</Button>
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
                  <Toggle isSelected={a.estado} onChange={() => toggleEstado(a.id)} aria-label={`Activar ${a.nombre}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}