"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { productos, categorias } from "@/lib/mock-data";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { TextArea } from "@/components/base/textarea/textarea";
import { FileUploadDropZone } from "@/components/application/file-upload/file-upload-base";
import { cn } from "@/lib/utils";

export default function ProductosPage() {
  const nombresCategorias = categorias.map((c) => c.nombre);
  const [categoria, setCategoria] = useState(nombresCategorias[0]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Productos"
        description="El catálogo que se muestra en tu página pública y que tus chatbots pueden ofrecer."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                <Plus size={16} /> Nuevo producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo producto</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Nombre</Label>
                  <Input placeholder="Ej. Curso de Excel Avanzado" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Descripción</Label>
                  <TextArea rows={3} aria-label="Descripción" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label>Precio (S/)</Label>
                    <Input type="number" placeholder="129" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Categoría</Label>
                    <SelectDropdown options={nombresCategorias} value={categoria} onChange={setCategoria} />
                  </div>
                </div>
                <Checkbox defaultSelected label="Sin control de stock" />
                <div className="flex flex-col gap-1.5">
                  <Label>Imágenes</Label>
                  <FileUploadDropZone accept="image/*" hint="SVG, PNG, JPG o GIF (máx. 5MB)" maxSize={5 * 1024 * 1024} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-cta text-white hover:bg-cta-hover">Guardar producto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sg-sm",
              !p.activo && "opacity-60"
            )}
          >
            <div className="flex h-32 items-center justify-center bg-surface text-text-muted">
              <Package size={28} />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <p className="text-sm font-semibold text-text-primary">{p.nombre}</p>
              <p className="text-xs text-text-muted">{p.categoria}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-text-primary">{p.precio}</span>
                <div className={cn("flex h-4 w-8 items-center rounded-full p-0.5", p.activo ? "bg-cta" : "bg-border")}>
                  <div className={cn("h-3 w-3 rounded-full bg-white transition-transform", p.activo && "translate-x-4")} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
