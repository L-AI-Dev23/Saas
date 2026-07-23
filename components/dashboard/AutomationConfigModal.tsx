"use client";

import { useId, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";

export const eventosAutomatizacion = [
  "Carrito abandonado",
  "Contacto nuevo",
  "Compra realizada",
  "Etiqueta agregada",
  "Formulario enviado",
];

// Sugerencias rápidas para armar pasos — quedan como punto de partida editable,
// no como única opción posible (el input de cada paso acepta texto libre).
export const accionesAutomatizacion = [
  "Enviar email",
  "Agregar etiqueta",
  "Esperar X días",
  "Crear notificación",
];

export interface AutomationConfigResult {
  nombre: string;
  evento: string;
  pasos: string[];
}

interface PasoState {
  id: string;
  texto: string;
}

let pasoCounter = 0;
function nuevoPaso(texto = ""): PasoState {
  pasoCounter += 1;
  return { id: `paso-${pasoCounter}`, texto };
}

export function AutomationConfigModal({
  trigger,
  open,
  onOpenChange,
  title = "Nueva automatización",
  initialNombre = "",
  initialEvento = eventosAutomatizacion[0],
  initialPasos = [""],
  onSave,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  initialNombre?: string;
  initialEvento?: string;
  initialPasos?: string[];
  onSave: (result: AutomationConfigResult) => void;
}) {
  const idBase = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const [nombre, setNombre] = useState(initialNombre);
  const [evento, setEvento] = useState(initialEvento);
  const [pasos, setPasos] = useState<PasoState[]>(
    (initialPasos.length ? initialPasos : [""]).map((texto) => nuevoPaso(texto))
  );

  // Si viene con `trigger`, es un modal auto-controlado (crear); si no, lo controla
  // el padre vía `open`/`onOpenChange` (editar desde una fila existente).
  const isControlled = trigger === undefined;
  const isOpen = isControlled ? !!open : internalOpen;

  function handleOpenChange(next: boolean) {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
    if (next) {
      // Reinicia con los valores sugeridos (de plantilla o de la regla a editar)
      // cada vez que se abre.
      setNombre(initialNombre);
      setEvento(initialEvento);
      setPasos((initialPasos.length ? initialPasos : [""]).map((texto) => nuevoPaso(texto)));
    }
  }

  const pasosValidos = pasos.map((p) => p.texto.trim()).filter(Boolean);
  const puedeGuardar = nombre.trim().length > 0 && pasosValidos.length > 0;

  function handleSave() {
    if (!puedeGuardar) return;
    onSave({ nombre: nombre.trim(), evento, pasos: pasosValidos });
    handleOpenChange(false);
  }

  function addPaso(texto = "") {
    setPasos((prev) => [...prev, nuevoPaso(texto)]);
  }

  function updatePaso(id: string, texto: string) {
    setPasos((prev) => prev.map((p) => (p.id === id ? { ...p, texto } : p)));
  }

  function removePaso(id: string) {
    setPasos((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  }

  const dialogProps = isControlled
    ? { open: isOpen, onOpenChange: handleOpenChange }
    : { open: internalOpen, onOpenChange: handleOpenChange };

  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre</Label>
            <Input
              placeholder="Ej. Recordatorio de carrito"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Evento disparador</Label>
            <SelectDropdown options={eventosAutomatizacion} value={evento} onChange={setEvento} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Acciones (en orden)</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-7 px-2 text-xs">
                    <Plus size={13} /> Añadir paso
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  {accionesAutomatizacion.map((preset) => (
                    <DropdownMenuItem key={preset} className="cursor-pointer" onSelect={() => addPaso(preset)}>
                      {preset}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => addPaso("")}>
                    Paso personalizado
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-2">
              {pasos.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-semibold text-text-muted"
                  >
                    {idx + 1}
                  </span>
                  <Input
                    aria-label={`Paso ${idx + 1}`}
                    placeholder='Ej. Enviar email, Agregar tag "vip", Esperar 2h'
                    value={p.texto}
                    onChange={(e) => updatePaso(p.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removePaso(p.id)}
                    disabled={pasos.length === 1}
                    aria-label={`Eliminar paso ${idx + 1}`}
                    className="shrink-0 rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-error disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            {pasosValidos.length > 0 && (
              <p className="mt-1 text-xs text-text-muted">
                Vista previa: <span className="font-medium text-text-secondary">{pasosValidos.join(" + ")}</span>
              </p>
            )}
          </div>
          <p className="sr-only" id={idBase} />
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
            Guardar y activar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
