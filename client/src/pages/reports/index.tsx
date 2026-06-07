import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, Package, Users, DollarSign, AlertTriangle, ShoppingCart,
  CreditCard, BarChart2, ArrowDownLeft, Banknote, RefreshCw,
} from "lucide-react";
import { useGetClientsQuery, useGetClientReportsQuery } from "../../redux/features/clients/clientsSlice.tsx";

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt  = (n: number, dec = 2) => n?.toFixed(dec) ?? "0.00";
const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : fmt(n);

const PAYMENT_COLORS: Record<string, string> = {
  cash:        "#10b981",
  credit_card: "#3b82f6",
  card:        "#3b82f6",
  bank:        "#8b5cf6",
  transfer:    "#8b5cf6",
  mixed:       "#f59e0b",
  other:       "#94a3b8",
};
const PIE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#f97316"];

const methodLabel = (m: string) =>
  ({ cash: "Cash", credit_card: "Card", card: "Card", bank: "Bank Transfer", transfer: "Transfer", mixed: "Mixed", other: "Other" }[m] ?? m);

// ── sub-components ────────────────────────────────────────────────────────────

const Card = ({
  icon: Icon, label, value, sub, accent = "#10b981",
}: { icon: any; label: string; value: string | number; sub?: string; accent?: string }) => (
  <div
    className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col gap-2"
    style={{ borderLeft: `3px solid ${accent}` }}
  >
    <div className="flex items-center gap-2">
      <Icon size={14} style={{ color: accent }} />
      <span className="text-xs text-text-muted font-medium">{label}</span>
    </div>
    <span className="text-2xl font-bold text-text-primary tabular-nums">{value}</span>
    {sub && <span className="text-xs text-text-secondary">{sub}</span>}
  </div>
);

const SectionHead = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold text-text-primary">{title}</h2>
    {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
  </div>
);

const chartTooltipStyle = {
  contentStyle: { background: "#0f1623", border: "1px solid #1e2a3a", borderRadius: 8, fontSize: 12 },
  itemStyle: { color: "#94a3b8" },
  labelStyle: { color: "#e2e8f0" },
};

// ── Executive tab ─────────────────────────────────────────────────────────────

