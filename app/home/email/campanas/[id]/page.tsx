"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, MailOpen, MousePointerClick, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useEmailCampanas } from "@/lib/email-campanas-store";

function pct(parte: number, total: number) {
  if (total <= 0) return "0%";
  return `${((parte / total) * 100).toFixed(1)}%`;
}

export default function ReporteCampanaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const campanas = useEmailCampanas();
  const campana = campanas.find((c) => c.id === id);

  if (!campana || !campana.reporte) {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/home/email/campanas")}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Volver a Campañas
        </button>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-text-primary">No hay reporte disponible</p>
          <p className="mt-1 max-w-sm text-sm text-text-secondary">
            Esta campaña todavía no fue enviada, o ya no existe.
          </p>
        </div>
      </div>
    );
  }

  const { enviados, aperturas, clics, rebotes } = campana.reporte;

  const metricas = [
    { label: "Enviados", valor: enviados.toLocaleString(), sub: "100%", icon: Mail },
    { label: "Aperturas", valor: aperturas.toLocaleString(), sub: pct(aperturas, enviados), icon: MailOpen },
    { label: "Clics", valor: clics.toLocaleString(), sub: pct(clics, aperturas), icon: MousePointerClick },
    { label: "Rebotes", valor: rebotes.toLocaleString(), sub: pct(rebotes, enviados), icon: AlertTriangle },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/home/email/campanas")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} /> Volver a Campañas
      </button>

      <PageHeader
        title={campana.nombre}
        description={`Enviada el ${campana.fecha} a “${campana.lista}”.`}
        action={<StatusBadge label={campana.estado} />}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricas.map((m) => (
          <div key={m.label} className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4 shadow-sg-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-text-muted">
              <m.icon size={16} />
            </span>
            <p className="text-2xl font-semibold text-text-primary">{m.valor}</p>
            <p className="text-xs text-text-muted">
              {m.label} · {m.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-white p-5">
        <p className="text-sm font-semibold text-text-primary">Resumen</p>
        <p className="mt-1 text-sm text-text-secondary">
          De {enviados.toLocaleString()} correos enviados, {pct(aperturas, enviados)} fueron abiertos y{" "}
          {pct(clics, aperturas)} de quienes abrieron hicieron clic en algún enlace. La tasa de rebote fue de{" "}
          {pct(rebotes, enviados)}.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Métricas simuladas con fines de demostración; se calcularán en base a envíos reales cuando se conecte el proveedor de email.
        </p>
      </div>
    </div>
  );
}
