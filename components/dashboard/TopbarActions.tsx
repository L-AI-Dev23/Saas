"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { actividadReciente } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { IconButton } from "@/components/animate-ui/components/buttons/icon";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";

export function TopbarActions() {
  const router = useRouter();

  const notificaciones = actividadReciente.slice(0, 4);

  return (
    <div className="flex items-center gap-1">
      {/* Notificaciones */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton variant="ghost" aria-label="Notificaciones">
            <Bell />
          </IconButton>
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
      <ThemeTogglerButton variant="ghost" aria-label="Cambiar tema" />

      {/* Cerrar sesión */}
      <IconButton
        variant="ghost"
        onClick={() => router.push("/")}
        aria-label="Cerrar sesión"
      >
        <LogOut />
      </IconButton>
    </div>
  );
}