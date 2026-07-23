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

type EnvioPoint = {
  fecha: string;
  fechaCorta: string;
  envios: number;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: EnvioPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-white px-3 py-2 shadow-sg-md">
      <p className="text-xs font-medium text-text-secondary">{point.fechaCorta}</p>
      <p className="text-sm font-semibold text-text-primary">{point.envios} correos enviados</p>
    </div>
  );
}

export function EnviosChart({ data }: { data: EnvioPoint[] }) {
  return (
    <div
      className="h-full w-full"
      role="img"
      aria-label={`Gráfico de envíos de email por día, del ${data[0]?.fechaCorta} al ${data[data.length - 1]?.fechaCorta}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="enviosGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-link, #009fc1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-link, #009fc1)" stopOpacity={0} />
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
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a94a6" }} width={36} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="envios"
            stroke="var(--color-link, #009fc1)"
            strokeWidth={2}
            fill="url(#enviosGradient)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
