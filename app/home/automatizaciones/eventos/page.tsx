import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { eventTypes } from "@/lib/mock-data";

export default function EventosPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Eventos del sistema"
        description="Catálogo de eventos que pueden disparar Automatizaciones, Chatbots y CRM. Es informativo, no editable."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-5 py-3">Evento</th>
              <th className="px-5 py-3">Descripción</th>
              <th className="px-5 py-3">Módulos que lo usan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {eventTypes.map((e) => (
              <tr key={e.key}>
                <td className="px-5 py-3 font-medium text-text-primary">{e.label}</td>
                <td className="px-5 py-3 text-text-secondary">{e.desc}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {e.modulos.map((m) => (
                      <StatusBadge key={m} label={m} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
