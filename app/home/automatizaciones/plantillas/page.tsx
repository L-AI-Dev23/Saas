"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, UserPlus, MessageCircleHeart, Tag, Zap, Check } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AutomationConfigModal } from "@/components/dashboard/AutomationConfigModal";
import { addAutomationRule } from "@/lib/automations-store";
import { automatizacionesPlantillas } from "@/lib/mock-data";

const icons: Record<string, typeof Zap> = {
  carrito: ShoppingCart,
  bienvenida: UserPlus,
  seguimiento: MessageCircleHeart,
  etiqueta: Tag,
};

export default function AutomatizacionesPlantillasPage() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [creada, setCreada] = useState<string | null>(null);

  const filtradas = automatizacionesPlantillas.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  function handleSave(r: { nombre: string; evento: string; pasos: string[] }) {
    addAutomationRule(r);
    setCreada(r.nombre);
    setTimeout(() => setCreada(null), 4000);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de automatización"
        description="Automatizaciones preconfiguradas, listas para implementar en pocos clics."
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

      {creada && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-success">
            <Check size={16} /> &quot;{creada}&quot; se creó y quedó activa.
          </span>
          <button
            onClick={() => router.push("/home/automatizaciones/activas")}
            className="font-semibold text-cta hover:underline"
          >
            Ver en Activas
          </button>
        </div>
      )}

      {filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Ninguna plantilla coincide con tu búsqueda</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">Prueba con otro término.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtradas.map((t) => {
            const Icon = icons[t.icono] ?? Zap;
            return (
              <div
                key={t.id}
                className="flex flex-col rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cta/10 text-cta">
                  <Icon size={20} />
                </span>
                <p className="text-sm font-semibold text-text-primary">{t.nombre}</p>
                <p className="mt-1 flex-1 text-xs text-text-secondary">{t.desc}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                  <span className="rounded-full bg-surface px-2 py-0.5">{t.evento}</span>
                  <span className="text-text-muted">→</span>
                  <span className="rounded-full bg-surface px-2 py-0.5">{t.accion}</span>
                </div>
                <AutomationConfigModal
                  title={`Usar plantilla — ${t.nombre}`}
                  initialNombre={t.nombre}
                  initialEvento={t.evento}
                  initialPasos={[t.accion]}
                  onSave={(r) => handleSave(r)}
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
