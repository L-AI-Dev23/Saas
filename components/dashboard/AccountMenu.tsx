"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, CreditCard, HelpCircle, LogOut, User, Users } from "lucide-react";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { planActual, usuarioActual } from "@/lib/mock-data";
import { useSidebar, SidebarMenuButton } from "@/components/animate-ui/components/radix/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/animate-ui/components/radix/dropdown-menu";

export function AccountMenu() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <AvatarLabelGroup size="sm" initials={usuarioActual.iniciales} title={usuarioActual.nombre} subtitle={usuarioActual.negocio} />
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "top"}
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex flex-col gap-0.5 px-1 py-1.5">
            <p className="text-sm font-semibold text-text-fg-uui-primary">Plan {planActual.nombre}</p>
            <p className="text-xs text-text-fg-uui-secondary">{planActual.renueva}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/home/configuracion/perfil")}>
            <User />
            Ver perfil
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/home/configuracion/equipo")}>
            <Users />
            Equipo
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/home/configuracion/facturacion")}>
            <CreditCard />
            Facturación
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onSelect={() => router.push("/home/configuracion")}>
          <HelpCircle />
          Ayuda y soporte
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="cursor-pointer">
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
