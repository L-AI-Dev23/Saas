import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { cuentasConectadas } from "@/lib/mock-data";
import { InstagramLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";
import { Music2 } from "lucide-react";

const iconos: Record<string, typeof InstagramLogo> = {
  Instagram: InstagramLogo,
  Messenger: FacebookLogo,
  TikTok: Music2 as unknown as typeof InstagramLogo,
};

export default function CuentasPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Cuentas conectadas"
        description="Conecta tus redes para que Chatbots e Inbox puedan operar sobre ellas."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {cuentasConectadas.map((c) => {
          const Icon = iconos[c.plataforma];
          return (
            <div key={c.plataforma} className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-6 text-center shadow-sg-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-primary">
                <Icon size={22} weight="fill" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{c.plataforma}</p>
                <p className="text-xs text-text-secondary">{c.nombre ?? "Sin conectar"}</p>
              </div>
              <StatusBadge label={c.estado} />
              <button className="mt-1 w-full rounded-lg border border-border py-2 text-xs font-semibold text-text-primary hover:bg-surface">
                {c.estado === "Conectada" ? "Reconectar" : "Conectar"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-text-muted">
        Conectar Instagram/Messenger requiere aprobación de Meta (App Review) para permisos de mensajería en producción.
      </p>
    </div>
  );
}
