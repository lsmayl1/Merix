import React, { useMemo } from "react";
import { PieChart } from ".";

type DataItem = { name: string; color?: string; value: string | number };
type Total = { label: string; value: number };

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#0ea5e9", "#14b8a6", "#f97316"];

export const PieChartComponent = ({
  title,
  data,
  total,
}: {
  title: string;
  data: DataItem[];
  total: Total;
}) => {
  const chartData = useMemo(() =>
    data.map((dt, i) => ({
      ...dt,
      value: Number(dt.value),
      color: dt.color ?? PALETTE[i % PALETTE.length],
    })), [data]);

  return (
    <div className="flex flex-col gap-3 h-full bg-bg-surface border border-border rounded-xl p-4">
      <span className="text-sm font-semibold text-text-secondary">{title}</span>
      <div className="flex items-center justify-center">
        <PieChart chartData={chartData} total={total} />
      </div>
      <div className="flex flex-col gap-1 overflow-auto">
        {chartData.map((dt, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-bg-subtle transition-colors">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: dt.color }} />
              <span className="text-xs text-text-secondary">{dt.name}</span>
            </div>
            <span className="text-xs font-semibold text-text-primary tabular-nums">{dt.value} ₼</span>
          </div>
        ))}
      </div>
    </div>
  );
};
