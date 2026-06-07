import React from "react";
import { KPI } from "../../components/metrics/kpi/index.tsx";
import { LineChart } from "../../components/metrics/lineChart/index.tsx";
import { PieChartComponent } from "../../components/metrics/PieChart/PieChartComponent.tsx";
import { useGetClientsQuery } from "../../redux/features/clients/clientsSlice.tsx";
import { useGetSalesByUserIdQuery } from "../../redux/features/sales/salesHook.ts";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: clients = [] } = useGetClientsQuery(undefined, { pollingInterval: 30000 });
  const { data: salesData } = useGetSalesByUserIdQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });

  const totalRevenue   = clients.reduce((s: number, c: any) => s + parseFloat(c.totalRevenue || 0), 0);
  const totalSales     = clients.reduce((s: number, c: any) => s + (c.totalSales || 0), 0);
  const activeClients  = clients.filter((c: any) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-4 h-full my-container">
      {/* KPIs */}
      <KPI
        data={[
          { label: "Total Revenue",    value: totalRevenue.toFixed(2) + " ₼", icon: "revenue" },
          { label: "Total Sales",      value: totalSales,                       icon: "sale" },
          { label: "Active Companies", value: activeClients,                    icon: "clients" },
          { label: "Total Companies",  value: clients.length,                   icon: "companies" },
        ]}
      />

      {/* Charts row */}
      <div className="flex gap-4 min-w-0 max-md:flex-col">
        {/* Line chart */}
        <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 min-w-0 min-h-[280px]">
          <div className="flex items-center gap-2 shrink-0">
            <span className="size-7 bg-bg-muted rounded-md flex items-center justify-center">
              <TrendingUp size={14} className="text-text-secondary" />
            </span>
            <span className="text-sm font-semibold text-text-secondary">Revenue</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <LineChart data={salesData?.chartData} />
          </div>
        </div>

        {/* Pie chart */}
        <div className="flex-none w-64 max-md:w-full">
          <PieChartComponent
            title="Income & Expenses"
            data={[
              { name: "Revenue", value: totalRevenue, color: "#10b981" },
              { name: "Sales",   value: totalSales,   color: "#3b82f6" },
            ]}
            total={{ value: totalRevenue, label: "Revenue" }}
          />
        </div>
      </div>

      {/* Top companies */}
      <div className="bg-bg-surface border border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-text-secondary mb-3">Top Companies</p>
        <div className="flex flex-col gap-0.5">
          {(clients as any[]).slice(0, 8).map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/companies/${c.id}`)}
              className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-bg-subtle transition-colors text-start w-full"
            >
              <div className="flex items-center gap-2.5">
                <span className={`size-2 rounded-full shrink-0 ${c.status === "active" ? "bg-emerald-500" : "bg-red-400"}`} />
                <span className="text-sm text-text-primary font-medium">{c.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-text-muted">{c.totalSales} sales</span>
                <span className="text-sm font-semibold text-text-primary tabular-nums">{c.totalRevenue} ₼</span>
              </div>
            </button>
          ))}
          {clients.length === 0 && (
            <p className="text-sm text-text-muted text-center py-6">No companies yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
