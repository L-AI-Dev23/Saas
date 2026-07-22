import { Zap } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { automatizacionesPlantillas } from "@/lib/mock-data";

export default function AutomatizacionesPlantillasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de automatización"
        description="Automatizaciones preconfiguradas, listas para implementar en pocos clics."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {automatizacionesPlantillas.map((t) => (
          <div
            key={t.id}
            className="flex flex-col rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cta/10 text-cta">
              <Zap size={20} />
            </span>
            <p className="text-sm font-semibold text-text-primary">{t.nombre}</p>
            <p className="mt-1 flex-1 text-xs text-text-secondary">{t.desc}</p>
            <Button className="mt-4 h-9 w-full rounded-lg bg-cta text-white hover:bg-cta-hover">
              Usar plantilla
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
