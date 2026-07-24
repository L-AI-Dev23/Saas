"use client";

import Link from "next/link";
import { Plus, Bot } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";

// Los chatbots activos vienen de la API de redes sociales (Meta, TikTok).
// Hasta que se conecte esa integración, la página muestra el estado vacío correcto.

export default function ChatbotsActivosPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Chatbots activos"
        description="Todos los bots en operación en tus cuentas conectadas."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/chatbots/plantillas">
              <Plus size={16} /> Nuevo chatbot
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
          <Bot size={22} />
        </span>
        <p className="text-sm font-semibold text-text-primary">Todavía no tienes chatbots activos</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Crea tu primer bot a partir de una plantilla para empezar a automatizar tus conversaciones.
        </p>
        <Button className="mt-4 rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
          <Link href="/home/chatbots/plantillas">
            <Plus size={16} /> Nuevo chatbot
          </Link>
        </Button>
      </div>
    </div>
  );
}