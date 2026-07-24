"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .concat("-", Math.random().toString(36).slice(2, 6));
}

export function RegisterDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();

    // 1. Crear el usuario en Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Si tu proyecto tiene confirmación de email activada, aquí no hay
    // sesión todavía y create_business fallará (auth.uid() es null).
    // Para desarrollo, desactiva "Confirm email" en Supabase Auth > Providers,
    // o mueve este paso a la primera vez que el usuario entra ya confirmado.
    if (!signUpData.session) {
      setError("Revisa tu correo para confirmar tu cuenta antes de continuar.");
      setLoading(false);
      return;
    }

    // 2. Crear el negocio + suscripción trial en una sola transacción
    const { error: businessError } = await supabase.rpc("create_business", {
      business_name: `Negocio de ${name}`,
      business_slug: slugify(name),
      plan_slug: "basica",
    });

    if (businessError) {
      setError(businessError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    router.push("/home");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-text-primary">
            Comienza a usar la plataforma
          </DialogTitle>
          <DialogDescription>
            Crea una cuenta gratuita. No necesitas tarjeta de crédito.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-name">Nombre</Label>
            <Input id="reg-name" name="name" placeholder="Oliver Johnson" autoComplete="name" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-phone">Teléfono</Label>
            <Input id="reg-phone" name="phone" type="tel" placeholder="912 345 678" autoComplete="tel" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-password">Contraseña</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              placeholder="de al menos 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-accent font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="text-center text-xs text-text-muted">
          Al crear una cuenta, aceptas nuestros{" "}
          <a href="#" className="text-link hover:underline">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="text-link hover:underline">
            Política de Privacidad
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
