import { Button } from "@/components/ui/button";
import { RegisterDialog } from "@/components/sections/RegisterDialog";

export function UpgradeBanner() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-10 text-center shadow-[var(--shadow-sg-md)] lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              Mejora tu plan de suscripción a medida que crece tu negocio
            </h3>
            <p className="mt-3 max-w-xl text-text-secondary">
              Comienza a utilizar las herramientas de forma gratuita sin límite de tiempo y
              actualízate a un plan de pago con funciones adicionales cuando lo necesites.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RegisterDialog>
              <Button className="h-14 min-w-[190px] rounded-lg bg-accent px-7 text-lg font-semibold text-white hover:bg-accent-hover">
                Pruébalo
              </Button>
            </RegisterDialog>
            <span className="text-xs text-text-muted">No necesitas tarjeta de crédito</span>
          </div>
        </div>
      </div>
    </section>
  );
}
