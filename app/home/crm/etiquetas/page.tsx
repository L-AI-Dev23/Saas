"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { crmTags } from "@/lib/mock-data";

export default function EtiquetasPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Etiquetas"
        description="Tags compartidos entre CRM, Email y Chatbots."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva etiqueta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva etiqueta</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input placeholder="Ej. interesado en curso X" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {["#f65858", "#00c98d", "#009fc1", "#ca8a04", "#6b7280"].map((c) => (
                      <button
                        key={c}
                        className="h-7 w-7 rounded-full border border-border"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button className="bg-cta text-white hover:bg-cta-hover">Crear etiqueta</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {crmTags.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="text-sm font-medium text-text-primary">{t.nombre}</span>
              <span className="text-xs text-text-muted">{t.contactos} contactos</span>
            </div>
            <button className="text-text-muted hover:text-error">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}