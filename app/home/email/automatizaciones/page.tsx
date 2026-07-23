"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Pause, Play, Zap } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/base/toggle/toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { useEmailPlantillas } from "@/lib/email-plantillas-store";
import {
  useEmailAutomatizaciones,
  addEmailAutomatizacion,
  updateEmailAutomatizacion,
  toggleEmailAutomatizacion,
  deleteEmailAutomatizacion,
  type EmailAutomatizacion,
} from "@/lib/email-automatizaciones-store";

const eventos = ["Contacto nuevo", "Carrito abandonado", "Compra realizada", "Etiqueta agregada"];

export default function EmailAutomatizacionesPage() {
  const automatizaciones = useEmailAutomatizaciones();
  const plantillas = useEmailPlantillas();
  const nombresPlantillas = plantillas.map((p) => p.nombre);

  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [editando, setEditando] = useState<EmailAutomatizacion | null>(null);
  const [nombre, setNombre] = useState("");
  const [evento, setEvento] = useState(eventos[0]);
  const [plantilla, setPlantilla] = useState(nombresPlantillas[0] ?? "");

  const puedeGuardar = nombre.trim().length > 0 && plantilla;

  function abrirCrear() {
    setEditando(null);
    setNombre("");
    setEvento(eventos[0]);
    setPlantilla(nombresPlantillas[0] ?? "");
    setDialogAbierto(true);
  }

  function abrirEditar(a: EmailAutomatizacion) {
    setEditando(a);
    setNombre(a.nombre);
    setEvento(a.evento);
    setPlantilla(a.plantilla);
    setDialogAbierto(true);
  }

  function guardar() {
    if (!puedeGuardar) return;
    if (editando) {
      updateEmailAutomatizacion(editando.id, { nombre: nombre.trim(), evento, plantilla });
    } else {
      addEmailAutomatizacion({ nombre: nombre.trim(), evento, plantilla });
    }
    setDialogAbierto(false);
  }

  function eliminar(a: EmailAutomatizacion) {
    const confirmar = window.confirm(`¿Eliminar la automatización "${a.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    deleteEmailAutomatizacion(a.id);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones de email"
        description="Correos que se disparan solos ante un evento (bienvenida, agradecimiento, recordatorio)."
        action={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={abrirCrear}>
                <Plus size={16} /> Nueva automatización
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editando ? "Editar automatización" : "Nueva automatización de email"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Ej. Bienvenida a nuevo suscriptor"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Evento disparador</Label>
                  <SelectDropdown options={eventos} value={evento} onChange={setEvento} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Plantilla</Label>
                  {nombresPlantillas.length === 0 ? (
                    <p className="text-xs text-text-muted">
                      Todavía no tienes plantillas. Crea una en Email → Plantillas primero.
                    </p>
                  ) : (
                    <SelectDropdown options={nombresPlantillas} value={plantilla} onChange={setPlantilla} />
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                  disabled={!puedeGuardar}
                  onClick={guardar}
                >
                  {editando ? "Guardar cambios" : "Activar automatización"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {automatizaciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
            <Zap size={22} />
          </span>
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes automatizaciones</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una para enviar correos automáticos ante eventos como un contacto nuevo o una compra.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Evento disparador</th>
                <th className="px-5 py-3">Plantilla</th>
                <th className="px-5 py-3">Activa</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {automatizaciones.map((a) => (
                <tr key={a.id} onClick={() => abrirEditar(a)} className="cursor-pointer hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{a.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.evento}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.plantilla}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <Toggle
                      isSelected={a.estado === "Activa"}
                      onChange={() => toggleEmailAutomatizacion(a.id)}
                      aria-label={`Activar ${a.nombre}`}
                    />
                  </td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                          aria-label={`Más acciones para ${a.nombre}`}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-44">
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => abrirEditar(a)}>
                          <Pencil size={14} /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => toggleEmailAutomatizacion(a.id)}>
                          {a.estado === "Activa" ? <Pause size={14} /> : <Play size={14} />}
                          {a.estado === "Activa" ? "Pausar" : "Reanudar"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={() => eliminar(a)}>
                          <Trash2 size={14} /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
