"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ContactPoint = {
  fecha: string;
  fechaCorta: string;
  contactos: number;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ContactPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-white px-3 py-2 shadow-sg-md">
      <p className="text-xs font-medium text-text-secondary">{point.fechaCorta}</p>
      <p className="text-sm font-semibold text-text-primary">
        {point.contactos} contactos nuevos
      </p>
    </div>
  );
}

export function ContactsChart({ data }: { data: ContactPoint[] }) {
  return (
    <div className="h-full w-full" role="img" aria-label={`Gráfico de contactos nuevos por día, del ${data[0]?.fechaCorta} al ${data[data.length - 1]?.fechaCorta}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="contactosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cta, #18181b)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-cta, #18181b)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            dataKey="fechaCorta"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#8a94a6" }}
            interval={4}
            minTickGap={20}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#8a94a6" }}
            width={36}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="contactos"
            stroke="var(--color-cta, #18181b)"
            strokeWidth={2}
            fill="url(#contactosGradient)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}