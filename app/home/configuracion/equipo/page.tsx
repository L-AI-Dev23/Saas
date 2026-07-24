"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Send, Trash2, Pencil } from "lucide-react";
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
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  useEquipo,
  invitarMiembro,
  reenviarInvitacion,
  actualizarMiembro,
  eliminarMiembro,
  type MiembroEquipo,
} from "@/lib/equipo-store";

const modulosDisponibles = ["Inbox", "Email", "Automatizaciones", "Chatbots", "CRM", "Catálogo"];

export default function EquipoPage() {
  const equipo = useEquipo();
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [editando, setEditando] = useState<MiembroEquipo | null>(null);
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"admin" | "empleado">("empleado");
  const [modulos, setModulos] = useState<string[]>([]);
  const [enviado, setEnviado] = useState<string | null>(null);

  const puedeGuardar = editando ? true : email.trim().length > 0;

  function abrirInvitar() {
    setEditando(null);
    setEmail("");
    setRol("empleado");
    setModulos([]);
    setDialogAbierto(true);
  }

  function abrirEditar(m: MiembroEquipo) {
    setEditando(m);
    setEmail(m.email);
    setRol(m.rol as "admin" | "empleado");
    setModulos(m.rol === "admin" ? [] : m.modulos);
    setDialogAbierto(true);
  }

  function toggleModulo(m: string) {
    setModulos((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }

  function guardar() {
    if (!puedeGuardar) return;
    if (editando) {
      actualizarMiembro(editando.id, { rol, modulos });
    } else {
      invitarMiembro({ email: email.trim(), rol, modulos });
    }
    setDialogAbierto(false);
  }

  function reenviar(m: MiembroEquipo) {
    reenviarInvitacion(m.id);
    setEnviado(m.id);
    setTimeout(() => setEnviado(null), 2000);
  }

  function eliminar(m: MiembroEquipo) {
    const confirmar = window.confirm(`¿Quitar a "${m.nombre}" del equipo? Perderá acceso a la cuenta.`);
    if (!confirmar) return;
    eliminarMiembro(m.id);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Equipo"
        description="Administradores tienen acceso total. Los empleados solo ven los módulos habilitados."
        action={
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={abrirInvitar}>
                <Plus size={16} /> Invitar miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editando ? `Editar a ${editando.nombre}` : "Invitar miembro"}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                {!editando && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="nombre@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label>Rol</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRol("admin")}
                      className={
                        rol === "admin"
                          ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                          : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:border-cta/50"
                      }
                    >
                      Administrador
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("empleado")}
                      className={
                        rol === "empleado"
                          ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                          : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:border-cta/50"
                      }
                    >
                      Empleado
                    </button>
                  </div>
                </div>
                {rol === "empleado" && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Módulos habilitados</Label>
                    <div className="grid grid-cols-2 gap-1">
                      {modulosDisponibles.map((m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface"
                        >
                          <Checkbox checked={modulos.includes(m)} onCheckedChange={() => toggleModulo(m)} />
                          {m}
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-text-muted">Configuración queda reservada solo para administradores.</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50" disabled={!puedeGuardar} onClick={guardar}>
                  {editando ? "Guardar cambios" : "Enviar invitación"}
                </Button>
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
              <th className="px-5 py-3" />
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
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {m.estado === "Invitado" && (
                      <button
                        onClick={() => reenviar(m)}
                        className="flex items-center gap-1 text-xs font-semibold text-cta hover:underline"
                      >
                        <Send size={12} /> {enviado === m.id ? "Enviada" : "Reenviar"}
                      </button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                          aria-label={`Más acciones para ${m.nombre}`}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-44">
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => abrirEditar(m)}>
                          <Pencil size={14} /> Editar rol y módulos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" className="cursor-pointer" onSelect={() => eliminar(m)}>
                          <Trash2 size={14} /> Quitar del equipo
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
    </div>
  );
}
