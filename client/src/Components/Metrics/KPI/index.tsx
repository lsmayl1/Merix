import React from "react";
import {
  TrendingUp, ShoppingBag, BarChart3, Package, Banknote,
  CreditCard, Users, ArrowDownLeft, DollarSign, Receipt,
  ArrowUpRight, ArrowDownRight, Wallet, Building2, Layers,
} from "lucide-react";

const TYPES: Record<string, { Icon: any; iconText: string; accent: string }> = {
  revenue:  { Icon: TrendingUp,     iconText: "text-emerald-600", accent: "#10b981" },
  sale:     { Icon: ShoppingBag,    iconText: "text-blue-600",    accent: "#3b82f6" },
  graph:    { Icon: BarChart3,      iconText: "text-teal-600",    accent: "#14b8a6" },
  profit:   { Icon: DollarSign,     iconText: "text-teal-600",    accent: "#14b8a6" },
  warehouse:{ Icon: Package,        iconText: "text-orange-600",  accent: "#f97316" },
  stock:    { Icon: Layers,         iconText: "text-orange-600",  accent: "#f97316" },
  cash:     { Icon: Banknote,       iconText: "text-emerald-600", accent: "#10b981" },
  expense:  { Icon: ArrowDownRight, iconText: "text-red-500",     accent: "#ef4444" },
  income:   { Icon: ArrowUpRight,   iconText: "text-emerald-600", accent: "#10b981" },
  card:     { Icon: CreditCard,     iconText: "text-blue-600",    accent: "#3b82f6" },
  users:    { Icon: Users,          iconText: "text-purple-600",  accent: "#a855f7" },
  return:   { Icon: ArrowDownLeft,  iconText: "text-red-500",     accent: "#ef4444" },
  orders:   { Icon: Receipt,        iconText: "text-blue-600",    accent: "#3b82f6" },
  products: { Icon: Package,        iconText: "text-indigo-600",  accent: "#6366f1" },
  account:  { Icon: Wallet,         iconText: "text-sky-600",     accent: "#0ea5e9" },
  branch:   { Icon: Building2,      iconText: "text-violet-600",  accent: "#8b5cf6" },
  clients:  { Icon: Users,          iconText: "text-purple-600",  accent: "#a855f7" },
  companies:{ Icon: Building2,      iconText: "text-violet-600",  accent: "#8b5cf6" },
};

const DEFAULT = { Icon: BarChart3, iconText: "text-[#94a3b8]", accent: "#94a3b8" };

type KPIItem = { label: string; value?: string | number; icon?: string; delta?: number };

export const KPI = ({
  data = [],
  children,
  className,
}: {
  data?: KPIItem[];
  children?: React.ReactNode;
  className?: string;
}) => {
  const total = children ? data.length + 1 : data.length || 1;
  return (
    <div
      className={`grid gap-3 w-full grid-cols-2 ${className ?? ""}`}
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
    >
      {data.map((item, i) => {
        const { Icon, iconText, accent } = TYPES[item.icon ?? ""] ?? DEFAULT;
        return (
          <div
            key={i}
            className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex flex-col gap-3"
            style={{ borderLeft: `3px solid ${accent}` }}
          >
            <div className="flex items-center gap-2.5">
              <Icon size={13} strokeWidth={2.5} className={iconText} />
              <span className="text-xs font-medium text-[#94a3b8] leading-tight">
                {item.label}
              </span>
            </div>
            <span className="text-2xl font-bold text-[#0f172a] leading-none tabular-nums">
              {item.value ?? 0}
            </span>
            {item.delta !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${item.delta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {item.delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(item.delta)}%
              </div>
            )}
          </div>
        );
      })}
      {children}
    </div>
  );
};
