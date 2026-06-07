import React, { useState } from "react";
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

type DataPoint = { date: string; revenue: number; orders?: number };

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const rev = payload.find((p: any) => p.dataKey === "revenue");
  const ord = payload.find((p: any) => p.dataKey === "orders");
  return (
    <div className="bg-bg-surface border border-border rounded-lg px-3 py-2.5 shadow-modal text-xs">
      <p className="font-semibold text-text-primary mb-1.5">{label}</p>
      {rev && (
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2 rounded-sm bg-blue-500 shrink-0" />
          <span className="text-text-secondary">Revenue</span>
          <span className="ml-auto font-semibold text-blue-500">{rev.value.toLocaleString()} ₼</span>
        </div>
      )}
      {ord && (
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-text-secondary">Sales</span>
          <span className="ml-auto font-semibold text-emerald-500">{ord.value}</span>
        </div>
      )}
    </div>
  );
};

const ActiveDot = ({ cx, cy, stroke, activeDay, day }: any) =>
  activeDay !== day ? null : (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={stroke} stroke="#fff" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={9} fill={stroke} fillOpacity={0.12} />
    </g>
  );

const EmptyChart = () => (
  <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
    <div className="size-12 rounded-full bg-bg-muted flex items-center justify-center">
      <TrendingUp size={22} className="text-text-muted" />
    </div>
    <div>
      <p className="text-sm font-semibold text-text-secondary">No data</p>
      <p className="text-xs text-text-muted mt-0.5">No sales found for the selected period.</p>
    </div>
  </div>
);

export const LineChart = ({ data }: { data?: DataPoint[] }) => {
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const hasData = Array.isArray(data) && data.length > 0 && data.some((d) => d.revenue > 0);

  return (
    <div className="w-full h-full min-h-[200px]">
      {!hasData ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            onMouseMove={(e) => e.activePayload && setActiveDay(e.activeLabel ?? null)}
            onMouseLeave={() => setActiveDay(null)}
          >
            <defs>
              <linearGradient id="revenueGradAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={38} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} width={30} hide />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              yAxisId="rev" type="monotone" dataKey="revenue"
              stroke="#3b82f6" strokeWidth={2} fill="url(#revenueGradAdmin)"
              dot={(props: any) => <ActiveDot {...props} stroke="#3b82f6" activeDay={activeDay} day={props.payload.date} />}
              activeDot={false}
            />
            <Line
              yAxisId="ord" type="monotone" dataKey="orders"
              stroke="#10b981" strokeWidth={1.5} strokeDasharray="5 4"
              dot={(props: any) => <ActiveDot {...props} stroke="#10b981" activeDay={activeDay} day={props.payload.date} />}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
