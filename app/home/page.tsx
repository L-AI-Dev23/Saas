import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { kpisDashboard, actividadReciente, onboardingSteps } from "@/lib/mock-data";

export default function HomePage() {
  const pendientes = onboardingSteps.filter((s) => !s.done);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Hola de nuevo 👋"
        description="Esto es lo que pasó en tu negocio hoy y esta semana, en todos los módulos."
      />

      {pendientes.length > 0 && (
        <div className="mb-8 rounded-lg border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">
              Completa tu configuración inicial
            </h2>
            <span className="text-sm font-medium text-text-secondary">
              {onboardingSteps.length - pendientes.length}/{onboardingSteps.length} completados
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {onboardingSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sg-sm"
              >
                {step.done ? (
                  <CheckCircle2 size={18} className="shrink-0 text-cta" />
                ) : (
                  <Circle size={18} className="shrink-0 text-text-muted" />
                )}
                <span
                  className={
                    step.done
                      ? "text-sm text-text-muted line-through"
                      : "text-sm font-medium text-text-primary"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <KpiRow items={kpisDashboard} />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-text-primary">
            Contactos nuevos — últimos 30 días
          </h2>
          <div className="flex h-40 items-end gap-2">
            {[14, 22, 18, 30, 26, 34, 28, 40, 33, 45, 38, 52].map((v, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-cta/80" style={{ height: `${v * 1.8}px` }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-text-muted">Semana 1 → Semana 12 (vista simplificada)</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Actividad reciente</h2>
          </div>
          <ul className="flex flex-col gap-4">
            {actividadReciente.map((item, i) => (
              <li key={i} className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
                <span className="text-xs font-semibold text-cta">{item.modulo}</span>
                <span className="text-sm text-text-primary">{item.texto}</span>
                <span className="text-xs text-text-muted">{item.tiempo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Ver conversaciones pendientes", href: "/home/inbox" },
          { label: "Crear un chatbot", href: "/home/chatbots/plantillas" },
          { label: "Lanzar una campaña de email", href: "/home/email/campanas" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center justify-between rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
          >
            <span className="text-sm font-semibold text-text-primary">{a.label}</span>
            <ArrowRight size={16} className="text-cta" />
          </Link>
        ))}
      </div>
    </div>
  );
}
