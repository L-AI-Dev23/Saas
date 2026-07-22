const rows = [
  {
    title: "Ahorra tiempo con integraciones gratuitas",
    descr:
      "Despídete del caos de software: todas las herramientas ya están integradas entre sí. Comunícate con tus clientes directamente desde sus tarjetas de contacto de CRM.",
  },
  {
    title: "Mejora la colaboración y la eficacia de tu equipo",
    descr:
      "Invita a tus colegas a tu sistema CRM para gestionar su flujo de trabajo y realizar un seguimiento de la eficacia de las campañas o los tratos.",
  },
  {
    title: "Segmenta tu audiencia y personaliza tu comunicación",
    descr:
      "Fideliza a tus clientes con campañas promocionales y transaccionales bien elaboradas, tomando en cuenta el estado del proceso de ventas y sus datos personales.",
  },
  {
    title: "Supervisa y analiza el rendimiento de tu marketing",
    descr:
      "Observa cómo interactúan los usuarios con elementos específicos, analiza tu audiencia y consulta informes detallados para maximizar tu eficacia.",
  },
];

export function FeatureRows() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
        {rows.map((row, i) => (
          <div
            key={row.title}
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-surface">
              <span className="h-16 w-16 rounded-2xl bg-accent/15" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{row.title}</h3>
              <p className="mt-4 text-text-secondary">{row.descr}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
