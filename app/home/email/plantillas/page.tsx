import { Plus, Mail, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { emailPlantillas } from "@/lib/mock-data";

export default function EmailPlantillasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de email"
        description="Diseña una vez, reutiliza en campañas y automatizaciones."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
            <Plus size={16} /> Nueva plantilla
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {emailPlantillas.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sg-sm transition-shadow hover:shadow-sg-md"
          >
            <div className="flex h-32 items-center justify-center bg-surface text-text-muted">
              <Mail size={28} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.nombre}</p>
                <p className="text-xs text-text-muted">Editado {t.editado}</p>
              </div>
              <button className="text-text-muted hover:text-text-primary">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
