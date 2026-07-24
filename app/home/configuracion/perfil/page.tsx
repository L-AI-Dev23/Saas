"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { usePerfil, updatePerfil } from "@/lib/perfil-store";

const zonasHorarias = [
  "America/Lima",
  "America/Bogota",
  "America/Mexico_City",
  "America/Santiago",
  "America/Argentina/Buenos_Aires",
  "America/New_York",
  "Europe/Madrid",
];

export default function PerfilPage() {
  const perfil = usePerfil();

  const [nombreNegocio, setNombreNegocio] = useState(perfil.nombreNegocio);
  const [zonaHoraria, setZonaHoraria] = useState(perfil.zonaHoraria);
  const [nombreCompleto, setNombreCompleto] = useState(perfil.nombreCompleto);
  const [telefono, setTelefono] = useState(perfil.telefono);
  const [guardado, setGuardado] = useState(false);

  const puedeGuardar = nombreNegocio.trim().length > 0 && nombreCompleto.trim().length > 0;

  function guardar() {
    if (!puedeGuardar) return;
    updatePerfil({
      nombreNegocio: nombreNegocio.trim(),
      zonaHoraria,
      nombreCompleto: nombreCompleto.trim(),
      telefono: telefono.trim(),
    });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Perfil" description="Datos de tu negocio y de tu cuenta personal." />

      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Negocio</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre del negocio</Label>
              <Input value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Zona horaria</Label>
              <SelectDropdown options={zonasHorarias} value={zonaHoraria} onChange={setZonaHoraria} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Usuario</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dashboard-bg text-lg font-semibold text-text-secondary">
              {nombreCompleto.trim().charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <button
                disabled
                title="Requiere subida de archivos; próximamente"
                className="text-xs font-semibold text-text-muted"
              >
                Cambiar foto (próximamente)
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre completo</Label>
              <Input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email de la cuenta</Label>
              <Input value={perfil.email} disabled className="opacity-70" />
              <p className="text-xs text-text-muted">Para cambiar el email de acceso, contactá a soporte.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Teléfono</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="w-fit bg-cta text-white hover:bg-cta-hover disabled:opacity-50" disabled={!puedeGuardar} onClick={guardar}>
            Guardar cambios
          </Button>
          {guardado && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <Check size={14} /> Cambios guardados
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
