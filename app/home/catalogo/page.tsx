import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { catalogoKpis, productos } from "@/lib/mock-data";

export default function CatalogoDashboardPage() {
  const masVistos = [...productos].slice(0, 4);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Catálogo"
        description="Vistas de tu página pública y qué productos generan más interés."
        action={
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface"
          >
            Ver página pública <ExternalLink size={14} />
          </a>
        }
      />
      <KpiRow items={catalogoKpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Productos más vistos</h2>
        <div className="divide-y divide-border">
          {masVistos.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-text-muted">#{i + 1}</span>
                <span className="font-medium text-text-primary">{p.nombre}</span>
              </div>
              <span className="text-text-secondary">{p.precio}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
