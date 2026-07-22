import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { chatbotsKpis, chatbotsActivos } from "@/lib/mock-data";

export default function ChatbotsDashboardPage() {
  const necesitanAtencion = chatbotsActivos.filter((b) => b.estado === "Necesita atención");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Chatbots" description="Automatizaciones conversacionales dentro de tus redes sociales." />
      <KpiRow items={chatbotsKpis} />

      {necesitanAtencion.length > 0 && (
        <div className="mt-8 flex items-center gap-3 rounded-lg border border-error/30 bg-error/5 p-4">
          <AlertTriangle size={18} className="shrink-0 text-error" />
          <p className="text-sm text-text-primary">
            <span className="font-semibold">{necesitanAtencion[0].nombre}</span> necesita atención — el
            post/video vinculado ya no está disponible.{" "}
            <a href="/home/chatbots/activos" className="font-semibold text-error underline">
              Revisar
            </a>
          </p>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Mensajes — últimos 30 días</h2>
        <div className="flex h-36 items-end gap-2">
          {[30, 45, 38, 60, 52, 70, 65, 80, 58, 75, 90, 68].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-accent/70" style={{ height: `${v * 1.6}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
