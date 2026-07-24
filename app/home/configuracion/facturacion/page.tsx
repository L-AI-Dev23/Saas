"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { planActual, usoPlan, planes, historialPagos } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { cn } from "@/lib/utils";

type Plan = (typeof planes)[number];
type Pago = (typeof historialPagos)[number];

export default function FacturacionPage() {
  const [planElegido, setPlanElegido] = useState<Plan | null>(null);
  const [comprobante, setComprobante] = useState<Pago | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Facturación" description="Tu plan, tu consumo y el historial de pagos." />

      <div className="mb-8 flex items-center justify-between rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-text-muted">Plan actual</p>
          <p className="text-xl font-semibold text-text-primary">{planActual.nombre}</p>
          <p className="text-sm text-text-secondary">{planActual.precio}</p>
          <p className="mt-1 text-xs text-text-muted">{planActual.renueva}</p>
        </div>
        <Button asChild className="rounded-lg bg-cta text-white hover:bg-cta-hover">
          <a href="#planes">Cambiar de plan</a>
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {usoPlan.map((u) => {
          const pct = Math.round((u.usado / u.limite) * 100);
          const warn = pct >= 80;
          return (
            <div key={u.metrica} className="rounded-lg border border-border bg-white p-5 shadow-sg-sm">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">{u.metrica}</span>
                <span className="text-text-secondary">
                  {u.usado.toLocaleString()} / {u.limite.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className={cn("h-full rounded-full", warn ? "bg-warning" : "bg-cta")}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div id="planes" className="mb-8">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Planes disponibles</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {planes.map((p) => (
            <div
              key={p.nombre}
              className={cn(
                "flex flex-col rounded-lg border bg-white p-5",
                p.actual ? "border-2 border-cta" : "border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-text-primary">{p.nombre}</p>
                {p.actual && <StatusBadge label="Actual" />}
              </div>
              <p className="mt-2 text-2xl font-semibold text-text-primary">
                {p.precio} <span className="text-sm font-normal text-text-muted">/mes</span>
              </p>
              <ul className="mt-4 flex flex-col gap-2 text-xs text-text-secondary">
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-cta" /> {p.contactos.toLocaleString()} contactos
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-cta" /> {p.mensajes.toLocaleString()} mensajes/mes
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={14} className="text-cta" /> {p.cuentas} cuentas conectadas
                </li>
              </ul>
              <Button
                disabled={p.actual}
                onClick={() => setPlanElegido(p)}
                className={cn(
                  "mt-5 h-9 rounded-lg text-sm font-semibold",
                  p.actual ? "bg-cta/15 text-cta" : "bg-cta text-white hover:bg-cta-hover"
                )}
              >
                {p.actual ? "Plan actual" : "Cambiar a este plan"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-text-primary">Historial de pagos</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historialPagos.map((p, i) => (
                <tr key={i}>
                  <td className="px-5 py-3 text-text-secondary">{p.fecha}</td>
                  <td className="px-5 py-3 font-medium text-text-primary">{p.monto}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={p.estado} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs font-semibold text-cta"
                      onClick={() => setComprobante(p)}
                    >
                      Ver comprobante
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmación de cambio de plan: no cambia nada de verdad, porque eso requiere
          cobrar con Mercado Pago primero. */}
      <Dialog open={!!planElegido} onOpenChange={(open) => !open && setPlanElegido(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar al plan {planElegido?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2 text-sm text-text-secondary">
            <p>
              Para activar el plan <strong className="text-text-primary">{planElegido?.nombre}</strong> ({planElegido?.precio}/mes) te
              vamos a redirigir a Mercado Pago para completar el pago de forma segura.
            </p>
            <p className="text-xs text-text-muted">
              Tu plan no cambia hasta que el pago se confirme. Esta demo todavía no está conectada a Mercado Pago Checkout Pro.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button disabled className="bg-cta text-white opacity-50">
              <ExternalLink size={14} /> Ir a pagar (próximamente)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comprobante: mostramos lo que sí tenemos (fecha/monto/estado) en vez de
          fingir un PDF descargable que no existe. */}
      <Dialog open={!!comprobante} onOpenChange={(open) => !open && setComprobante(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprobante de pago</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-secondary">Fecha</span>
              <span className="font-medium text-text-primary">{comprobante?.fecha}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-secondary">Monto</span>
              <span className="font-medium text-text-primary">{comprobante?.monto}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-secondary">Estado</span>
              {comprobante && <StatusBadge label={comprobante.estado} />}
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Método</span>
              <span className="font-medium text-text-primary">Mercado Pago</span>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            El PDF descargable del comprobante estará disponible cuando se conecte el webhook de Mercado Pago.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
