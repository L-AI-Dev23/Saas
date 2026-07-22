"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  appName?: string;
  logoClassName?: string;
}

function Sidebar({ items, appName = "Mi App", logoClassName }: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "h-screen border-r border-border bg-sidebar flex flex-col transition-all duration-200 ease-in-out overflow-hidden",
        hovered ? "w-52" : "w-14"
      )}
    >
      <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
        <div className={cn("w-6 h-6 rounded-md bg-primary shrink-0", logoClassName)} />
        {hovered && (
          <span className="ml-3 text-sm font-semibold text-sidebar-foreground whitespace-nowrap">
            {appName}
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {items.map((item, i) => {
          const activo = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
                hovered ? "" : "justify-center",
                activo
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {hovered && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { Sidebar };
