"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { emailListas } from "@/lib/mock-data";

export default function ListasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Listas de correo"
        description="Listas manuales y segmentos dinámicos que se actualizan solos."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
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
                  <Input placeholder="Ej. Clientes VIP" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Tipo</Label>
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary">
                      Manual
                    </button>
                    <button className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary">
                      Dinámica
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  Las listas dinámicas se actualizan solas según filtros (ej. “no compró en 30 días”).
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Crear lista</Button>
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
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Nº contactos</th>
              <th className="px-5 py-3">Actualizado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {emailListas.map((l) => (
              <tr key={l.id} className="hover:bg-surface">
                <td className="px-5 py-3 font-medium text-text-primary">{l.nombre}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={l.tipo} />
                </td>
                <td className="px-5 py-3 text-text-secondary">{l.contactos.toLocaleString()}</td>
                <td className="px-5 py-3 text-text-secondary">{l.actualizado}</td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs font-semibold text-cta hover:underline">Ver contactos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
