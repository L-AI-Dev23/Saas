"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { topbarModules, sidebarByModule, getActiveModuleHref } from "@/lib/nav-config";
import { AccountMenu } from "@/components/dashboard/AccountMenu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/animate-ui/components/radix/sidebar";

// Agrupación de módulos para el nuevo sidebar (Animate UI).
// La key es el label del grupo, y el value la lista de hrefs de topbarModules que van dentro.
const sidebarGroups: { label: string; hrefs: string[] }[] = [
  { label: "General", hrefs: ["/home", "/home/inbox"] },
  { label: "Proyectos", hrefs: ["/home/email", "/home/automatizaciones", "/home/chatbots"] },
  { label: "Gestión", hrefs: ["/home/crm", "/home/catalogo", "/home/configuracion"] },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const activeModule = getActiveModuleHref(pathname);

  // Acordeón manual: el usuario abre/cierra lo que quiera, sin relación con la URL.
  // Al cargar, el módulo donde estás parado arranca abierto para no perderte.
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [activeModule]: true,
  });

  function toggleModule(href: string) {
    setOpenModules((prev) => ({ ...prev, [href]: !prev[href] }));
  }

  return (
    <Sidebar collapsible="icon">
      {/* Header: logo + utilidades */}
      <SidebarHeader className="flex-row items-center justify-between border-b border-sidebar-border px-2 py-3">
        <Link href="/home" className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cta text-white font-bold">
            •
          </span>
          <span className="truncate text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Codew SaaS
          </span>
        </Link>
        <button className="shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          <Bell size={16} />
        </button>
      </SidebarHeader>

      {/* Árbol de navegación agrupado: General / Proyectos / Gestión */}
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.hrefs.map((href) => {
                  const mod = topbarModules.find((m) => m.href === href);
                  if (!mod) return null;

                  const items = sidebarByModule[mod.href] ?? [];
                  const isOpen = !!openModules[mod.href];
                  const isModuleActive = mod.href === activeModule;
                  const hasSubItems = items.length > 1; // los módulos de 1 solo ítem no necesitan acordeón

                  return (
                    <SidebarMenuItem key={mod.href}>
                      {hasSubItems ? (
                        <SidebarMenuButton
                          onClick={() => toggleModule(mod.href)}
                          isActive={isModuleActive}
                        >
                          <mod.icon />
                          <span>{mod.label}</span>
                          <ChevronDown
                            className={cn(
                              "ml-auto size-4 shrink-0 transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={pathname === mod.href}>
                          <Link href={mod.href}>
                            <mod.icon />
                            <span>{mod.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}

                      {hasSubItems && isOpen && (
                        <SidebarMenuSub>
                          {items.map((item) => {
                            const active = pathname === item.href;
                            return (
                              <SidebarMenuSubItem key={item.href}>
                                <SidebarMenuSubButton asChild isActive={active}>
                                  <Link href={item.href}>
                                    <span>{item.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer: cuenta (siempre fijo abajo, no se mueve con el acordeón) */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <AccountMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
