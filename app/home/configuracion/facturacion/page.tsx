import { Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { planActual, usoPlan, planes, historialPagos } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { cn } from "@/lib/utils";

export default function FacturacionPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Facturación" description="Tu plan, tu consumo y el historial de pagos." />

      <div className="mb-8 flex items-center justify-between rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-text-muted">Plan actual</p>
          <p className="text-xl font-semibold text-text-primary">{planActual.nombre}</p>
          <p className="text-sm text-text-secondary">{planActual.precio}</p>
        </div>
        <a href="#planes" className="rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-hover">
          Cambiar de plan
        </a>
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
              <button
                disabled={p.actual}
                className={cn(
                  "mt-5 h-9 rounded-lg text-sm font-semibold",
                  p.actual ? "bg-cta/15 text-cta" : "bg-cta text-white hover:bg-cta-hover"
                )}
              >
                {p.actual ? "Plan actual" : "Cambiar a este plan"}
              </button>
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
                    <button className="text-xs font-semibold text-cta hover:underline">Ver comprobante</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
