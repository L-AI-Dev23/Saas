import { Button } from "@/components/ui/button";
import { RegisterDialog } from "@/components/sections/RegisterDialog";

const items = [
  "15,000 correos electrónicos gratuitos",
  "3 chatbots gratuitos",
  "Creador de landing pages gratuito",
  "Sistema CRM",
  "No se necesita tarjeta de crédito",
];

export function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-accent to-accent-hover py-20 text-center text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Gestiona eficazmente todos tus canales de comunicación y procesos de ventas
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Maximiza la interacción de tus clientes y su fidelización con nuestra práctica
          plataforma de marketing automatizado
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <RegisterDialog>
            <Button className="h-14 min-w-[190px] rounded-lg bg-white px-7 text-lg font-semibold text-accent hover:bg-white/90">
              Pruébalo gratis
            </Button>
          </RegisterDialog>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
