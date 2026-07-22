import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { emailKpis, emailCampanas } from "@/lib/mock-data";

export default function EmailDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Email" description="Métricas generales de tu panel de Email marketing." />
      <KpiRow items={emailKpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Envíos — últimos 30 días</h2>
        <div className="flex h-36 items-end gap-2">
          {[20, 35, 18, 40, 60, 32, 45, 58, 30, 48, 70, 55].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-link/70" style={{ height: `${v * 1.6}px` }} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Campañas recientes</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Lista</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emailCampanas.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.lista}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={c.estado} />
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{c.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
