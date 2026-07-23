"use client";

import { useRouter } from "next/navigation";
import { Plus, Mail, MoreVertical, Copy, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  useEmailPlantillas,
  addEmailPlantilla,
  duplicateEmailPlantilla,
  deleteEmailPlantilla,
} from "@/lib/email-plantillas-store";

export default function EmailPlantillasPage() {
  const plantillas = useEmailPlantillas();
  const router = useRouter();

  function crearYEditar() {
    const id = addEmailPlantilla();
    router.push(`/home/email/plantillas/${id}`);
  }

  function duplicar(id: number) {
    duplicateEmailPlantilla(id);
  }

  function eliminar(id: number, nombre: string) {
    const confirmar = window.confirm(`¿Eliminar la plantilla "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    deleteEmailPlantilla(id);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de email"
        description="Diseña una vez, reutiliza en campañas y automatizaciones."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={crearYEditar}>
            <Plus size={16} /> Nueva plantilla
          </Button>
        }
      />

      {plantillas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes plantillas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una para reutilizarla en campañas y automatizaciones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {plantillas.map((t) => (
            <div
              key={t.id}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sg-sm transition-shadow hover:shadow-sg-md"
            >
              <button
                onClick={() => router.push(`/home/email/plantillas/${t.id}`)}
                className="flex h-32 items-center justify-center bg-surface text-text-muted"
                aria-label={`Editar plantilla ${t.nombre}`}
              >
                <Mail size={28} />
              </button>
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => router.push(`/home/email/plantillas/${t.id}`)}
                  className="text-left"
                >
                  <p className="text-sm font-semibold text-text-primary hover:underline">{t.nombre}</p>
                  <p className="text-xs text-text-muted">Editado {t.editado}</p>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-text-muted hover:text-text-primary"
                      aria-label={`Más acciones para ${t.nombre}`}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push(`/home/email/plantillas/${t.id}`)}>
                      <Pencil size={14} /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onSelect={() => duplicar(t.id)}>
                      <Copy size={14} /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={() => eliminar(t.id, t.nombre)}>
                      <Trash2 size={14} /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
