"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { topbarModules, getActiveModuleHref } from "@/lib/nav-config";
import { IconButton } from "@/components/animate-ui/components/buttons/icon";

export function DashboardTopbar() {
  const pathname = usePathname();
  const activeModule = getActiveModuleHref(pathname);

  return (
    <header className="sticky top-0 z-40 w-full bg-dashboard-topbar">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/home" className="mr-6 flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cta text-white font-bold">
            •
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {topbarModules.map((mod) => {
            const active = mod.href === activeModule;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={cn(
                  "rounded-full px-4 py-2 text-base font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {mod.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="#"
            className="hidden items-center gap-2 text-sm font-semibold text-white/80 hover:text-white md:flex"
          >
            <MessageCircle size={16} />
            Soporte en vivo
          </a>
          <IconButton
            variant="ghost"
            aria-label="Notificaciones"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Bell size={18} />
          </IconButton>
          <div className="h-8 w-8 shrink-0 rounded-full bg-white/20" />
        </div>
      </div>
    </header>
  );
}
