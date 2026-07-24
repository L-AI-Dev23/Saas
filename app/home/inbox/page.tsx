"use client";

import { useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/animate-ui/components/buttons/button";
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

// Las conversaciones vendrán de Supabase vía realtime en una futura integración con social accounts.
// Por ahora se muestra el estado vacío correcto para nuevas cuentas.
const convos: never[] = [];

export default function InboxPage() {
  const [filtroActivo, setFiltroActivo] = useState<(typeof FILTROS)[number]["label"]>("Todos");
  const filtro = FILTROS.find((f) => f.label === filtroActivo)!;
  const convosFiltrados = filtro.estados
    ? convos.filter((c: any) => (filtro.estados as readonly string[]).includes((c as any).estado))
    : convos;

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
                    ? "bg-text-primary text-white"
                    : "bg-surface text-text-primary hover:bg-border"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <MessageSquare size={28} className="text-text-muted" />
          <p className="text-sm font-semibold text-text-primary">Sin conversaciones</p>
          <p className="text-xs text-text-secondary">
            Las conversaciones aparecerán aquí cuando conectes una cuenta social y llegue un mensaje.
          </p>
        </div>
      </div>

      {/* Panel central vacío */}
      <div className="flex flex-1 flex-col items-center justify-center bg-dashboard-bg gap-3 text-center p-8">
        <MessageSquare size={40} className="text-text-muted" />
        <p className="text-base font-semibold text-text-primary">No hay ninguna conversación seleccionada</p>
        <p className="max-w-sm text-sm text-text-secondary">
          Conecta una cuenta de Instagram, Messenger o TikTok desde{" "}
          <a href="/home/configuracion" className="text-cta underline">
            Configuración → Cuentas
          </a>{" "}
          para empezar a recibir mensajes.
        </p>
      </div>
    </div>
  );
}