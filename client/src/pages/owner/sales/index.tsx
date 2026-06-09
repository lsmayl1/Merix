import { useState } from "react";
import { useGetOwnerSalesQuery } from "../../../redux/features/owner/ownerSlice.tsx";

const badge: Record<string, string> = {
  cash:          "bg-emerald-500/10 text-emerald-600",
  card:          "bg-blue-500/10 text-blue-600",
  credit_card:   "bg-blue-500/10 text-blue-600",
  bank_transfer: "bg-violet-500/10 text-violet-600",
  mixed:         "bg-amber-500/10 text-amber-600",
};

export const OwnerSales = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetOwnerSalesQuery({ page, limit: 25 }, { pollingInterval: 30000 });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">Sales</h2>
        {data && <span className="text-sm text-text-muted">{data.total} total</span>}
      </div>

      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Payment</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">Subtotal</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">Discount</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="text-center py-8 text-text-muted">Loading…</td></tr>
            )}
            {!isLoading && data?.sales?.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-text-muted">No sales yet.</td></tr>
            )}
            {data?.sales?.map((s: any) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors">
                <td className="px-4 py-3 text-text-secondary">{s.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.type === "return" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-600"}`}>
                    {s.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badge[s.paymentMethod] ?? "bg-bg-muted text-text-secondary"}`}>
                    {s.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{s.subtotal_amount} ₼</td>
                <td className="px-4 py-3 text-right tabular-nums text-text-secondary">{s.discount}%</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-text-primary">{s.total_amount} ₼</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.pageCount > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-40 transition-colors">
            Prev
          </button>
          <span className="text-sm text-text-muted">{page} / {data.pageCount}</span>
          <button onClick={() => setPage((p) => Math.min(data.pageCount, p + 1))} disabled={page === data.pageCount}
            className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-40 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
};
