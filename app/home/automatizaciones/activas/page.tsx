"use client";

import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Copy, Trash2, Pause, Play, Zap } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toggle } from "@/components/base/toggle/toggle";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { AutomationConfigModal, eventosAutomatizacion } from "@/components/dashboard/AutomationConfigModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  useAutomationRules,
  addAutomationRule,
  updateAutomationRule,
  duplicateAutomationRule,
  deleteAutomationRule,
  toggleAutomationRule,
  type ReglaAutomatizacion,
} from "@/lib/automations-store";

const eventosFiltro = ["Todos los eventos", ...eventosAutomatizacion];
const estados = ["Todos los estados", "Activas", "Pausadas"];

export default function AutomatizacionesActivasPage() {
  const reglas = useAutomationRules();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEvento, setFiltroEvento] = useState(eventosFiltro[0]);
  const [filtroEstado, setFiltroEstado] = useState(estados[0]);
  const [editando, setEditando] = useState<ReglaAutomatizacion | null>(null);

  const filtradas = useMemo(() => {
    return reglas.filter((r) => {
      const coincideBusqueda = r.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      const coincideEvento = filtroEvento === eventosFiltro[0] || r.evento === filtroEvento;
      const coincideEstado =
        filtroEstado === estados[0] || (filtroEstado === "Activas" ? r.estado : !r.estado);
      return coincideBusqueda && coincideEvento && coincideEstado;
    });
  }, [reglas, busqueda, filtroEvento, filtroEstado]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Automatizaciones activas"
        description="Reglas activas de disparador → acción."
        action={
          <AutomationConfigModal
            trigger={
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva automatización
              </Button>
            }
            onSave={addAutomationRule}
          />
        }
      />

      {reglas.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Buscar automatización…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <SelectDropdown options={eventosFiltro} value={filtroEvento} onChange={setFiltroEvento} className="w-52" />
            <SelectDropdown options={estados} value={filtroEstado} onChange={setFiltroEstado} className="w-44" />
          </div>
        </div>
      )}

      {reglas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Todavía no tienes automatizaciones activas</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Crea una desde cero o parte de una plantilla en la sección Plantillas.
          </p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
            <Zap size={22} />
          </span>
          <p className="text-sm font-semibold text-text-primary">Ninguna automatización coincide con tu búsqueda</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Prueba con otro término o ajusta los filtros de evento y estado.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Evento disparador</th>
                <th className="px-5 py-3">Acción</th>
                <th className="px-5 py-3">Activa</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtradas.map((a) => (
                <tr key={a.id} onClick={() => setEditando(a)} className="cursor-pointer hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{a.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.evento}</td>
                  <td className="px-5 py-3 text-text-secondary">{a.pasos.join(" + ")}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <Toggle isSelected={a.estado} onChange={() => toggleAutomationRule(a.id)} aria-label={`Activar ${a.nombre}`} />
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
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => setEditando(a)}>
                          <Pencil size={14} /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => toggleAutomationRule(a.id)}>
                          {a.estado ? <Pause size={14} /> : <Play size={14} />}
                          {a.estado ? "Pausar" : "Reanudar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => duplicateAutomationRule(a.id)}>
                          <Copy size={14} /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onSelect={() => deleteAutomationRule(a.id)}
                        >
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

      {editando && (
        <AutomationConfigModal
          title={`Editar automatización — ${editando.nombre}`}
          open={!!editando}
          onOpenChange={(open) => !open && setEditando(null)}
          initialNombre={editando.nombre}
          initialEvento={editando.evento}
          initialPasos={editando.pasos}
          onSave={(r) => updateAutomationRule(editando.id, r)}
        />
      )}
    </div>
  );
}
