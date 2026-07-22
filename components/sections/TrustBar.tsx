const badges = ["G2", "GetApp", "Gartner", "Trustpilot", "SourceForge", "Capterra"];
const clients = ["Cliente A", "Cliente B", "Cliente C", "Cliente D", "Cliente E", "Cliente F"];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Con la confianza de +3M de usuarios. Recomendado por +4K reseñas
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-text-secondary">
              <span className="text-base font-bold text-text-primary">{badge}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-accent">
                4.6 <span aria-hidden>★</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 opacity-70 grayscale">
          {clients.map((client) => (
            <span key={client} className="text-sm font-semibold text-text-muted">
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
