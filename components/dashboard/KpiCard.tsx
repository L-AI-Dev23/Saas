import Link from "next/link";

export function KpiCard({
  label,
  value,
  delta,
  href,
}: {
  label: string;
  value: string;
  delta?: string;
  href?: string;
}) {
  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-lg border border-border bg-white p-5 shadow-sg-sm">{content}</div>;
}

export function KpiRow({ items }: { items: { label: string; value: string; delta?: string; href?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}

function KpiCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-sg-sm">
      <div className="h-3.5 w-24 animate-pulse rounded bg-border" />
      <div className="mt-3 flex items-baseline gap-2">
        <div className="h-7 w-16 animate-pulse rounded bg-border" />
        <div className="h-3.5 w-8 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

export function KpiRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  );
}
