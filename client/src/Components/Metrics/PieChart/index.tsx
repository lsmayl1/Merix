import React from "react";
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type ChartItem = { name: string; value: number; color: string };
type Total = { label: string; value: number };

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.payload.color }} />
        <span className="text-[#64748b]">{item.name}</span>
        <span className="ml-auto font-semibold text-[#0f172a]">{item.value} ₼</span>
      </div>
    </div>
  );
};

export const PieChart = ({ chartData, total }: { chartData: ChartItem[]; total: Total }) => {
  const totalVal = chartData.reduce((s, d) => s + Number(d.value), 0);
  return (
    <div className="relative w-full aspect-square max-w-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="85%"
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPie>
      </ResponsiveContainer>
      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-[#94a3b8] font-medium">{total?.label}</span>
        <span className="text-lg font-bold text-[#0f172a] tabular-nums">
          {typeof total?.value === "number" ? total.value.toFixed(2) : total?.value} ₼
        </span>
      </div>
    </div>
  );
};
