"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Table2, Kanban, Search, MoreHorizontal, Pencil, Trash2, Users, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { ContactConfigModal, origenesContacto } from "@/components/dashboard/ContactConfigModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { useTags } from "@/lib/tags-store";
import { useEtapasCrm } from "@/lib/crm-config-store";
import {
  useContactos,
  addContacto,
  updateContacto,
  deleteContacto,
  addTagToContacto,
  removeTagFromContacto,
  type Contacto,
} from "@/lib/contacts-store";
import { Tabs, TabList } from "@/components/application/tabs/tabs";
import { TextArea } from "@/components/base/textarea/textarea";

const origenesFiltro = ["Todos los orígenes", ...origenesContacto];

export default function ContactosPage() {
  return (
    <Suspense fallback={null}>
      <ContactosPageContent />
    </Suspense>
  );
}

function ContactosPageContent() {
  const contactos = useContactos();
  const etapas = useEtapasCrm();
  const etapasFiltro = useMemo(() => ["Todas las etapas", ...etapas.map((e) => e.label)], [etapas]);
  const [view, setView] = useState<"tabla" | "kanban">("tabla");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tagFiltro = searchParams.get("tag");

  const [busqueda, setBusqueda] = useState("");
  const [filtroOrigen, setFiltroOrigen] = useState(origenesFiltro[0]);
  const [filtroEtapa, setFiltroEtapa] = useState(etapasFiltro[0]);

  const selected = contactos.find((c) => c.id === selectedId) ?? null;

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return contactos.filter((c) => {
      const coincideBusqueda =
        !q || c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const coincideOrigen = filtroOrigen === origenesFiltro[0] || c.origen === filtroOrigen;
      const coincideEtapa =
        filtroEtapa === etapasFiltro[0] || etapas.find((e) => e.key === c.etapa)?.label === filtroEtapa;
      const coincideTag = !tagFiltro || c.tags.includes(tagFiltro);
      return coincideBusqueda && coincideOrigen && coincideEtapa && coincideTag;
    });
  }, [contactos, busqueda, filtroOrigen, filtroEtapa, etapas, etapasFiltro, tagFiltro]);

  function limpiarFiltroTag() {
    router.push("/home/crm/contactos");
  }

  function eliminar(id: number) {
    deleteContacto(id);
    if (selectedId === id) setSelectedId(null);
  }

  if (selected) {
    return (
      <ContactoDetalle
        contacto={selected}
        onVolver={() => setSelectedId(null)}
        onEliminar={() => eliminar(selected.id)}
      />
    );
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
            <ContactConfigModal
              trigger={
                <Button className="rounded-lg bg-cta text-white hover:bg-cta-hover">
                  <Plus size={16} /> Nuevo contacto
                </Button>
              }
              onSave={addContacto}
            />
          </div>
        }
      />

      {contactos.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Buscar por nombre o email…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <SelectDropdown options={origenesFiltro} value={filtroOrigen} onChange={setFiltroOrigen} className="w-44" />
            <SelectDropdown options={etapasFiltro} value={filtroEtapa} onChange={setFiltroEtapa} className="w-48" />
          </div>
          {tagFiltro && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary">
              Etiqueta: {tagFiltro}
              <button
                onClick={limpiarFiltroTag}
                aria-label="Quitar filtro de etiqueta"
                className="text-text-muted hover:text-error"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {view === "tabla" ? (
        contactos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
            <p className="text-sm font-semibold text-text-primary">Todavía no tienes contactos</p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              Crea uno manualmente o espera a que lleguen desde tus chatbots, formularios o campañas.
            </p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-muted">
              <Users size={22} />
            </span>
            <p className="text-sm font-semibold text-text-primary">Ningún contacto coincide con tu búsqueda</p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              Prueba con otro término o ajusta los filtros de origen y etapa.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs font-semibold uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Email / Teléfono</th>
                  <th className="px-5 py-3">Origen</th>
                  <th className="px-5 py-3">Etapa</th>
                  <th className="px-5 py-3">Tags</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtrados.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedId(c.id)} className="cursor-pointer hover:bg-surface">
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
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="rounded-md p-1.5 text-text-muted hover:bg-surface hover:text-text-primary"
                            aria-label={`Más acciones para ${c.nombre}`}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-40">
                          <DropdownMenuItem className="cursor-pointer" onSelect={() => setSelectedId(c.id)}>
                            <Pencil size={14} /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onSelect={() => eliminar(c.id)}
                          >
                            <Trash2 size={14} /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {etapas.map((etapa) => (
            <div key={etapa.key} className="rounded-lg bg-surface p-3">
              <p className="mb-3 px-1 text-xs font-semibold uppercase text-text-muted">
                {etapa.label} · {filtrados.filter((c) => c.etapa === etapa.key).length}
              </p>
              <div className="flex flex-col gap-2">
                {filtrados
                  .filter((c) => c.etapa === etapa.key)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
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
    </div>
  );
}

function ContactoDetalle({
  contacto,
  onVolver,
  onEliminar,
}: {
  contacto: Contacto;
  onVolver: () => void;
  onEliminar: () => void;
}) {
  const etapas = useEtapasCrm();
  const tags = useTags();
  const [formNombre, setFormNombre] = useState(contacto.nombre);
  const [formEmail, setFormEmail] = useState(contacto.email);
  const [formTelefono, setFormTelefono] = useState(contacto.telefono);
  const [formEtapaLabel, setFormEtapaLabel] = useState(
    etapas.find((e) => e.key === contacto.etapa)?.label ?? ""
  );

  const etiquetasDisponibles = tags.map((t) => t.nombre).filter((n) => !contacto.tags.includes(n));

  function guardarCambios() {
    const etapa = etapas.find((e) => e.label === formEtapaLabel)?.key ?? contacto.etapa;
    updateContacto(contacto.id, {
      nombre: formNombre.trim() || contacto.nombre,
      email: formEmail.trim(),
      telefono: formTelefono.trim(),
      etapa,
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={onVolver}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} /> Volver a Contactos
      </button>

      <PageHeader title={contacto.nombre} description="Detalle del contacto." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-5 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase text-text-muted">Nombre</p>
              <Input value={formNombre} onChange={(e) => setFormNombre(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase text-text-muted">Etapa</p>
              <SelectDropdown options={etapas.map((e) => e.label)} value={formEtapaLabel} onChange={setFormEtapaLabel} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase text-text-muted">Email</p>
              <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase text-text-muted">Teléfono</p>
              <Input value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} />
            </div>
          </div>
          <div>
            <Button className="bg-cta text-white hover:bg-cta-hover" onClick={guardarCambios}>
              Guardar cambios
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Etiquetas</p>
            <div className="flex flex-wrap gap-1.5">
              {contacto.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary"
                >
                  {t}
                  <button
                    onClick={() => removeTagFromContacto(contacto.id, t)}
                    aria-label={`Quitar etiqueta ${t}`}
                    className="text-text-muted hover:text-error"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-text-muted hover:border-cta hover:text-cta">
                    + Agregar
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {etiquetasDisponibles.length === 0 ? (
                    <DropdownMenuItem disabled>No hay más etiquetas</DropdownMenuItem>
                  ) : (
                    etiquetasDisponibles.map((t) => (
                      <DropdownMenuItem
                        key={t}
                        className="cursor-pointer"
                        onSelect={() => addTagToContacto(contacto.id, t)}
                      >
                        {t}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Nota rápida</p>
            <TextArea rows={3} placeholder="Escribe una nota…" aria-label="Nota rápida" />
            <Button className="mt-2 h-8 bg-cta text-xs text-white hover:bg-cta-hover">Guardar nota</Button>
          </div>

          <div className="border-t border-border pt-4">
            <button
              onClick={onEliminar}
              className="flex items-center gap-1.5 text-xs font-semibold text-error hover:underline"
            >
              <Trash2 size={13} /> Eliminar contacto
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase text-text-muted">Origen</p>
          <StatusBadge label={contacto.origen} />

          <p className="mb-2 mt-5 text-xs font-semibold uppercase text-text-muted">Timeline de interacciones</p>
          <ul className="flex flex-col gap-2 text-xs text-text-secondary">
            <li>· Contactado por Instagram — hace 3 días</li>
            <li>· Nota agregada por Fabiana Q. — hace 2 días</li>
            <li>
              · Pasó a etapa &quot;{etapas.find((e) => e.key === contacto.etapa)?.label}&quot; — hace 1 día
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
