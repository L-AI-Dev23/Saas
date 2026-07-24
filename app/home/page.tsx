"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { ContactsChart } from "@/components/dashboard/ContactsChart";
import { useContactos } from "@/lib/contacts-store";
import { useEmailCampanas } from "@/lib/email-campanas-store";
import { useAutomationRules } from "@/lib/automations-store";

const RANGOS = [
  { label: "7 días", dias: 7 },
  { label: "30 días", dias: 30 },
  { label: "90 días", dias: 90 },
] as const;

const ONBOARDING_STEPS = [
  { step: "add_contact", label: "Agrega tu primer contacto al CRM", href: "/home/crm/contactos" },
  { step: "add_product", label: "Agrega tu primer producto al catálogo", href: "/home/catalogo/productos" },
  { step: "first_campaign", label: "Lanza tu primera campaña de email", href: "/home/email/campanas" },
  { step: "first_automation", label: "Crea tu primera automatización", href: "/home/automatizaciones/activas" },
];

export default function HomePage() {
  const [rangoDias, setRangoDias] = useState(30);
  const contactos = useContactos();
  const campanas = useEmailCampanas();
  const automatizaciones = useAutomationRules();

  // Construimos KPIs a partir de datos reales
  const kpis = [
    { label: "Contactos totales", value: contactos.length.toString(), delta: undefined },
    { label: "Campañas de email", value: campanas.length.toString(), delta: undefined },
    { label: "Automatizaciones activas", value: automatizaciones.filter((a) => a.estado).length.toString(), delta: undefined },
  ];

  // Serie de datos del gráfico: contactos por día basado en created_at
  const hoy = new Date();
  const chartData = Array.from({ length: rangoDias }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (rangoDias - 1 - i));
    const yyyy = fecha.toISOString().slice(0, 10);
    const count = contactos.filter((c) => c.tiempo && new Date(c.tiempo).toISOString().slice(0, 10) === yyyy).length;
    return {
      fecha: yyyy,
      fechaCorta: fecha.toLocaleDateString("es-PE", { day: "numeric", month: "short" }),
      contactos: count,
    };
  });

  const completados = ONBOARDING_STEPS.filter((s) => {
    if (s.step === "add_contact") return contactos.length > 0;
    if (s.step === "add_product") return false; // Se integrará con catálogo real
    if (s.step === "first_campaign") return campanas.length > 0;
    if (s.step === "first_automation") return automatizaciones.length > 0;
    return false;
  });
  const pendientes = ONBOARDING_STEPS.filter((s) => !completados.find((c) => c.step === s.step));

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
              {completados.length}/{ONBOARDING_STEPS.length} completados
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {ONBOARDING_STEPS.map((step) => {
              const done = !!completados.find((c) => c.step === step.step);
              return done ? (
                <div
                  key={step.step}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sg-sm"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-cta" />
                  <span className="text-sm text-text-muted line-through">{step.label}</span>
                </div>
              ) : (
                <Link
                  key={step.step}
                  href={step.href}
                  className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sg-sm transition-shadow hover:shadow-sg-md"
                >
                  <Circle size={18} className="shrink-0 text-text-muted" />
                  <span className="text-sm font-medium text-text-primary">{step.label}</span>
                  <ArrowRight size={16} className="ml-auto shrink-0 text-cta" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <KpiRow items={kpis} />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="flex h-[340px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Contactos nuevos</h2>
            <div className="flex gap-1 rounded-md bg-background p-1">
              {RANGOS.map((r) => (
                <button
                  key={r.dias}
                  onClick={() => setRangoDias(r.dias)}
                  className={
                    rangoDias === r.dias
                      ? "rounded px-2.5 py-1 text-xs font-medium bg-white text-text-primary shadow-sg-sm"
                      : "rounded px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary"
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          {chartData.every((d) => d.contactos === 0) ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-text-muted">Aún no hay contactos para mostrar en el gráfico.</p>
            </div>
          ) : (
            <div className="min-h-0 flex-1">
              <ContactsChart data={chartData} />
            </div>
          )}
        </div>

        <div className="flex h-[340px] flex-col rounded-lg border border-border bg-white p-6 shadow-sg-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary">Actividad reciente</h2>
          </div>
          <p className="py-6 text-center text-sm text-text-muted">
            Sin actividad reciente todavía.
          </p>
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