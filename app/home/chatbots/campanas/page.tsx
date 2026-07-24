"use client";

import { useState } from "react";
import { Plus, Megaphone, AlertCircle } from "lucide-react";
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
import { Tabs, TabList } from "@/components/application/tabs/tabs";

// Las campañas de chatbots agrupan bots de redes sociales.
// Hasta que se conecte la API de Meta/TikTok, no hay bots disponibles para agrupar.

export default function ChatbotCampanasPage() {
  const [filtro, setFiltro] = useState<"activas" | "todas">("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", inicio: "", fin: "" });

  const errorFechas = form.inicio && form.fin && form.fin < form.inicio;
  const puedeCrear = form.nombre.trim() && form.inicio && form.fin && !errorFechas;

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
              if (!open) setForm({ nombre: "", inicio: "", fin: "" });
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                  <Plus size={16} /> Nueva campaña
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                  <p className="rounded-lg bg-surface p-3 text-xs text-text-secondary">
                    Para agrupar bots en una campaña primero necesitas{" "}
                    <a href="/home/chatbots/plantillas" className="text-cta underline">
                      crear chatbots
                    </a>{" "}
                    conectando una cuenta social.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
                    disabled={!puedeCrear}
                  >
                    Crear campaña
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
          <Megaphone size={22} />
        </span>
        <p className="text-sm font-semibold text-text-primary">Todavía no tienes campañas</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Agrupa varios chatbots en una campaña para medir su impacto conjunto en mensajes y conversiones.
        </p>
        <Button className="mt-4 rounded-lg bg-cta text-white hover:bg-cta-hover" onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Nueva campaña
        </Button>
      </div>
    </div>
  );
}