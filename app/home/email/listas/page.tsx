"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
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
import { useEmailListas, addEmailLista, deleteEmailLista, type EmailLista, type EmailListaInput } from "@/lib/email-listas-store";

export default function ListasPage() {
  const listas = useEmailListas();
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<EmailListaInput["tipo"]>("Manual");

  function abrirCrear() {
    setNombre("");
    setTipo("Manual");
    setDialogAbierto(true);
  }

  function crear() {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return;
    addEmailLista({ nombre: nombreLimpio, tipo });
    setDialogAbierto(false);
  }

  function eliminar(l: EmailLista) {
    const confirmar = window.confirm(`¿Eliminar la lista "${l.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    deleteEmailLista(l.id);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Listas de correo"
        description="Listas manuales y segmentos dinámicos que se actualizan solos."
        action={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={abrirCrear}>
                <Plus size={16} /> Nueva lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva lista</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre de la lista</Label>
                  <Input
                    placeholder="Ej. Clientes VIP"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Tipo</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTipo("Manual")}
                      className={
                        tipo === "Manual"
                          ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                          : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:border-cta/50"
                      }
                    >
                      Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo("Dinámica")}
                      className={
                        tipo === "Dinámica"
                          ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                          : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:border-cta/50"
                      }
                    >
                      Dinámica
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  {tipo === "Dinámica"
                    ? "Las listas dinámicas se actualizan solas según filtros (ej. “no compró en 30 días”). La configuración de reglas estará disponible próximamente; por ahora se crea vacía."
                    : "Vas a poder agregar contactos manualmente desde Contactos."}
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                  disabled={!nombre.trim()}
                  onClick={crear}
                >
                  Crear lista
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {listas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes listas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una lista manual o dinámica para organizar tus envíos de correo.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Nº contactos</th>
                <th className="px-5 py-3">Actualizado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listas.map((l) => (
                <tr key={l.id} className="hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{l.nombre}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={l.tipo} />
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{l.contactos.toLocaleString()}</td>
                  <td className="px-5 py-3 text-text-secondary">{l.actualizado}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href="/home/crm/contactos" className="text-xs font-semibold text-cta hover:underline">
                        Ver contactos
                      </Link>
                      <button
                        onClick={() => eliminar(l)}
                        aria-label={`Eliminar lista ${l.nombre}`}
                        className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-error"
                      >
                        <Trash2 size={16} />
                      </button>
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
