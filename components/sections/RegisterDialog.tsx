"use client";

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

export function RegisterDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
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

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="h-11 justify-center gap-2 border-border font-semibold"
          >
            <span aria-hidden>G</span> Regístrate con Google
          </Button>
          <Button className="h-11 justify-center gap-2 bg-[#1877F2] font-semibold text-white hover:bg-[#1877F2]/90">
            <span aria-hidden>f</span> Regístrate con Facebook
          </Button>
        </div>

        <div className="my-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-text-muted">o</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-name">Nombre</Label>
            <Input id="reg-name" placeholder="Oliver Johnson" autoComplete="name" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-email">Email</Label>
            <Input id="reg-email" type="email" placeholder="email@example.com" autoComplete="email" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-phone">Teléfono</Label>
            <Input id="reg-phone" type="tel" placeholder="912 345 678" autoComplete="tel" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reg-password">Contraseña</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="de al menos 8 caracteres"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full bg-accent font-semibold text-white hover:bg-accent-hover"
          >
            Registrarse
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