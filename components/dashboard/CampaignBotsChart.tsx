"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type BotPoint = {
  nombre: string;
  mensajes: number;
};

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: BotPoint }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-white px-3 py-2 shadow-sg-md">
      <p className="text-xs font-medium text-text-secondary">{point.nombre}</p>
      <p className="text-sm font-semibold text-text-primary">{point.mensajes.toLocaleString()} mensajes</p>
    </div>
  );
}

export function CampaignBotsChart({ data }: { data: BotPoint[] }) {
  const height = Math.max(data.length * 36, 80);
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="Mensajes por bot en esta campaña">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8a94a6" }} />
          <YAxis
            type="category"
            dataKey="nombre"
            tickLine={false}
            axisLine={false}
            width={140}
            tick={{ fontSize: 11, fill: "#374151" }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f3f4f6" }} />
          <Bar dataKey="mensajes" fill="var(--color-accent, #18181b)" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
