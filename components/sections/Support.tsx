export function Support() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-2xl font-extrabold text-text-primary">
              Te ayudaremos a familiarizarte con nuestros servicios
            </h3>
            <p className="mt-4 text-text-secondary">
              Siempre estamos aquí para apoyarte. Si tienes alguna duda, siempre puedes contactar a
              nuestro servicio de atención al cliente o consultar nuestros recursos gratuitos.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-sg-sm)]">
            <div className="mb-3 h-10 w-10 rounded-lg bg-accent/10" />
            <h4 className="text-lg font-bold text-text-primary">Soporte 24/7</h4>
            <p className="mt-2 text-sm text-text-secondary">
              Inicia un chat o completa el formulario: estamos a tu disposición 24/7 en varios
              idiomas.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-sg-sm)]">
            <div className="mb-3 h-10 w-10 rounded-lg bg-accent/10" />
            <h4 className="text-lg font-bold text-text-primary">Base de conocimientos</h4>
            <p className="mt-2 text-sm text-text-secondary">
              Consulta todas las instrucciones de uso de nuestra plataforma siempre que lo necesites.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
