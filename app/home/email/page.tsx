"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { useEmailCampanas } from "@/lib/email-campanas-store";
import { useEmailListas } from "@/lib/email-listas-store";
import { useEmailPlantillas } from "@/lib/email-plantillas-store";

export default function EmailDashboardPage() {
  const campanas = useEmailCampanas();
  const listas = useEmailListas();
  const plantillas = useEmailPlantillas();

  const totalContactosSuscritos = listas.reduce((sum, l) => sum + l.contactos, 0);
  const campanasSent = campanas.filter((c) => c.estado === "Enviada");

  const kpis = [
    { label: "Enviados (total)", value: campanasSent.length > 0 ? campanasSent.length.toString() : "0", href: "#" },
    { label: "Listas de correo", value: listas.length.toString(), href: "/home/email/listas" },
    { label: "Contactos suscritos", value: totalContactosSuscritos.toLocaleString(), href: "/home/email/listas" },
    { label: "Plantillas", value: plantillas.length.toString(), href: "/home/email/plantillas" },
  ];

  const recientes = campanas.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Email"
        description="Métricas generales de tu panel de Email marketing."
        action={
          <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover" asChild>
            <Link href="/home/email/campanas">
              <Plus size={16} /> Nueva campaña
            </Link>
          </Button>
        }
      />

      <KpiRow items={kpis} />

      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Campañas recientes</h2>
        {recientes.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="text-center text-sm text-text-muted">Todavía no enviaste ninguna campaña.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Lista</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recientes.map((c) => (
                  <tr key={c.id} className="hover:bg-surface">
                    <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                    <td className="px-5 py-3 text-text-secondary">{c.lista}</td>
                    <td className="px-5 py-3">
                      <StatusBadge label={c.estado} />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{c.fecha}</td>
                    <td className="px-5 py-3 text-right">
                      {c.estado === "Enviada" && (
                        <Link href={`/home/email/campanas/${c.id}`} className="text-xs font-semibold text-cta hover:underline">
                          Ver reporte
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
