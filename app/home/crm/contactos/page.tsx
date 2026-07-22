"use client";

import { useState } from "react";
import { Plus, Table2, Kanban, X } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { contactos } from "@/lib/mock-data";
import { Tabs, TabList } from "@/components/application/tabs/tabs";
import { TextArea } from "@/components/base/textarea/textarea";
import { cn } from "@/lib/utils";

const etapas = [
  { key: "nuevo", label: "Nuevo" },
  { key: "en_conversacion", label: "En conversación" },
  { key: "cliente", label: "Cliente" },
  { key: "inactivo", label: "Inactivo" },
];

export default function ContactosPage() {
  const [view, setView] = useState<"tabla" | "kanban">("tabla");
  const [selected, setSelected] = useState<(typeof contactos)[number] | null>(null);
  const [etapaLabel, setEtapaLabel] = useState("");

  function abrirContacto(c: (typeof contactos)[number]) {
    setSelected(c);
    setEtapaLabel(etapas.find((e) => e.key === c.etapa)?.label ?? "");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Contactos"
        description="Todos tus leads y clientes, sin importar de qué módulo llegaron."
        action={
          <div className="flex items-center gap-2">
            <Tabs selectedKey={view} onSelectionChange={(key) => setView(key as "tabla" | "kanban")}>
              <TabList
                type="button-border"
                size="sm"
                items={[
                  { id: "tabla", label: "Tabla", icon: Table2 },
                  { id: "kanban", label: "Kanban", icon: Kanban },
                ]}
              />
            </Tabs>
            <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
              <Plus size={16} /> Nuevo contacto
            </Button>
          </div>
        }
      />

      {view === "tabla" ? (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Email / Teléfono</th>
                <th className="px-5 py-3">Origen</th>
                <th className="px-5 py-3">Etapa</th>
                <th className="px-5 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contactos.map((c) => (
                <tr key={c.id} onClick={() => abrirContacto(c)} className="cursor-pointer hover:bg-surface">
                  <td className="px-5 py-3 font-medium text-text-primary">{c.nombre}</td>
                  <td className="px-5 py-3 text-text-secondary">
                    {c.email}
                    <br />
                    <span className="text-xs">{c.telefono}</span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge label={c.origen} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge label={etapas.find((e) => e.key === c.etapa)?.label ?? c.etapa} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map((etapa) => (
            <div key={etapa.key} className="rounded-lg bg-surface p-3">
              <p className="mb-3 px-1 text-xs font-semibold uppercase text-text-muted">
                {etapa.label} · {contactos.filter((c) => c.etapa === etapa.key).length}
              </p>
              <div className="flex flex-col gap-2">
                {contactos
                  .filter((c) => c.etapa === etapa.key)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => abrirContacto(c)}
                      className="rounded-lg border border-border bg-white p-3 text-left shadow-sg-sm hover:shadow-sg-md"
                    >
                      <p className="text-sm font-semibold text-text-primary">{c.nombre}</p>
                      <p className="mt-1 text-xs text-text-secondary">Origen: {c.origen}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <span key={t} className="rounded-full bg-surface px-2 py-0.5 text-xs text-text-secondary">
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer de detalle */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={() => setSelected(null)}>
          <div
            className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-sg-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">{selected.nombre}</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Email</p>
                <p className="text-text-primary">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Teléfono</p>
                <p className="text-text-primary">{selected.telefono}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Etapa</p>
                <div className="mt-1">
                  <SelectDropdown
                    options={etapas.map((e) => e.label)}
                    value={etapaLabel}
                    onChange={setEtapaLabel}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-text-muted">Etiquetas</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selected.tags.map((t) => (
                    <StatusBadge key={t} label={t} />
                  ))}
                  <button className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-text-muted">
                    + Agregar
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Timeline de interacciones</p>
                <ul className="flex flex-col gap-2 text-xs text-text-secondary">
                  <li>· Contactado por Instagram — hace 3 días</li>
                  <li>· Nota agregada por Fabiana Q. — hace 2 días</li>
                  <li>· Pasó a etapa &quot;{etapas.find((e) => e.key === selected.etapa)?.label}&quot; — hace 1 día</li>
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Nota rápida</p>
                <TextArea rows={3} placeholder="Escribe una nota…" aria-label="Nota rápida" />
                <Button className="mt-2 h-8 bg-cta text-xs text-white hover:bg-cta-hover">Guardar nota</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
