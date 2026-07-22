"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function LoginPopover({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-xl border-border p-5 shadow-[var(--shadow-sg-md)]">
        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="email@example.com" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input id="login-password" type="password" placeholder="Contraseña" autoComplete="current-password" />
          </div>

          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-accent" />
            Recordarme
          </label>

          <Button type="submit" className="h-11 w-full bg-accent font-semibold text-white hover:bg-accent-hover">
            Ingreso
          </Button>
        </form>

        <div className="my-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-text-muted">o</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-2">
          <Button className="h-10 justify-center gap-2 bg-[#1877F2] text-sm font-semibold text-white hover:bg-[#1877F2]/90">
            <span aria-hidden>f</span> Iniciar sesión con Facebook
          </Button>
          <Button variant="outline" className="h-10 justify-center gap-2 border-border text-sm font-semibold">
            <span aria-hidden>G</span> Iniciar sesión con Google
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
