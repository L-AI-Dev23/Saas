import { Card } from "@/components/ui/card";

const tools = [
  {
    title: "15,000 correos electrónicos al mes",
    descr: "incluidas campañas de marketing y transaccionales",
  },
  {
    title: "3 chatbots",
    descr: "con respuestas automáticas y plantillas de flujos prediseñadas",
  },
  {
    title: "Completo sistema CRM",
    descr: "integrado con otras herramientas de la plataforma",
  },
  {
    title: "1 website con generador de sitios web",
    descr: "para promocionar los productos y servicios de tu marca",
  },
  {
    title: "10 pop-ups y un chat online",
    descr: "para mejorar la interacción y la captación de clientes potenciales",
  },
  {
    title: "Formularios de suscripción",
    descr: "con condiciones de visualización personalizadas",
  },
  {
    title: "Campañas web push",
    descr: "notificaciones directas al navegador de hasta 10,000 suscriptores",
  },
  {
    title: "Automatización del proceso de ventas",
    descr: "para automatizar la gestión de contactos",
  },
];

export function FreeTools() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            Herramientas gratuitas de marketing multicanal
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Empieza con nuestro plan gratuito para personalizar todas las herramientas según tus
            necesidades, probar estrategias y ver tus primeros resultados
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className="flex flex-col gap-3 rounded-2xl border-border bg-white p-6 text-center shadow-[var(--shadow-sg-sm)] transition-transform hover:-translate-y-1"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <span className="h-6 w-6 rounded bg-accent" />
              </div>
              <h3 className="text-base font-bold text-text-primary">{tool.title}</h3>
              <p className="text-sm text-text-secondary">{tool.descr}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
