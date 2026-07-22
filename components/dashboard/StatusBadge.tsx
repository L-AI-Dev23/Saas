import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  activo: "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  aprobado: "bg-success/10 text-success border-success/20",
  conectada: "bg-success/10 text-success border-success/20",
  cliente: "bg-success/10 text-success border-success/20",
  enviada: "bg-success/10 text-success border-success/20",
  pausado: "bg-warning/10 text-warning border-warning/20",
  pausada: "bg-warning/10 text-warning border-warning/20",
  programada: "bg-link/10 text-link border-link/20",
  nuevo: "bg-link/10 text-link border-link/20",
  en_conversacion: "bg-warning/10 text-warning border-warning/20",
  invitado: "bg-link/10 text-link border-link/20",
  borrador: "bg-text-muted/10 text-text-secondary border-border",
  inactivo: "bg-text-muted/10 text-text-secondary border-border",
  no_conectada: "bg-text-muted/10 text-text-secondary border-border",
  necesita_atencion: "bg-error/10 text-error border-error/20",
  esperando_humano: "bg-error/10 text-error border-error/20",
  bot_activo: "bg-link/10 text-link border-link/20",
  atendido_humano: "bg-success/10 text-success border-success/20",
  cerrado: "bg-text-muted/10 text-text-secondary border-border",
};

function normalize(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

export function StatusBadge({ label }: { label: string }) {
  const key = normalize(label);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[key] ?? "border-border bg-surface text-text-secondary"
      )}
    >
      {label}
    </span>
  );
}
