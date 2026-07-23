"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { conversaciones, mensajesPorConversacion } from "@/lib/mock-data";
import { TextArea } from "@/components/base/textarea/textarea";
import {
  WhatsappLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
} from "@phosphor-icons/react/dist/ssr";

const canalIcon: Record<string, { icon: typeof InstagramLogo; color: string; label: string }> = {
  instagram: { icon: InstagramLogo, color: "#DD2A7B", label: "Instagram" },
  messenger: { icon: FacebookLogo, color: "#0084FF", label: "Messenger" },
  tiktok: { icon: TelegramLogo, color: "#000000", label: "TikTok" },
  whatsapp: { icon: WhatsappLogo, color: "#25D366", label: "WhatsApp" },
};

const estadoLabel: Record<string, string> = {
  bot_activo: "Bot activo",
  esperando_humano: "Esperando humano",
  atendido_humano: "Atendido",
  cerrado: "Cerrado",
};

const FILTROS = [
  { label: "Todos", estados: null },
  { label: "Esperando humano", estados: ["esperando_humano"] },
  { label: "Bot activo", estados: ["bot_activo"] },
  { label: "Cerrados", estados: ["cerrado"] },
] as const;

export default function InboxPage() {
  // Copia local editable: partimos del mock y mutamos el estado de una
  // conversación (ej. al "tomarla"). Sin backend esto vive solo en memoria.
  const [convos, setConvos] = useState(conversaciones);
  const [selectedId, setSelectedId] = useState(convos[0].id);
  const [filtroActivo, setFiltroActivo] = useState<(typeof FILTROS)[number]["label"]>("Todos");
  const [borrador, setBorrador] = useState("");
  const [mensajesPorConv, setMensajesPorConv] = useState(mensajesPorConversacion);

  const activa = convos.find((c) => c.id === selectedId) ?? convos[0];
  const mensajes = mensajesPorConv[activa.id] ?? [];
  const CanalActivo = canalIcon[activa.canal];

  const filtro = FILTROS.find((f) => f.label === filtroActivo)!;
  const convosFiltrados = filtro.estados
    ? convos.filter((c) => (filtro.estados as readonly string[]).includes(c.estado))
    : convos;

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [mensajes.length, activa.id]);

  function enviarMensaje() {
    const texto = borrador.trim();
    if (!texto) return;
    const hora = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    setMensajesPorConv((prev) => {
      const hilo = prev[activa.id] ?? [];
      return {
        ...prev,
        [activa.id]: [...hilo, { id: hilo.length + 1, from: "agent" as const, texto, hora }],
      };
    });
    setBorrador("");
  }

  function tomarConversacion() {
    setConvos((prev) =>
      prev.map((c) => (c.id === activa.id ? { ...c, estado: "atendido_humano" } : c))
    );
  }

  // Notas por contacto, en memoria. El borrador se guarda al tipear;
  // "Guardar" solo confirma visualmente (acá no hay backend todavía).
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [notaGuardadaId, setNotaGuardadaId] = useState<number | null>(null);
  const notaGuardadaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function guardarNota() {
    setNotaGuardadaId(activa.id);
    if (notaGuardadaTimeout.current) clearTimeout(notaGuardadaTimeout.current);
    notaGuardadaTimeout.current = setTimeout(() => setNotaGuardadaId(null), 2000);
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] overflow-hidden lg:-m-8">
      {/* Lista de conversaciones */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-white">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold text-text-primary">Chats</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.label}
                onClick={() => setFiltroActivo(f.label)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  filtroActivo === f.label
                    ? "bg-dashboard-active text-dashboard-topbar"
                    : "bg-surface text-text-secondary hover:bg-border"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convosFiltrados.length === 0 ? (
            <p className="p-4 text-center text-sm text-text-muted">
              No hay conversaciones en “{filtroActivo}”.
            </p>
          ) : (
            convosFiltrados.map((c) => {
            const Canal = canalIcon[c.canal];
            const esActiva = c.id === activa.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                aria-current={esActiva ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left hover:bg-surface",
                  esActiva && "bg-surface"
                )}
              >
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dashboard-bg text-sm font-semibold text-text-secondary">
                    {c.nombre.charAt(0)}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white"
                    style={{ color: Canal.color }}
                  >
                    <Canal.icon size={12} weight="fill" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-text-primary">{c.nombre}</p>
                    <span className="shrink-0 text-xs text-text-muted">{c.tiempo}</span>
                  </div>
                  <p className="truncate text-xs text-text-secondary">{c.ultimo}</p>
                  <div className="mt-1">
                    <StatusBadge label={estadoLabel[c.estado]} />
                  </div>
                </div>
              </button>
            );
            })
          )}
        </div>
      </div>

      {/* Hilo de mensajes */}
      <div className="flex flex-1 flex-col bg-dashboard-bg">
        <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">{activa.nombre}</p>
            <p className="text-xs text-text-secondary">
              {CanalActivo.label} · {estadoLabel[activa.estado]}
            </p>
          </div>
          {activa.estado === "esperando_humano" ? (
            <button
              onClick={tomarConversacion}
              className="rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
            >
              Tomar conversación
            </button>
          ) : (
            <span className="text-xs font-medium text-text-muted">
              {estadoLabel[activa.estado]}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {mensajes.map((m) => (
            <div key={m.id} className={cn("flex", m.from === "contact" ? "justify-start" : "justify-end")}>
              <div
                className={cn(
                  "max-w-sm rounded-2xl px-4 py-2.5 text-sm shadow-sg-sm",
                  m.from === "contact"
                    ? "bg-white text-text-primary"
                    : m.from === "bot"
                      ? "bg-link/10 text-text-primary"
                      : "bg-cta text-white"
                )}
              >
                <p>{m.texto}</p>
                <p className="mt-1 text-[10px] opacity-60">{m.hora}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarMensaje();
          }}
          className="flex items-center gap-3 border-t border-border bg-white p-4"
        >
          <input
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder="Escribe una respuesta…"
            aria-label="Escribe una respuesta"
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-cta"
          />
          <button
            type="submit"
            disabled={!borrador.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cta text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Panel de contacto */}
      <div className="hidden w-72 shrink-0 flex-col border-l border-border bg-white p-5 xl:flex">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dashboard-bg text-xl font-semibold text-text-secondary">
            {activa.nombre.charAt(0)}
          </div>
          <p className="mt-3 text-sm font-semibold text-text-primary">{activa.nombre}</p>
          <p className="text-xs text-text-secondary">Origen: {CanalActivo.label}</p>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Etapa CRM</p>
          <StatusBadge label="En conversación" />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Etiquetas</p>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge label="interesado-curso" />
          </div>
        </div>

        <div className="mt-4 flex-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase text-text-muted">Nota rápida</p>
            {notaGuardadaId === activa.id && (
              <span className="text-[11px] font-medium text-success">Guardada</span>
            )}
          </div>
          <TextArea
            rows={3}
            placeholder="Agregar una nota…"
            size="sm"
            aria-label="Nota rápida"
            value={notas[activa.id] ?? ""}
            onChange={(v) => setNotas((prev) => ({ ...prev, [activa.id]: v }))}
          />
          <button
            onClick={guardarNota}
            disabled={!notas[activa.id]?.trim()}
            className="mt-2 w-full rounded-lg border border-border py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar nota
          </button>
        </div>

        <a
          href="/home/crm/contactos"
          className="mt-4 block rounded-lg border border-border py-2 text-center text-xs font-semibold text-text-primary hover:bg-surface"
        >
          Ver perfil completo en CRM
        </a>
      </div>
    </div>
  );
}