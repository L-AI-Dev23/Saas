"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  AlertTriangle,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Pause,
  Play,
  RefreshCw,
  Bot,
} from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { Toggle } from "@/components/base/toggle/toggle";
import { ChatbotConfigModal, type ChatbotConfigInitialData } from "@/components/dashboard/ChatbotConfigModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { chatbotsActivos, chatbotTemplates } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Bot = (typeof chatbotsActivos)[number];

const redes = ["Todas las redes", "Instagram", "Messenger", "TikTok"];
const estados = ["Todos los estados", "Activo", "Pausado", "Necesita atención"];

function estadoDisplay(bot: Bot) {
  if (!bot.activo) return "Pausado";
  return bot.estado;
}

// Prefill de config existente por bot — en un backend real vendría de la API.
function initialDataFor(bot: Bot): ChatbotConfigInitialData {
  return {
    origen:
      bot.red === "Instagram"
        ? "Instagram — @codew.pe"
        : bot.red === "Messenger"
          ? "Messenger — Codew Agencia"
          : "TikTok — no conectada, ir a Configuración → Cuentas",
    alcance: "general",
    keywords: bot.templateId === "keyword_reply" || bot.templateId === "comment_to_dm" ? ["precio", "info"] : [],
    selectedProducts: [],
  };
}

export default function ChatbotsActivosPage() {
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>(chatbotsActivos);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRed, setFiltroRed] = useState(redes[0]);
  const [filtroEstado, setFiltroEstado] = useState(estados[0]);
  const [editando, setEditando] = useState<Bot | null>(null);

  const filtrados = useMemo(() => {
    return bots.filter((b) => {
      const coincideBusqueda = b.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      const coincideRed = filtroRed === redes[0] || b.red === filtroRed;
      const coincideEstado = filtroEstado === estados[0] || estadoDisplay(b) === filtroEstado;
      return coincideBusqueda && coincideRed && coincideEstado;
    });
  }, [bots, busqueda, filtroRed, filtroEstado]);

  function toggleActivo(id: Bot["id"]) {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, activo: !b.activo } : b)));
  }

  function duplicar(bot: Bot) {
    setBots((prev) => {
      const nextId = Math.max(...prev.map((b) => b.id)) + 1;
      return [...prev, { ...bot, id: nextId, nombre: `${bot.nombre} (copia)`, mensajes: 0 }];
    });
  }

  function eliminar(id: Bot["id"]) {
    setBots((prev) => prev.filter((b) => b.id !== id));
  }

  const templateName = editando
    ? chatbotTemplates.find((t) => t.id === editando.templateId)?.nombre ?? editando.tipo
    : "";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Chatbots activos"
        description="Todos los bots en operación en tus cuentas conectadas."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <a href="/home/chatbots/plantillas">
              <Plus size={16} /> Nuevo chatbot
            </a>
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar chatbot…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <SelectDropdown options={redes} value={filtroRed} onChange={setFiltroRed} className="w-40" />
          <SelectDropdown options={estados} value={filtroEstado} onChange={setFiltroEstado} className="w-48" />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
            <Bot size={22} />
          </span>
          {bots.length === 0 ? (
            <>
              <p className="text-sm font-semibold text-text-primary">Todavía no tienes chatbots activos</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                Crea tu primer bot a partir de una plantilla para empezar a automatizar tus conversaciones.
              </p>
              <Button className="mt-4 rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
                <a href="/home/chatbots/plantillas">
                  <Plus size={16} /> Nuevo chatbot
                </a>
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-text-primary">Ningún bot coincide con tu búsqueda</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                Prueba con otro término o ajusta los filtros de red social y estado.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Red social</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Activo</th>
                <th className="px-5 py-3">Mensajes (mes)</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtrados.map((b) => {
                const necesitaAtencion = b.estado === "Necesita atención";
                return (
                  <tr
                    key={b.id}
                    onClick={() => setEditando(b)}
                    className={cn("cursor-pointer hover:bg-surface", necesitaAtencion && "bg-warning/5")}
                  >
                    <td className="px-5 py-3 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        {necesitaAtencion && <AlertTriangle size={14} className="shrink-0 text-error" />}
                        {b.nombre}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{b.tipo}</td>
                    <td className="px-5 py-3 text-text-secondary">{b.red}</td>
                    <td className="px-5 py-3">
                      <StatusBadge label={estadoDisplay(b)} />
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        isSelected={b.activo}
                        onChange={() => toggleActivo(b.id)}
                        aria-label={`Activar ${b.nombre}`}
                      />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{b.mensajes.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3">
                        {necesitaAtencion && (
                          <button
                            onClick={() => router.push("/home/configuracion")}
                            className="flex items-center gap-1 text-xs font-semibold text-error hover:underline"
                          >
                            <RefreshCw size={12} /> Revisar
                          </button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                              aria-label={`Más acciones para ${b.nombre}`}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => setEditando(b)}>
                              <Pencil size={14} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => toggleActivo(b.id)}>
                              {b.activo ? <Pause size={14} /> : <Play size={14} />}
                              {b.activo ? "Pausar" : "Reanudar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onSelect={() => duplicar(b)}>
                              <Copy size={14} /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              className="cursor-pointer"
                              onSelect={() => eliminar(b.id)}
                            >
                              <Trash2 size={14} /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <ChatbotConfigModal
          mode="edit"
          templateId={editando.templateId}
          templateName={templateName}
          open={!!editando}
          onOpenChange={(open) => !open && setEditando(null)}
          initialData={initialDataFor(editando)}
        />
      )}
    </div>
  );
}