"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, LogOut, Moon, Sun } from "lucide-react";
import { actividadReciente } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/animate-ui/components/radix/dropdown-menu";

const actionButtonClass =
  "flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary outline-hidden transition-colors hover:bg-dashboard-bg hover:text-text-primary focus-visible:bg-dashboard-bg focus-visible:text-text-primary";

export function TopbarActions() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Evita mismatch de hidratación: el icono de tema depende de localStorage,
  // que no existe en el render del servidor.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const notificaciones = actividadReciente.slice(0, 4);

  return (
    <div className="flex items-center gap-1">
      {/* Notificaciones */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={actionButtonClass} aria-label="Notificaciones">
            <Bell size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-80">
          <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-text-primary">
            Notificaciones
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notificaciones.map((item, i) => (
            <DropdownMenuItem key={i} className="flex-col items-start gap-0.5 py-2">
              <p className="text-sm text-text-primary">{item.texto}</p>
              <p className="text-xs text-text-muted">
                {item.modulo} · {item.tiempo}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modo oscuro */}
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={actionButtonClass}
        aria-label="Cambiar tema"
      >
        {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className={actionButtonClass}
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}
