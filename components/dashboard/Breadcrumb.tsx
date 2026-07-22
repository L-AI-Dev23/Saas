"use client";

import { usePathname } from "next/navigation";
import { topbarModules, sidebarByModule, getActiveModuleHref } from "@/lib/nav-config";

export function Breadcrumb() {
  const pathname = usePathname();
  const activeModuleHref = getActiveModuleHref(pathname);
  const activeModule = topbarModules.find((m) => m.href === activeModuleHref);
  const subItem = (sidebarByModule[activeModuleHref] ?? []).find((i) => i.href === pathname);

  // Si el submenú activo tiene el mismo label que el módulo (ej. "Dashboard" dentro de "Email"),
  // no lo repetimos dos veces.
  const showSubItem = subItem && subItem.href !== activeModuleHref;

  return (
    <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
        <span className={showSubItem ? "" : "font-medium text-text-primary"}>
          {activeModule?.label}
        </span>
        {showSubItem && (
          <>
            <span className="text-text-muted">/</span>
            <span className="font-medium text-text-primary">{subItem.label}</span>
          </>
        )}
      </div>
    </div>
  );
}

