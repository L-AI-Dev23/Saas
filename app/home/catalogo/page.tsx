"use client";

import Link from "next/link";
import { ExternalLink, Package } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";

// Los KPIs de catálogo (visitas, clics) requieren analítica del sitio público
// que aún no está conectada. Se muestran en cero para cuentas nuevas.
const kpis = [
  { label: "Visitas (mes)", value: "0" },
  { label: "Clics a contacto", value: "0" },
  { label: "Productos activos", value: "0" },
];

export default function CatalogoDashboardPage() {
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
      <KpiRow items={kpis} />

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Productos más vistos</h2>
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <Package size={28} className="text-text-muted" />
          <p className="text-sm font-semibold text-text-primary">Aún no tienes productos</p>
          <p className="text-sm text-text-secondary">
            <Link href="/home/catalogo/productos" className="text-cta underline">
              Agrega tu primer producto
            </Link>{" "}
            para que aparezca aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
