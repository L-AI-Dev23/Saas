import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { chatbotsActivos } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ChatbotsActivosPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Chatbots activos"
        description="Todos los bots en operación en tus cuentas conectadas."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <a href="/home/chatbots/plantillas">
              <Plus size={16} /> Nuevo chatbot
            </a>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Red social</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Mensajes (mes)</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {chatbotsActivos.map((b) => (
              <tr
                key={b.id}
                className={cn("hover:bg-surface", b.estado === "Necesita atención" && "bg-warning/5")}
              >
                <td className="px-5 py-3 font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    {b.estado === "Necesita atención" && (
                      <AlertTriangle size={14} className="shrink-0 text-error" />
                    )}
                    {b.nombre}
                  </div>
                </td>
                <td className="px-5 py-3 text-text-secondary">{b.tipo}</td>
                <td className="px-5 py-3 text-text-secondary">{b.red}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={b.estado} />
                </td>
                <td className="px-5 py-3 text-text-secondary">{b.mensajes.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <button className="text-xs font-semibold text-cta hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
