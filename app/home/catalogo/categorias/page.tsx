"use client";

import { useState } from "react";
import { Plus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/animate-ui/components/radix/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { categorias } from "@/lib/mock-data";

const SIN_PADRE = "Sin categoría padre";

export default function CategoriasPage() {
  const [padre, setPadre] = useState(SIN_PADRE);
  const opcionesPadre = [SIN_PADRE, ...categorias.map((c) => c.nombre)];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Categorías"
        description="Organiza tus productos jerárquicamente."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nueva categoría
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nueva categoría</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input placeholder="Ej. Excel" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Categoría padre (opcional)</Label>
                  <SelectDropdown options={opcionesPadre} value={padre} onChange={setPadre} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Crear categoría</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {categorias.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <FolderTree size={16} className="text-text-muted" />
              <span className={c.padre ? "ml-4 text-sm text-text-primary" : "text-sm font-medium text-text-primary"}>
                {c.padre ? `${c.padre} / ${c.nombre}` : c.nombre}
              </span>
            </div>
            <span className="text-xs text-text-muted">{c.productos} productos</span>
          </div>
        ))}
      </div>
    </div>
  );
}