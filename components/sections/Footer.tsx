const columns = [
  {
    title: "Correos masivos",
    links: ["Correos masivos", "Servicio SMTP", "Editor de correos", "Automatización de marketing"],
  },
  {
    title: "Chatbots",
    links: ["Chatbot builder", "Chatbot para Instagram", "Chatbot para WhatsApp", "Chatbot para Telegram"],
  },
  {
    title: "Servicios",
    links: ["Crea cursos online", "CRM", "Landing Pages", "SMS masivos"],
  },
  {
    title: "Recursos",
    links: ["Base de conocimientos", "Blog", "Integraciones", "API"],
  },
];

export function Footer() {
  return (
    <footer className="bg-white pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 border-b border-border pb-12 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-text-primary">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-secondary hover:text-accent">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            Copyright © 2015 - 2026. Todos los derechos reservados
          </p>
          <div className="flex gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-accent">
              Términos de servicio
            </a>
            <a href="#" className="hover:text-accent">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
