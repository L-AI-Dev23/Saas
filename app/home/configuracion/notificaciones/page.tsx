"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toggle } from "@/components/base/toggle/toggle";
import { notificacionesConfig } from "@/lib/mock-data";

export default function NotificacionesPage() {
  const [config, setConfig] = useState(notificacionesConfig);

  const toggle = (evento: string, canal: "inapp" | "email") => {
    setConfig((prev) => prev.map((n) => (n.evento === evento ? { ...n, [canal]: !n[canal] } : n)));
  };

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
                    <Toggle isSelected={n.inapp} onChange={() => toggle(n.evento, "inapp")} aria-label={`${n.evento} in-app`} />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <Toggle isSelected={n.email} onChange={() => toggle(n.evento, "email")} aria-label={`${n.evento} email`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button className="mt-6 bg-cta text-white hover:bg-cta-hover">Guardar cambios</Button>
    </div>
  );
}
