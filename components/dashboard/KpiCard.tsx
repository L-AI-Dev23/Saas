export function KpiCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sg-sm">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text-primary">{value}</span>
        {delta && (
          <span
            className={
              delta.startsWith("-")
                ? "text-xs font-semibold text-error"
                : delta === "0%"
                  ? "text-xs font-semibold text-text-muted"
                  : "text-xs font-semibold text-success"
            }
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export function KpiRow({ items }: { items: { label: string; value: string; delta?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}
