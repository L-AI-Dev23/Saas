import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { crmKpis, contactos } from "@/lib/mock-data";

export default function CrmDashboardPage() {
  const recientes = contactos.slice(0, 5);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="CRM" description="Leads nuevos, conversión a cliente y actividad reciente." />
      <KpiRow items={crmKpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Actividad reciente de contactos</h2>
        <div className="divide-y divide-border">
          {recientes.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dashboard-bg text-xs font-semibold text-text-secondary">
                  {c.nombre.charAt(0)}
                </div>
                <span className="font-medium text-text-primary">{c.nombre}</span>
              </div>
              <span className="text-xs text-text-muted">Origen: {c.origen}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
