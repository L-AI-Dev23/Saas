"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Check } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEmailPlantillas, updateEmailPlantilla, deleteEmailPlantilla } from "@/lib/email-plantillas-store";

export default function EmailPlantillaDetallePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const plantillas = useEmailPlantillas();
  const plantilla = plantillas.find((p) => p.id === id);

  if (!plantilla) {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/home/email/plantillas")}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Volver a Plantillas
        </button>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">Esta plantilla ya no existe</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">Puede que haya sido eliminada.</p>
        </div>
      </div>
    );
  }

  return <EditorPlantilla id={plantilla.id} nombre={plantilla.nombre} asunto={plantilla.asunto} cuerpo={plantilla.cuerpo} />;
}

function EditorPlantilla({
  id,
  nombre: nombreInicial,
  asunto: asuntoInicial,
  cuerpo: cuerpoInicial,
}: {
  id: number;
  nombre: string;
  asunto: string;
  cuerpo: string;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(nombreInicial);
  const [asunto, setAsunto] = useState(asuntoInicial);
  const [cuerpo, setCuerpo] = useState(cuerpoInicial);
  const [guardado, setGuardado] = useState(false);

  const puedeGuardar = nombre.trim().length > 0;

  function guardar() {
    if (!puedeGuardar) return;
    updateEmailPlantilla(id, { nombre: nombre.trim(), asunto: asunto.trim(), cuerpo });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  function eliminar() {
    const confirmar = window.confirm(`¿Eliminar la plantilla "${nombreInicial}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    deleteEmailPlantilla(id);
    router.push("/home/email/plantillas");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/home/email/plantillas")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} /> Volver a Plantillas
      </button>

      <PageHeader title="Editar plantilla" description="Este contenido se reutiliza en campañas y automatizaciones." />

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-5 shadow-sg-sm">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre de la plantilla</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Bienvenida" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Asunto del correo</Label>
          <Input value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Ej. ¡Bienvenido a Codew!" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Cuerpo del correo</Label>
          <TextArea
            rows={14}
            value={cuerpo}
            onChange={setCuerpo}
            placeholder="Escribe el contenido del email…"
            hint="Podés usar variables como {{nombre}} para personalizar el envío."
            aria-label="Cuerpo del correo"
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <Button
              className="bg-cta text-white hover:bg-cta-hover disabled:opacity-50"
              disabled={!puedeGuardar}
              onClick={guardar}
            >
              Guardar cambios
            </Button>
            {guardado && (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <Check size={14} /> Guardado
              </span>
            )}
          </div>
          <button
            onClick={eliminar}
            className="flex items-center gap-1.5 text-xs font-semibold text-error hover:underline"
          >
            <Trash2 size={13} /> Eliminar plantilla
          </button>
        </div>
      </div>
    </div>
  );
}