const Executive = ({ r }: { r: any }) => {
  const kpis = [
    { icon: TrendingUp,    label: "Today's Sales",      value: `${r.sales.today.count}`,                          sub: `${fmt(r.sales.today.revenue)} ₼ revenue`,    accent: "#10b981" },
    { icon: DollarSign,    label: "This Month Revenue",  value: `${fmt(r.sales.thisMonth.revenue)} ₼`,             sub: `${r.sales.thisMonth.count} orders`,           accent: "#3b82f6" },
    { icon: ShoppingCart,  label: "Total Orders",        value: r.sales.total.count,                               sub: `Avg ${fmt(r.sales.total.avgOrder)} ₼`,        accent: "#6366f1" },
    { icon: DollarSign,    label: "Total Revenue",       value: `${fmt(r.sales.total.revenue)} ₼`,                 sub: `All time`,                                    accent: "#8b5cf6" },
    { icon: Package,       label: "Active Products",     value: r.inventory.total.count,                           sub: `${fmt(r.inventory.total.totalValue)} ₼ value`,accent: "#f97316" },
    { icon: AlertTriangle, label: "Low Stock Alerts",    value: r.inventory.lowStock.length,                       sub: `${r.inventory.outOfStock.length} out of stock`,accent: "#ef4444" },
    { icon: Users,         label: "Total Customers",     value: r.customers.total,                                 sub: `${r.customers.debtors} with outstanding`,     accent: "#a855f7" },
    { icon: CreditCard,    label: "Pending Balances",    value: `${fmt(r.customers.totalDebt)} ₼`,                 sub: `From ${r.customers.debtors} customers`,       accent: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <Card key={i} {...k} />)}
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-bg-surface border border-border rounded-xl p-4">
        <SectionHead title="Monthly Revenue Trend" sub="Revenue over time" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={r.sales.monthly} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: "#64748b" }} />
            <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${fmt(v)} ₼`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Method + Top Debtors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Payment Methods" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={r.sales.byPaymentMethod} dataKey="amount" nameKey="method" cx="50%" cy="50%" outerRadius={70} label={({ method, percent }) => `${methodLabel(method)} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {r.sales.byPaymentMethod.map((entry: any, i: number) => (
                  <Cell key={i} fill={PAYMENT_COLORS[entry.method] ?? PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${fmt(v)} ₼`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Top Outstanding Balances" />
          {r.customers.topDebtors.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-8">No outstanding balances</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {r.customers.topDebtors.slice(0, 6).map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-bg-muted transition">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{c.name}</p>
                    <p className="text-xs text-text-muted">{c.phone || "—"}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-500">{fmt(c.balance)} ₼</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Sales tab ─────────────────────────────────────────────────────────────────

const Sales = ({ r }: { r: any }) => {
  const kpis = [
    { icon: ShoppingCart,   label: "Total Orders",    value: r.sales.total.count,                  sub: "All time",               accent: "#3b82f6" },
    { icon: TrendingUp,     label: "Total Revenue",   value: `${fmt(r.sales.total.revenue)} ₼`,    sub: "Net (excl. returns)",    accent: "#10b981" },
    { icon: DollarSign,     label: "Avg Order Value", value: `${fmt(r.sales.total.avgOrder)} ₼`,   sub: "Per transaction",        accent: "#8b5cf6" },
    { icon: ArrowDownLeft,  label: "Returns",         value: r.sales.returns.count,                sub: `${fmt(r.sales.returns.amount)} ₼ refunded`, accent: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <Card key={i} {...k} />)}
      </div>

      {/* Payment Method table */}
      <div className="bg-bg-surface border border-border rounded-xl p-4">
        <SectionHead title="Sales by Payment Method" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Method</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Transactions</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {r.sales.byPaymentMethod.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: PAYMENT_COLORS[p.method] ?? "#94a3b8" }} />
                        <span className="text-text-primary">{methodLabel(p.method)}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-text-secondary">{p.count}</td>
                    <td className="py-2 px-3 text-right font-medium text-text-primary">{fmt(p.amount)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={r.sales.byPaymentMethod} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis type="category" dataKey="method" tickFormatter={methodLabel} tick={{ fontSize: 11, fill: "#64748b" }} width={70} />
              <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${fmt(v)} ₼`, "Amount"]} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {r.sales.byPaymentMethod.map((e: any, i: number) => (
                  <Cell key={i} fill={PAYMENT_COLORS[e.method] ?? PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cashier Performance */}
      {r.sales.byCashier.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Cashier Performance" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">#</th>
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Cashier</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Transactions</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Revenue</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                {r.sales.byCashier.map((c: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3 text-text-muted text-xs">{i + 1}</td>
                    <td className="py-2 px-3 font-medium text-text-primary">{c.name}</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{c.count}</td>
                    <td className="py-2 px-3 text-right font-semibold text-text-primary">{fmt(c.revenue)} ₼</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{fmt(c.count > 0 ? c.revenue / c.count : 0)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly table */}
      <div className="bg-bg-surface border border-border rounded-xl p-4">
        <SectionHead title="Monthly Sales Summary" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Month</th>
                <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Orders</th>
                <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Revenue</th>
                <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Avg Order</th>
              </tr>
            </thead>
            <tbody>
              {[...r.sales.monthly].reverse().slice(0, 12).map((m: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                  <td className="py-2 px-3 font-medium text-text-primary">{m.month}</td>
                  <td className="py-2 px-3 text-right text-text-secondary">{m.orders}</td>
                  <td className="py-2 px-3 text-right font-semibold text-text-primary">{fmt(m.revenue)} ₼</td>
                  <td className="py-2 px-3 text-right text-text-secondary">{m.orders > 0 ? fmt(m.revenue / m.orders) : "—"} ₼</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Inventory tab ─────────────────────────────────────────────────────────────

const Inventory = ({ r }: { r: any }) => {
  const kpis = [
    { icon: Package,       label: "Total Products",  value: r.inventory.total.count,                   sub: "Active in catalog",           accent: "#f97316" },
    { icon: DollarSign,    label: "Total Stock Value",value: `${fmt(r.inventory.total.totalValue)} ₼`,  sub: "Inventory valuation",         accent: "#10b981" },
    { icon: AlertTriangle, label: "Low Stock",        value: r.inventory.lowStock.length,               sub: "Items below threshold (5)",   accent: "#f59e0b" },
    { icon: Package,       label: "Out of Stock",     value: r.inventory.outOfStock.length,             sub: "Items with 0 quantity",       accent: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <Card key={i} {...k} />)}
      </div>

      {/* Low Stock Alerts */}
      {r.inventory.lowStock.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Low Stock Alerts" sub="Products below reorder threshold" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Product</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Stock</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Unit</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {r.inventory.lowStock.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3 font-medium text-text-primary">{p.name}</td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-amber-500 font-semibold">{p.stock}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-text-secondary">{p.unit || "—"}</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{fmt(p.price)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Out of Stock */}
      {r.inventory.outOfStock.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Out of Stock" sub="Products with zero inventory" />
          <div className="flex flex-wrap gap-2">
            {r.inventory.outOfStock.map((p: any, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* By Category */}
      {r.inventory.byCategory.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Stock by Category" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Category</th>
                    <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Products</th>
                    <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {r.inventory.byCategory.map((c: any, i: number) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                      <td className="py-2 px-3 font-medium text-text-primary">{c.name}</td>
                      <td className="py-2 px-3 text-right text-text-secondary">{c.count}</td>
                      <td className="py-2 px-3 text-right font-semibold text-text-primary">{fmt(c.value)} ₼</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={r.inventory.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {r.inventory.byCategory.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${fmt(v)} ₼`, "Value"]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Financial tab ─────────────────────────────────────────────────────────────

const Financial = ({ r }: { r: any }) => {
  const kpis = [
    { icon: TrendingUp,  label: "Total Income",   value: `${fmt(r.financial.income)} ₼`,    sub: "All income transactions",  accent: "#10b981" },
    { icon: DollarSign,  label: "Total Expenses", value: `${fmt(r.financial.expenses)} ₼`,  sub: "All expense transactions", accent: "#ef4444" },
    { icon: BarChart2,   label: "Net Profit",     value: `${fmt(r.financial.netProfit)} ₼`, sub: "Income − Expenses",        accent: r.financial.netProfit >= 0 ? "#10b981" : "#ef4444" },
    { icon: Banknote,    label: "Transactions",   value: r.financial.byType.reduce((a: number, t: any) => a + t.count, 0), sub: "Total recorded", accent: "#8b5cf6" },
  ];

  const incExpData = [
    { name: "Income",   value: r.financial.income,   fill: "#10b981" },
    { name: "Expenses", value: r.financial.expenses, fill: "#ef4444" },
    { name: "Profit",   value: Math.max(0, r.financial.netProfit), fill: "#3b82f6" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <Card key={i} {...k} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Income vs Expenses vs Profit" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incExpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${fmt(v)} ₼`]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {incExpData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Transaction Breakdown" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Type</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Count</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {r.financial.byType.map((t: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3 font-medium text-text-primary capitalize">{t.type}</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{t.count}</td>
                    <td className="py-2 px-3 text-right font-semibold text-text-primary">{fmt(t.total)} ₼</td>
                  </tr>
                ))}
                {r.financial.byType.length === 0 && (
                  <tr><td colSpan={3} className="py-8 text-center text-text-muted text-xs">No transactions recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {r.financial.byPayment.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-xl p-4">
          <SectionHead title="Transaction Payment Methods" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Method</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Count</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {r.financial.byPayment.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3 font-medium text-text-primary">{methodLabel(p.method)}</td>
                    <td className="py-2 px-3 text-right text-text-secondary">{p.count}</td>
                    <td className="py-2 px-3 text-right font-semibold text-text-primary">{fmt(p.total)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Customers tab ─────────────────────────────────────────────────────────────

const Customers = ({ r }: { r: any }) => {
  const kpis = [
    { icon: Users,       label: "Total Customers",     value: r.customers.total,                    sub: "In database",                  accent: "#a855f7" },
    { icon: CreditCard,  label: "With Outstanding",    value: r.customers.debtors,                  sub: "Customers with pending balance",accent: "#f59e0b" },
    { icon: DollarSign,  label: "Total Outstanding",   value: `${fmt(r.customers.totalDebt)} ₼`,    sub: "Sum of all balances",          accent: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpis.map((k, i) => <Card key={i} {...k} />)}
      </div>

      <div className="bg-bg-surface border border-border rounded-xl p-4">
        <SectionHead title="Customer Balance Report" sub="Customers with outstanding payments" />
        {r.customers.topDebtors.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-12">No outstanding customer balances</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-border bg-bg-muted">
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">#</th>
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Customer</th>
                  <th className="text-left py-2 px-3 text-xs text-text-muted font-medium">Phone</th>
                  <th className="text-right py-2 px-3 text-xs text-text-muted font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {r.customers.topDebtors.map((c: any, i: number) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-muted transition">
                    <td className="py-2 px-3 text-text-muted text-xs">{i + 1}</td>
                    <td className="py-2 px-3 font-medium text-text-primary">{c.name}</td>
                    <td className="py-2 px-3 text-text-secondary">{c.phone || "—"}</td>
                    <td className="py-2 px-3 text-right font-semibold text-amber-500">{fmt(c.balance)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "executive", label: "Executive" },
  { key: "sales",     label: "Sales" },
  { key: "inventory", label: "Inventory" },
  { key: "financial", label: "Financial" },
  { key: "customers", label: "Customers" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export const Reports = () => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("executive");

  const { data: clients = [] } = useGetClientsQuery(undefined);
  const { data: report, isLoading, isFetching, refetch } = useGetClientReportsQuery(selectedClientId, {
    skip: !selectedClientId,
  });

  const selectedClient = useMemo(
    () => (clients as any[]).find((c) => c.id === selectedClientId),
    [clients, selectedClientId],
  );

  return (
    <div className="flex flex-col gap-4 h-full my-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Reports</h1>
          {selectedClient && (
            <p className="text-sm text-text-muted mt-0.5">{selectedClient.name}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg-surface text-text-primary focus:outline-none focus:border-brand min-w-[200px]"
          >
            <option value="">Select a company…</option>
            {(clients as any[]).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {selectedClientId && (
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-lg border border-border hover:bg-bg-muted transition text-text-secondary disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!selectedClientId && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-20">
          <BarChart2 size={40} className="text-text-muted" />
          <p className="text-base font-medium text-text-secondary">Select a company to view reports</p>
          <p className="text-sm text-text-muted max-w-xs">Choose a company from the dropdown above to see sales, inventory, financial, and customer reports.</p>
        </div>
      )}

      {/* Loading */}
      {selectedClientId && isLoading && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="size-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Report content */}
      {selectedClientId && !isLoading && report && (
        <>
          {/* Tab nav */}
          <div className="flex gap-1 overflow-x-auto pb-1 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition ${
                  activeTab === tab.key
                    ? "text-brand border-b-2 border-brand"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto pb-4">
            {activeTab === "executive"  && <Executive  r={report} />}
            {activeTab === "sales"      && <Sales      r={report} />}
            {activeTab === "inventory"  && <Inventory  r={report} />}
            {activeTab === "financial"  && <Financial  r={report} />}
            {activeTab === "customers"  && <Customers  r={report} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
