"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Megaphone, Trash2, MessageSquare, AlertCircle } from "lucide-react";
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
import { CampaignBotsChart } from "@/components/dashboard/CampaignBotsChart";
import { chatbotCampanas, chatbotsActivos } from "@/lib/mock-data";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Tabs, TabList } from "@/components/application/tabs/tabs";

type Campana = (typeof chatbotCampanas)[number];

function estadoCampana(c: Campana): "Activa" | "Próxima" | "Finalizada" {
  const hoy = new Date();
  const inicio = new Date(c.inicio);
  const fin = new Date(c.fin);
  if (hoy < inicio) return "Próxima";
  if (hoy > fin) return "Finalizada";
  return "Activa";
}

function formatFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Campañas (activas o próximas) en las que ya participa un bot, para avisar solapamientos.
function campanasDeBot(botId: number, campanas: Campana[], excluirId?: number) {
  return campanas.filter(
    (c) => c.id !== excluirId && c.botIds.includes(botId) && estadoCampana(c) !== "Finalizada"
  );
}

const emptyForm = { nombre: "", inicio: "", fin: "", botIds: [] as number[] };

export default function ChatbotCampanasPage() {
  const [campanas, setCampanas] = useState<Campana[]>(chatbotCampanas);
  const [filtro, setFiltro] = useState<"activas" | "todas">("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [seleccionada, setSeleccionada] = useState<Campana | null>(null);

  const visibles = useMemo(() => {
    if (filtro === "todas") return campanas;
    return campanas.filter((c) => estadoCampana(c) === "Activa");
  }, [campanas, filtro]);

  const errorFechas = form.inicio && form.fin && form.fin < form.inicio;
  const puedeCrear = form.nombre.trim() && form.inicio && form.fin && !errorFechas && form.botIds.length > 0;

  function toggleBotForm(id: number) {
    setForm((f) => ({
      ...f,
      botIds: f.botIds.includes(id) ? f.botIds.filter((b) => b !== id) : [...f.botIds, id],
    }));
  }

  function crearCampana() {
    if (!puedeCrear) return;
    const nextId = campanas.length ? Math.max(...campanas.map((c) => c.id)) + 1 : 1;
    setCampanas((prev) => [...prev, { id: nextId, ...form }]);
    setForm(emptyForm);
    setDialogOpen(false);
  }

  function eliminarCampana(id: number) {
    setCampanas((prev) => prev.filter((c) => c.id !== id));
    setSeleccionada(null);
  }

  const botsDeSeleccionada = seleccionada
    ? chatbotsActivos.filter((b) => seleccionada.botIds.includes(b.id))
    : [];
  const totalMensajes = botsDeSeleccionada.reduce((sum, b) => sum + b.mensajes, 0);
  const chartData = botsDeSeleccionada
    .map((b) => ({ nombre: b.nombre, mensajes: b.mensajes }))
    .sort((a, b) => b.mensajes - a.mensajes);

  if (seleccionada) {
    const otrasBots = botsDeSeleccionada.map((b) => ({
      bot: b,
      otras: campanasDeBot(b.id, campanas, seleccionada.id),
    }));

    return (
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => setSeleccionada(null)}
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Volver a campañas
        </button>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Megaphone size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-text-primary">{seleccionada.nombre}</h1>
                <StatusBadge label={estadoCampana(seleccionada)} />
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {formatFecha(seleccionada.inicio)} — {formatFecha(seleccionada.fin)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0 text-error hover:bg-error/5 hover:text-error"
            onClick={() => eliminarCampana(seleccionada.id)}
          >
            <Trash2 size={14} /> Eliminar campaña
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-5 sm:col-span-1">
            <p className="text-xs font-semibold uppercase text-text-muted">Mensajes totales</p>
            <p className="mt-1 text-3xl font-semibold text-text-primary">{totalMensajes.toLocaleString()}</p>
            <p className="mt-1 text-xs text-text-secondary">
              {botsDeSeleccionada.length} {botsDeSeleccionada.length === 1 ? "bot agrupado" : "bots agrupados"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-5 sm:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase text-text-muted">Mensajes por bot</p>
            {chartData.length > 0 ? (
              <CampaignBotsChart data={chartData} />
            ) : (
              <p className="text-xs text-text-muted">Esta campaña no tiene bots agrupados.</p>
            )}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
          <div className="border-b border-border px-5 py-3">
            <p className="text-xs font-semibold uppercase text-text-muted">Bots agrupados</p>
          </div>
          <ul className="divide-y divide-border">
            {otrasBots.map(({ bot, otras }) => (
              <li key={bot.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{bot.nombre}</p>
                  {otras.length > 0 && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      También en: {otras.map((c) => c.nombre).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-sm text-text-secondary">{bot.mensajes.toLocaleString()} msj</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Campañas de chatbots"
        description="Agrupa varios bots para medir su impacto conjunto."
        action={
          <div className="flex items-center gap-2">
            <Tabs selectedKey={filtro} onSelectionChange={(key) => setFiltro(key as "activas" | "todas")}>
              <TabList
                type="button-border"
                size="sm"
                items={[
                  { id: "activas", label: "Activas" },
                  { id: "todas", label: "Todas" },
                ]}
              />
            </Tabs>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setForm(emptyForm);
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                  <Plus size={16} /> Nueva campaña
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nueva campaña de chatbots</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-1.5">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Ej. Campaña Verano 2026"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>Inicio</Label>
                      <Input
                        type="date"
                        value={form.inicio}
                        onChange={(e) => setForm((f) => ({ ...f, inicio: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Fin</Label>
                      <Input
                        type="date"
                        value={form.fin}
                        onChange={(e) => setForm((f) => ({ ...f, fin: e.target.value }))}
                      />
                    </div>
                  </div>
                  {errorFechas && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-error">
                      <AlertCircle size={13} /> La fecha de fin debe ser posterior a la de inicio.
                    </p>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label>Chatbots a agrupar</Label>
                      <span className="text-xs text-text-muted">{form.botIds.length} seleccionados</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-lg border border-border p-2">
                      {chatbotsActivos.map((b) => {
                        const solapadas = campanasDeBot(b.id, campanas);
                        return (
                          <label
                            key={b.id}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface"
                          >
                            <Checkbox
                              checked={form.botIds.includes(b.id)}
                              onCheckedChange={() => toggleBotForm(b.id)}
                            />
                            <span>{b.nombre}</span>
                            {solapadas.length > 0 && (
                              <span className="ml-auto text-xs font-normal text-text-muted">
                                también en: {solapadas.map((c) => c.nombre).join(", ")}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                    disabled={!puedeCrear}
                    onClick={crearCampana}
                  >
                    Crear campaña
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {visibles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
            <Megaphone size={22} />
          </span>
          {campanas.length === 0 ? (
            <>
              <p className="text-sm font-semibold text-text-primary">Todavía no tienes campañas</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                Agrupa varios chatbots en una campaña para medir su impacto conjunto en mensajes y conversiones.
              </p>
              <Button className="mt-4 rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={() => setDialogOpen(true)}>
                <Plus size={16} /> Nueva campaña
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-text-primary">No hay campañas activas ahora mismo</p>
              <p className="mt-1 max-w-sm text-sm text-text-secondary">
                Cambia a la pestaña &quot;Todas&quot; para ver campañas próximas o finalizadas.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibles.map((c) => {
            const bots = chatbotsActivos.filter((b) => c.botIds.includes(b.id));
            const mensajes = bots.reduce((sum, b) => sum + b.mensajes, 0);
            const estado = estadoCampana(c);
            return (
              <button
                key={c.id}
                onClick={() => setSeleccionada(c)}
                className="flex flex-col rounded-lg border border-border bg-white p-5 text-left shadow-sg-sm transition-shadow hover:shadow-sg-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Megaphone size={18} />
                  </span>
                  <StatusBadge label={estado} />
                </div>
                <p className="mt-3 text-sm font-semibold text-text-primary">{c.nombre}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {c.botIds.length} {c.botIds.length === 1 ? "bot agrupado" : "bots agrupados"} · {formatFecha(c.inicio)} — {formatFecha(c.fin)}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                  <MessageSquare size={13} className="text-text-muted" />
                  {mensajes.toLocaleString()} mensajes en total
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}