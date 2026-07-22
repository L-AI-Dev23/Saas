"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { equipo } from "@/lib/mock-data";

const modulosDisponibles = ["Inbox", "Email", "Automatizaciones", "Chatbots", "CRM", "Catálogo"];

export default function EquipoPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Equipo"
        description="Administradores tienen acceso total. Los empleados solo ven los módulos habilitados."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Invitar miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invitar miembro</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="nombre@empresa.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Rol</Label>
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary">
                      Administrador
                    </button>
                    <button className="flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary">
                      Empleado
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Módulos habilitados</Label>
                  <div className="grid grid-cols-2 gap-1">
                    {modulosDisponibles.map((m) => (
                      <Checkbox key={m} label={m} className="rounded-md px-2 py-1.5 hover:bg-surface" />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">Configuración queda reservada solo para administradores.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Enviar invitación</Button>
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
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Módulos</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {equipo.map((m) => (
              <tr key={m.id} className="hover:bg-surface">
                <td className="px-5 py-3">
                  <p className="font-medium text-text-primary">{m.nombre}</p>
                  <p className="text-xs text-text-muted">{m.email}</p>
                </td>
                <td className="px-5 py-3 text-text-secondary capitalize">{m.rol}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {m.modulos.map((mod) => (
                      <span key={mod} className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                        {mod}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge label={m.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}