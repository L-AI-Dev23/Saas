"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";

export const eventosAutomatizacion = [
  "Carrito abandonado",
  "Contacto nuevo",
  "Compra realizada",
  "Etiqueta agregada",
  "Formulario enviado",
];
export const accionesAutomatizacion = ["Enviar email", "Agregar etiqueta", "Esperar X días", "Crear notificación"];

export interface AutomationConfigResult {
  nombre: string;
  evento: string;
  accion: string;
}

export function AutomationConfigModal({
  trigger,
  title = "Nueva automatización",
  initialNombre = "",
  initialEvento = eventosAutomatizacion[0],
  initialAccion = accionesAutomatizacion[0],
  onSave,
}: {
  trigger: React.ReactNode;
  title?: string;
  initialNombre?: string;
  initialEvento?: string;
  initialAccion?: string;
  onSave: (result: AutomationConfigResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(initialNombre);
  const [evento, setEvento] = useState(initialEvento);
  const [accion, setAccion] = useState(initialAccion);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      // Reinicia con los valores sugeridos de la plantilla cada vez que se abre.
      setNombre(initialNombre);
      setEvento(initialEvento);
      setAccion(initialAccion);
    }
  }

  function handleSave() {
    if (!nombre.trim()) return;
    onSave({ nombre: nombre.trim(), evento, accion });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre</Label>
            <Input
              placeholder="Ej. Recordatorio de carrito"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Evento disparador</Label>
            <SelectDropdown options={eventosAutomatizacion} value={evento} onChange={setEvento} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Acción</Label>
            <SelectDropdown options={accionesAutomatizacion} value={accion} onChange={setAccion} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
            disabled={!nombre.trim()}
            onClick={handleSave}
          >
            Guardar y activar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
