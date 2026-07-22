import { Button } from "@/components/ui/button";
import { RegisterDialog } from "@/components/sections/RegisterDialog";

const features = [
  "15,000 correos electrónicos gratuitos",
  "3 chatbots gratuitos",
  "Creador de landing pages gratuito",
  "Sistema CRM",
  "No se necesita tarjeta de crédito",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        {/* Texto */}
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl">
            Impulsa tu marketing digital con un conjunto de herramientas esenciales
          </h1>
          <p className="mt-6 text-lg text-text-secondary">
            Consigue nuevos clientes potenciales, interacción de tu audiencia y la fidelización de
            clientes, todo desde una única plataforma y sin costo
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <RegisterDialog>
              <Button className="h-14 min-w-[190px] rounded-lg bg-accent px-7 text-lg font-semibold text-white hover:bg-accent-hover">
                Regístrate gratis
              </Button>
            </RegisterDialog>
            <Button
              variant="outline"
              className="h-14 min-w-[190px] rounded-lg border-border bg-white px-7 text-lg font-semibold text-text-primary shadow-[var(--shadow-sg-sm)] hover:bg-surface"
            >
              Iniciar sesión con Google
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Imagen / esquema visual */}
        <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center rounded-3xl border border-border bg-surface sm:h-[480px]">
          <div className="grid grid-cols-2 gap-4 p-8">
            {["Email marketing", "CRM", "Automatización", "Chatbots", "Landing pages", "Web push"].map(
              (label) => (
                <div
                  key={label}
                  className="flex h-24 w-32 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-3 text-center shadow-[var(--shadow-sg-sm)]"
                >
                  <span className="h-6 w-6 rounded-md bg-accent/15" />
                  <span className="text-xs font-semibold text-text-primary">{label}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
