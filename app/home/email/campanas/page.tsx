"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, MoreHorizontal, Pencil, Trash2, Send } from "lucide-react";
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
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { useEmailListas } from "@/lib/email-listas-store";
import { useEmailPlantillas } from "@/lib/email-plantillas-store";
import {
  useEmailCampanas,
  crearBorrador,
  enviarAhora,
  programar,
  enviarCampanaExistente,
  deleteEmailCampana,
  type EmailCampana,
} from "@/lib/email-campanas-store";
import Link from "next/link";

type Paso = "detalles" | "envio";

export default function EmailCampanasPage() {
  const campanas = useEmailCampanas();
  const listas = useEmailListas();
  const plantillas = useEmailPlantillas();
  const nombresListas = listas.map((l) => l.nombre);
  const nombresPlantillas = plantillas.map((p) => p.nombre);

  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [paso, setPaso] = useState<Paso>("detalles");
  const [nombre, setNombre] = useState("");
  const [lista, setLista] = useState(nombresListas[0] ?? "");
  const [plantilla, setPlantilla] = useState(nombresPlantillas[0] ?? "");
  const [fechaProgramada, setFechaProgramada] = useState("");

  const puedeContinuar = nombre.trim().length > 0 && !!lista && !!plantilla;

  function abrirCrear() {
    setPaso("detalles");
    setNombre("");
    setLista(nombresListas[0] ?? "");
    setPlantilla(nombresPlantillas[0] ?? "");
    setFechaProgramada("");
    setDialogAbierto(true);
  }

  function contactosDeLista(nombreLista: string) {
    return listas.find((l) => l.nombre === nombreLista)?.contactos ?? 0;
  }

  function guardarBorrador() {
    if (!puedeContinuar) return;
    crearBorrador({ nombre: nombre.trim(), lista, plantilla });
    setDialogAbierto(false);
  }

  function enviarAhoraDesdeDialogo() {
    if (!puedeContinuar) return;
    enviarAhora({ nombre: nombre.trim(), lista, plantilla }, contactosDeLista(lista));
    setDialogAbierto(false);
  }

  function programarDesdeDialogo() {
    if (!puedeContinuar || !fechaProgramada) return;
    const fechaFormateada = format(new Date(`${fechaProgramada}T00:00:00`), "d MMM yyyy", { locale: es });
    programar({ nombre: nombre.trim(), lista, plantilla }, fechaFormateada);
    setDialogAbierto(false);
  }

  function enviarExistente(c: EmailCampana) {
    const confirmar = window.confirm(`¿Enviar "${c.nombre}" ahora mismo a la lista "${c.lista}"?`);
    if (!confirmar) return;
    enviarCampanaExistente(c.id, contactosDeLista(c.lista));
  }

  function eliminar(c: EmailCampana) {
    const confirmar = window.confirm(`¿Eliminar la campaña "${c.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    deleteEmailCampana(c.id);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Campañas de email"
        description="Lanza envíos masivos y revisa el reporte de cada una."
        action={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={abrirCrear}>
                <Plus size={16} /> Nueva campaña
              </Button>
            </DialogTrigger>
            <DialogContent>
              {paso === "detalles" ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Nueva campaña</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre de la campaña</Label>
                      <Input
                        placeholder="Ej. Lanzamiento de curso nuevo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Lista destino</Label>
                      {nombresListas.length === 0 ? (
                        <p className="text-xs text-text-muted">
                          Todavía no tienes listas. Crea una en Email → Listas primero.
                        </p>
                      ) : (
                        <SelectDropdown options={nombresListas} value={lista} onChange={setLista} />
                      )}
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
                    <p className="text-xs text-text-muted">Paso siguiente: elegir enviar ahora o programar fecha.</p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                      className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                      disabled={!puedeContinuar}
                      onClick={() => setPaso("envio")}
                    >
                      Continuar
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>¿Cuándo enviamos “{nombre.trim()}”?</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-2">
                    <button
                      onClick={enviarAhoraDesdeDialogo}
                      className="flex flex-col items-start gap-1 rounded-lg border border-border p-4 text-left hover:border-cta hover:bg-cta/5"
                    >
                      <span className="text-sm font-semibold text-text-primary">Enviar ahora</span>
                      <span className="text-xs text-text-secondary">
                        Se enviará de inmediato a {contactosDeLista(lista).toLocaleString()} contactos de “{lista}”.
                      </span>
                    </button>
                    <div className="flex flex-col gap-1.5 rounded-lg border border-border p-4">
                      <span className="text-sm font-semibold text-text-primary">Programar</span>
                      <Label className="mt-1 text-xs text-text-muted">Fecha de envío</Label>
                      <Input
                        type="date"
                        value={fechaProgramada}
                        onChange={(e) => setFechaProgramada(e.target.value)}
                      />
                      <Button
                        className="mt-2 h-8 self-start bg-cta text-xs text-white hover:bg-cta-hover disabled:opacity-50"
                        disabled={!fechaProgramada}
                        onClick={programarDesdeDialogo}
                      >
                        Programar envío
                      </Button>
                    </div>
                    <button
                      onClick={guardarBorrador}
                      className="text-left text-xs font-medium text-text-secondary hover:text-text-primary hover:underline"
                    >
                      Guardar como borrador y decidir después
                    </button>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaso("detalles")}>
                      Atrás
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        }
      />

      {campanas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
            <Send size={22} />
          </span>
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes campañas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una para enviar un correo masivo a una de tus listas.
          </p>
        </div>
      ) : (
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
              {campanas.map((c) => (
                <tr key={c.id} className="hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.lista}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={c.estado} />
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{c.fecha}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {c.estado === "Enviada" && (
                        <Link
                          href={`/home/email/campanas/${c.id}`}
                          className="text-xs font-semibold text-cta hover:underline"
                        >
                          Ver reporte
                        </Link>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                            aria-label={`Más acciones para ${c.nombre}`}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-44">
                          {c.estado !== "Enviada" && (
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => enviarExistente(c)}>
                              <Send size={14} /> Enviar ahora
                            </DropdownMenuItem>
                          )}
                          {c.estado === "Borrador" && (
                            <DropdownMenuItem className="cursor-pointer" disabled>
                              <Pencil size={14} /> Editar (próximamente)
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={() => eliminar(c)}>
                            <Trash2 size={14} /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
