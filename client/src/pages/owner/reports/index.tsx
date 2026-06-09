import { useGetOwnerReportsQuery } from "../../../redux/features/owner/ownerSlice.tsx";
import { LineChart } from "../../../components/metrics/lineChart/index.tsx";
import { PieChartComponent } from "../../../components/metrics/PieChart/PieChartComponent.tsx";

export const OwnerReports = () => {
  const { data, isLoading } = useGetOwnerReportsQuery(undefined);

  if (isLoading) return <div className="text-text-muted text-sm">Loading…</div>;
  if (!data)     return <div className="text-text-muted text-sm">No data</div>;

  const { sales, inventory, customers, financial } = data;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-primary">Reports</h2>

      {/* Revenue over time */}
      <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 min-h-[280px]">
        <span className="text-sm font-semibold text-text-secondary">Revenue Over Time</span>
        <div className="flex-1 min-h-[220px]">
          <LineChart data={sales.monthly} />
        </div>
      </div>

      <div className="flex gap-4 max-md:flex-col">
        {/* Payment breakdown */}
        <PieChartComponent
          title="Payment Methods"
          data={sales.byPaymentMethod?.map((p: any, i: number) => ({
            name: p.method,
            value: p.amount,
            color: ["#10b981","#3b82f6","#f59e0b","#8b5cf6","#ef4444"][i % 5],
          })) ?? []}
          total={{ value: sales.total.revenue, label: "Revenue" }}
        />

        {/* Cashier performance */}
        <div className="flex-1 bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <span className="text-sm font-semibold text-text-secondary">Sales by Cashier</span>
          <div className="flex flex-col gap-2">
            {sales.byCashier?.map((c: any) => (
              <div key={c.userId} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-text-primary">{c.name}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums text-text-primary">{c.revenue} ₼</span>
                  <span className="text-xs text-text-muted ml-2">{c.count} sales</span>
                </div>
              </div>
            ))}
            {!sales.byCashier?.length && <span className="text-xs text-text-muted">No data</span>}
          </div>
        </div>
      </div>

      {/* Inventory summary */}
      <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
        <span className="text-sm font-semibold text-text-secondary">Inventory by Category</span>
        <div className="flex flex-col gap-1.5">
          {inventory.byCategory?.map((c: any) => (
            <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-sm text-text-primary">{c.name}</span>
              <div className="text-right">
                <span className="text-sm font-semibold tabular-nums text-text-primary">{c.value} ₼</span>
                <span className="text-xs text-text-muted ml-2">{c.count} products</span>
              </div>
            </div>
          ))}
          {!inventory.byCategory?.length && <span className="text-xs text-text-muted">No products yet</span>}
        </div>
      </div>

      {/* Customer debt */}
      {customers.topDebtors?.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-secondary">Customer Debts</span>
            <span className="text-sm font-semibold text-red-400 tabular-nums">Total: {customers.totalDebt} ₼</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {customers.topDebtors.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-text-primary">{d.name}</p>
                  {d.phone && <p className="text-xs text-text-muted">{d.phone}</p>}
                </div>
                <span className="text-sm font-semibold text-red-400 tabular-nums">{d.balance} ₼</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
