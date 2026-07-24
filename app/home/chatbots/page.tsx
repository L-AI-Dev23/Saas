"use client";

import Link from "next/link";
import { Plus, Bot } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/animate-ui/components/buttons/button";

// Los chatbots se gestionan vía APIs de redes sociales (Meta, TikTok).
// La integración con dichas APIs aún no está conectada.
// Esta página mostrará el estado vacío correcto para nuevas cuentas.

const kpis = [
  { label: "Bots activos", value: "0", href: "/home/chatbots/activos" },
  { label: "Mensajes del mes", value: "0", href: "#" },
  { label: "Contactos capturados", value: "0", href: "/home/crm/contactos" },
];

export default function ChatbotsDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Chatbots"
        description="Automatizaciones conversacionales dentro de tus redes sociales."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/chatbots/plantillas">
              <Plus size={16} /> Nuevo chatbot
            </Link>
          </Button>
        }
      />

      <KpiRow items={kpis} />

      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
          <Bot size={22} />
        </span>
        <p className="text-sm font-semibold text-text-primary">Todavía no tienes chatbots</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Conecta una cuenta social desde{" "}
          <Link href="/home/configuracion" className="text-cta underline">
            Configuración → Cuentas
          </Link>{" "}
          y crea tu primer chatbot a partir de una plantilla.
        </p>
        <Button className="mt-4 rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
          <Link href="/home/chatbots/plantillas">
            <Plus size={16} /> Crear chatbot
          </Link>
        </Button>
      </div>
    </div>
  );
}
