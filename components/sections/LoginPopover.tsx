"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";

export function LoginPopover({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    router.push("/home");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-xl border-border p-5 shadow-[var(--shadow-sg-md)]">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" name="email" type="email" placeholder="email@example.com" autoComplete="email" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-accent" />
            Recordarme
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-accent font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingreso"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
