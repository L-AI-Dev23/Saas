"use client";

import { useMemo, useState } from "react";
import { Search, MessageSquare, KeyRound, Sparkles, ShoppingBag, ClipboardList, Star } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChatbotConfigModal } from "@/components/dashboard/ChatbotConfigModal";
import { chatbotTemplates, chatbotsActivos } from "@/lib/mock-data";

const icons: Record<string, typeof MessageSquare> = {
  comment_to_dm: MessageSquare,
  keyword_reply: KeyRound,
  welcome: Sparkles,
  catalog_flow: ShoppingBag,
  data_capture: ClipboardList,
};

export default function ChatbotsPlantillasPage() {
  const [busqueda, setBusqueda] = useState("");

  // La plantilla más usada se calcula de los bots activos reales, no un flag fijo.
  const masUsadaId = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const b of chatbotsActivos) {
      conteo.set(b.templateId, (conteo.get(b.templateId) ?? 0) + 1);
    }
    let top: string | null = null;
    let max = 0;
    for (const [id, count] of conteo) {
      if (count > max) {
        max = count;
        top = id;
      }
    }
    return max > 1 ? top : null;
  }, []);

  const filtradas = chatbotTemplates.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de chatbot"
        description="Elige un tipo de bot y configúralo en un par de pasos."
        action={
          <div className="relative sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Buscar plantilla…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8"
            />
          </div>
        }
      />

      {filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Ninguna plantilla coincide con tu búsqueda</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">Prueba con otro término.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtradas.map((t) => {
            const Icon = icons[t.id];
            const esMasUsada = t.id === masUsadaId;
            return (
              <div
                key={t.id}
                className="relative flex flex-col rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
              >
                {esMasUsada && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
                    <Star size={11} className="fill-current" /> Más usada
                  </span>
                )}
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={20} />
                </span>
                <p className="text-sm font-semibold text-text-primary">{t.nombre}</p>
                <p className="mt-1 flex-1 text-xs text-text-secondary">{t.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.redes.map((red) => (
                    <span
                      key={red}
                      className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary"
                    >
                      {red}
                    </span>
                  ))}
                </div>
                <ChatbotConfigModal
                  templateId={t.id}
                  templateName={t.nombre}
                  trigger={
                    <Button className="mt-4 h-9 w-full rounded-lg bg-cta text-white hover:bg-cta-hover">
                      Usar plantilla
                    </Button>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}