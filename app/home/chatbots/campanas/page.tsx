"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { chatbotCampanas, chatbotsActivos } from "@/lib/mock-data";
import { Checkbox } from "@/components/base/checkbox/checkbox";

export default function ChatbotCampanasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Campañas de chatbots"
        description="Agrupa varios bots para medir su impacto conjunto."
        action={
          <Dialog>
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
                  <Input placeholder="Ej. Campaña Verano 2026" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label>Inicio</Label>
                    <Input type="date" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Fin</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Chatbots a agrupar</Label>
                  <div className="flex flex-col gap-1 rounded-lg border border-border p-2">
                    {chatbotsActivos.map((b) => (
                      <Checkbox key={b.id} label={b.nombre} className="rounded-md px-2 py-1.5 hover:bg-surface" />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Crear campaña</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {chatbotCampanas.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-white p-5 shadow-sg-sm">
            <p className="text-sm font-semibold text-text-primary">{c.nombre}</p>
            <p className="mt-1 text-xs text-text-secondary">
              {c.bots} bots agrupados · {c.inicio} — {c.fin}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}