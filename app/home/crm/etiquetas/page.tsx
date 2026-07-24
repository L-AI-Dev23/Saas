"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
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
import { useTags, addTag, deleteTag, renameTag, type CrmTag } from "@/lib/tags-store";
import { useContactos } from "@/lib/contacts-store";
import { useBusiness } from "@/lib/supabase/business-context";

const COLORES = ["#f65858", "#00c98d", "#009fc1", "#ca8a04", "#6b7280"];

export default function EtiquetasPage() {
  const { businessId } = useBusiness();
  const tags = useTags();
  const contactos = useContactos();
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [tagEditando, setTagEditando] = useState<CrmTag | null>(null);
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState(COLORES[0]);

  // El número de contactos de cada etiqueta se calcula en vivo, en lugar de
  // confiar en un contador estático que se desincroniza al crear/eliminar.
  const conteos = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const c of contactos) {
      for (const t of c.tags) {
        mapa.set(t, (mapa.get(t) ?? 0) + 1);
      }
    }
    return mapa;
  }, [contactos]);

  function abrirCrear() {
    setTagEditando(null);
    setNombre("");
    setColor(COLORES[0]);
    setDialogAbierto(true);
  }

  function abrirEditar(tag: CrmTag) {
    setTagEditando(tag);
    setNombre(tag.nombre);
    setColor(tag.color);
    setDialogAbierto(true);
  }

  async function guardar() {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio || !businessId) return;
    if (tagEditando) {
      await renameTag(tagEditando.id, { nombre: nombreLimpio, color });
    } else {
      await addTag({ nombre: nombreLimpio, color }, businessId);
    }
    setDialogAbierto(false);
  }

  async function eliminar(tag: CrmTag) {
    const enUso = conteos.get(tag.nombre) ?? 0;
    if (enUso > 0) {
      const confirmar = window.confirm(
        `"${tag.nombre}" está en ${enUso} ${enUso === 1 ? "contacto" : "contactos"}. Si la eliminas, se quitará de esos contactos también. ¿Continuar?`
      );
      if (!confirmar) return;
    }
    await deleteTag(tag.id);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Etiquetas"
        description="Tags compartidos entre CRM, Email y Chatbots."
        action={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={abrirCrear}>
                <Plus size={16} /> Nueva etiqueta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tagEditando ? "Editar etiqueta" : "Nueva etiqueta"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input
                    placeholder="Ej. interesado en curso X"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {COLORES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Color ${c}`}
                        onClick={() => setColor(c)}
                        className="h-7 w-7 rounded-full border-2"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? "var(--color-text-primary, #111827)" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                  disabled={!nombre.trim()}
                  onClick={guardar}
                >
                  {tagEditando ? "Guardar cambios" : "Crear etiqueta"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes etiquetas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una para empezar a segmentar tus contactos.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-white">
          {tags.map((t) => {
            const cantidad = conteos.get(t.nombre) ?? 0;
            return (
              <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-sm font-medium text-text-primary">{t.nombre}</span>
                  <Link
                    href={`/home/crm/contactos?tag=${encodeURIComponent(t.nombre)}`}
                    className="text-xs text-text-muted underline-offset-2 hover:text-cta hover:underline"
                  >
                    {cantidad} {cantidad === 1 ? "contacto" : "contactos"}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => abrirEditar(t)}
                    aria-label={`Editar etiqueta ${t.nombre}`}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => eliminar(t)}
                    aria-label={`Eliminar etiqueta ${t.nombre}`}
                    className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
