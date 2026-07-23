"use client";

import { useState } from "react";
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
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import type { ContactoInput } from "@/lib/contacts-store";

export const origenesContacto = ["chatbot", "email", "manual", "catalogo"];
export const etapasContacto = [
  { key: "nuevo", label: "Nuevo" },
  { key: "en_conversacion", label: "En conversación" },
  { key: "cliente", label: "Cliente" },
  { key: "inactivo", label: "Inactivo" },
];

export function ContactConfigModal({
  trigger,
  onSave,
}: {
  trigger: React.ReactNode;
  onSave: (data: ContactoInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [origen, setOrigen] = useState(origenesContacto[2]);
  const [etapaLabel, setEtapaLabel] = useState(etapasContacto[0].label);

  const puedeGuardar = nombre.trim().length > 0 && email.trim().length > 0;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setNombre("");
      setEmail("");
      setTelefono("");
      setOrigen(origenesContacto[2]);
      setEtapaLabel(etapasContacto[0].label);
    }
  }

  function handleSave() {
    if (!puedeGuardar) return;
    const etapa = etapasContacto.find((e) => e.label === etapaLabel)?.key ?? "nuevo";
    onSave({ nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim(), origen, etapa, tags: [] });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo contacto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre</Label>
            <Input placeholder="Ej. María Fernández" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Ej. maria.fernandez@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Teléfono</Label>
            <Input placeholder="Ej. +51 987 654 321" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Origen</Label>
            <SelectDropdown options={origenesContacto} value={origen} onChange={setOrigen} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Etapa</Label>
            <SelectDropdown
              options={etapasContacto.map((e) => e.label)}
              value={etapaLabel}
              onChange={setEtapaLabel}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
            disabled={!puedeGuardar}
            onClick={handleSave}
          >
            Crear contacto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
