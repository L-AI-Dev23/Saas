"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toggle } from "@/components/base/toggle/toggle";
import { useNotificacionesConfig, toggleNotificacion } from "@/lib/notificaciones-store";

export default function NotificacionesPage() {
  const config = useNotificacionesConfig();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Notificaciones" description="Qué eventos te avisan, y por qué canal." />

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
            <tr>
              <th className="px-5 py-3">Evento</th>
              <th className="px-5 py-3 text-center">In-app</th>
              <th className="px-5 py-3 text-center">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {config.map((n) => (
              <tr key={n.evento}>
                <td className="px-5 py-3 font-medium text-text-primary">{n.evento}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Toggle
                      isSelected={n.inapp}
                      onChange={() => toggleNotificacion(n.evento, "inapp")}
                      aria-label={`${n.evento} in-app`}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Toggle
                      isSelected={n.email}
                      onChange={() => toggleNotificacion(n.evento, "email")}
                      aria-label={`${n.evento} email`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-text-muted">Los cambios se guardan automáticamente.</p>
    </div>
  );
}
