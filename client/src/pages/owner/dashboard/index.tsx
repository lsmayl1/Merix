import { useGetOwnerReportsQuery } from "../../../redux/features/owner/ownerSlice.tsx";
import { LineChart } from "../../../components/metrics/lineChart/index.tsx";
import { TrendingUp, ShoppingCart, RotateCcw, DollarSign, Package, Users } from "lucide-react";

const Kpi = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-1">
    <span className="text-xs text-text-muted">{label}</span>
    <span className="text-2xl font-bold text-text-primary tabular-nums">{value}</span>
    {sub && <span className="text-xs text-text-secondary">{sub}</span>}
  </div>
);

export const OwnerDashboard = () => {
  const { data, isLoading } = useGetOwnerReportsQuery(undefined, { pollingInterval: 60000 });

  if (isLoading) return <div className="text-text-muted text-sm">Loading…</div>;
  if (!data)     return <div className="text-text-muted text-sm">No data</div>;

  const { sales, inventory, customers, financial } = data;

  return (
    <div className="flex flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Kpi label="Total Revenue"     value={`${sales.total.revenue} ₼`} />
        <Kpi label="Total Sales"       value={sales.total.count} />
        <Kpi label="Today Sales"       value={sales.today.count} sub={`${sales.today.revenue} ₼`} />
        <Kpi label="This Month"        value={sales.thisMonth.count} sub={`${sales.thisMonth.revenue} ₼`} />
        <Kpi label="Products"          value={inventory.total.count} sub={`${inventory.total.totalValue} ₼ value`} />
        <Kpi label="Customers"         value={customers.total} sub={`${customers.debtors} debtors`} />
      </div>

      {/* Revenue chart + payment methods */}
      <div className="flex gap-4 max-md:flex-col">
        <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 min-h-[260px]">
          <div className="flex items-center gap-2">
            <span className="size-7 bg-bg-muted rounded-md flex items-center justify-center">
              <TrendingUp size={14} className="text-text-secondary" />
            </span>
            <span className="text-sm font-semibold text-text-secondary">Monthly Revenue</span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <LineChart data={sales.monthly?.map((m: any) => ({ month: m.month, revenue: m.revenue }))} />
          </div>
        </div>

        <div className="w-64 max-md:w-full bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <ShoppingCart size={14} /> Payment Methods
          </span>
          <div className="flex flex-col gap-2">
            {sales.byPaymentMethod?.map((p: any) => (
              <div key={p.method} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary capitalize">{p.method}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-text-primary tabular-nums">{p.amount} ₼</span>
                  <span className="text-xs text-text-muted ml-2">({p.count})</span>
                </div>
              </div>
            ))}
            {!sales.byPaymentMethod?.length && <span className="text-xs text-text-muted">No sales yet</span>}
          </div>
        </div>
      </div>

      {/* Finance + Top debtors */}
      <div className="flex gap-4 max-md:flex-col">
        <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <DollarSign size={14} /> Financials
          </span>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-text-muted">Income</p>
              <p className="text-lg font-bold text-emerald-500 tabular-nums">{financial.income} ₼</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Expenses</p>
              <p className="text-lg font-bold text-red-400 tabular-nums">{financial.expenses} ₼</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Net Profit</p>
              <p className={`text-lg font-bold tabular-nums ${financial.netProfit >= 0 ? "text-emerald-500" : "text-red-400"}`}>{financial.netProfit} ₼</p>
            </div>
          </div>
        </div>

        {customers.topDebtors?.length > 0 && (
          <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
            <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <Users size={14} /> Top Debtors
            </span>
            <div className="flex flex-col gap-1.5">
              {customers.topDebtors.slice(0, 5).map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-primary">{d.name}</p>
                    <p className="text-xs text-text-muted">{d.phone}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-400 tabular-nums">{d.balance} ₼</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Low stock */}
      {inventory.lowStock?.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <Package size={14} /> Low Stock Alert
          </span>
          <div className="flex flex-col gap-1">
            {inventory.lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-text-primary">{p.name}</span>
                <span className="text-sm font-semibold text-yellow-500 tabular-nums">{p.stock} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
