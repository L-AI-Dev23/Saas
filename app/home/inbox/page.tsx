import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { conversaciones, mensajesConversacion1 } from "@/lib/mock-data";
import { TextArea } from "@/components/base/textarea/textarea";
import {
  WhatsappLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
} from "@phosphor-icons/react/dist/ssr";

const canalIcon: Record<string, { icon: typeof InstagramLogo; color: string }> = {
  instagram: { icon: InstagramLogo, color: "#DD2A7B" },
  messenger: { icon: FacebookLogo, color: "#0084FF" },
  tiktok: { icon: TelegramLogo, color: "#000000" },
  whatsapp: { icon: WhatsappLogo, color: "#25D366" },
};

const estadoLabel: Record<string, string> = {
  bot_activo: "Bot activo",
  esperando_humano: "Esperando humano",
  atendido_humano: "Atendido",
  cerrado: "Cerrado",
};

export default function InboxPage() {
  const activa = conversaciones[0];
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] overflow-hidden lg:-m-8">
      {/* Lista de conversaciones */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-white">
        <div className="border-b border-border p-4">
          <h1 className="text-lg font-semibold text-text-primary">Chats</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Todos", "Esperando humano", "Bot activo", "Cerrados"].map((f, i) => (
              <button
                key={f}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  i === 0 ? "bg-dashboard-active text-dashboard-topbar" : "bg-surface text-text-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversaciones.map((c) => {
            const Canal = canalIcon[c.canal];
            return (
              <button
                key={c.id}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left hover:bg-surface",
                  c.id === activa.id && "bg-surface"
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
          })}
        </div>
      </div>

      {/* Hilo de mensajes */}
      <div className="flex flex-1 flex-col bg-dashboard-bg">
        <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">{activa.nombre}</p>
            <p className="text-xs text-text-secondary">Instagram · esperando atención humana</p>
          </div>
          <button className="rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-hover">
            Tomar conversación
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {mensajesConversacion1.map((m) => (
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
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-white p-4">
          <input
            placeholder="Escribe una respuesta…"
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm outline-none focus:border-cta"
          />
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cta text-white hover:bg-cta-hover">
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Panel de contacto */}
      <div className="hidden w-72 shrink-0 flex-col border-l border-border bg-white p-5 xl:flex">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dashboard-bg text-xl font-semibold text-text-secondary">
            {activa.nombre.charAt(0)}
          </div>
          <p className="mt-3 text-sm font-semibold text-text-primary">{activa.nombre}</p>
          <p className="text-xs text-text-secondary">Origen: chatbot</p>
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
          <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Nota rápida</p>
          <TextArea rows={3} placeholder="Agregar una nota…" size="sm" aria-label="Nota rápida" />
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
