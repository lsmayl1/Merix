import React, { useMemo } from "react";
import { PieChart } from ".";

type DataItem = { name: string; color?: string; value: string | number };
type Total = { label: string; value: number };

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#0ea5e9", "#14b8a6", "#f97316"];

export const DonutChartComponent = ({
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
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-4">
      <span className="text-sm font-semibold text-[#64748b]">{title}</span>
      <div className="flex w-full max-md:flex-col gap-4 mt-4">
        {/* Donut */}
        <div className="flex items-center justify-center shrink-0">
          <PieChart chartData={chartData} total={total} />
        </div>
        {/* Legend grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 overflow-auto content-start">
          {chartData.map((dt, i) => (
            <div key={i} className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <span className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: dt.color }} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-[#64748b] truncate">{dt.name}</span>
                <span className="text-xs font-semibold text-[#0f172a] tabular-nums">{dt.value} ₼</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
