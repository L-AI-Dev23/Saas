"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type ExecutionPoint = {
  fecha: string;
  fechaCorta: string;
  exitosas: number;
  fallidas: number;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ExecutionPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-white px-3 py-2 shadow-sg-md">
      <p className="text-xs font-medium text-text-secondary">{point.fechaCorta}</p>
      <p className="text-sm font-semibold text-text-primary">{point.exitosas} exitosas</p>
      <p className="text-sm font-semibold text-error">{point.fallidas} fallidas</p>
    </div>
  );
}

export function ExecutionsChart({ data }: { data: ExecutionPoint[] }) {
  return (
    <div
      className="h-full w-full"
      role="img"
      aria-label={`Gráfico de ejecuciones por día, del ${data[0]?.fechaCorta} al ${data[data.length - 1]?.fechaCorta}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f4f4f5" }} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
          />
          <Bar dataKey="exitosas" name="Exitosas" stackId="a" fill="var(--color-cta, #18181b)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="fallidas" name="Fallidas" stackId="a" fill="var(--color-error, #ef4444)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
