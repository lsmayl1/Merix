import React from "react";
import {
  TrendingUp, ShoppingBag, BarChart3, Package, Banknote,
  CreditCard, Users, ArrowDownLeft, DollarSign, Receipt,
  ArrowUpRight, ArrowDownRight, Wallet, Building2, Layers,
} from "lucide-react";

const TYPES: Record<string, { Icon: any; iconBg: string; iconText: string; accent: string }> = {
  revenue:   { Icon: TrendingUp,     iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconText: "text-emerald-600 dark:text-emerald-400", accent: "#10b981" },
  sale:      { Icon: ShoppingBag,    iconBg: "bg-blue-100 dark:bg-blue-900/40",      iconText: "text-blue-600 dark:text-blue-400",      accent: "#3b82f6" },
  graph:     { Icon: BarChart3,      iconBg: "bg-teal-100 dark:bg-teal-900/40",      iconText: "text-teal-600 dark:text-teal-400",      accent: "#14b8a6" },
  profit:    { Icon: DollarSign,     iconBg: "bg-teal-100 dark:bg-teal-900/40",      iconText: "text-teal-600 dark:text-teal-400",      accent: "#14b8a6" },
  warehouse: { Icon: Package,        iconBg: "bg-orange-100 dark:bg-orange-900/40",  iconText: "text-orange-600 dark:text-orange-400",  accent: "#f97316" },
  stock:     { Icon: Layers,         iconBg: "bg-orange-100 dark:bg-orange-900/40",  iconText: "text-orange-600 dark:text-orange-400",  accent: "#f97316" },
  cash:      { Icon: Banknote,       iconBg: "bg-emerald-100 dark:bg-emerald-900/40",iconText: "text-emerald-600 dark:text-emerald-400",accent: "#10b981" },
  expense:   { Icon: ArrowDownRight, iconBg: "bg-red-100 dark:bg-red-900/40",        iconText: "text-red-600 dark:text-red-400",        accent: "#ef4444" },
  income:    { Icon: ArrowUpRight,   iconBg: "bg-emerald-100 dark:bg-emerald-900/40",iconText: "text-emerald-600 dark:text-emerald-400",accent: "#10b981" },
  card:      { Icon: CreditCard,     iconBg: "bg-blue-100 dark:bg-blue-900/40",      iconText: "text-blue-600 dark:text-blue-400",      accent: "#3b82f6" },
  users:     { Icon: Users,          iconBg: "bg-purple-100 dark:bg-purple-900/40",  iconText: "text-purple-600 dark:text-purple-400",  accent: "#a855f7" },
  return:    { Icon: ArrowDownLeft,  iconBg: "bg-red-100 dark:bg-red-900/40",        iconText: "text-red-600 dark:text-red-400",        accent: "#ef4444" },
  orders:    { Icon: Receipt,        iconBg: "bg-blue-100 dark:bg-blue-900/40",      iconText: "text-blue-600 dark:text-blue-400",      accent: "#3b82f6" },
  products:  { Icon: Package,        iconBg: "bg-indigo-100 dark:bg-indigo-900/40",  iconText: "text-indigo-600 dark:text-indigo-400",  accent: "#6366f1" },
  account:   { Icon: Wallet,         iconBg: "bg-sky-100 dark:bg-sky-900/40",        iconText: "text-sky-600 dark:text-sky-400",        accent: "#0ea5e9" },
  branch:    { Icon: Building2,      iconBg: "bg-violet-100 dark:bg-violet-900/40",  iconText: "text-violet-600 dark:text-violet-400",  accent: "#8b5cf6" },
  clients:   { Icon: Users,          iconBg: "bg-purple-100 dark:bg-purple-900/40",  iconText: "text-purple-600 dark:text-purple-400",  accent: "#a855f7" },
  companies: { Icon: Building2,      iconBg: "bg-violet-100 dark:bg-violet-900/40",  iconText: "text-violet-600 dark:text-violet-400",  accent: "#8b5cf6" },
};

const DEFAULT = {
  Icon: BarChart3,
  iconBg: "bg-bg-muted",
  iconText: "text-text-muted",
  accent: "#94a3b8",
};

type KPIItem = { label: string; value?: string | number; icon?: string; delta?: number };

export const KPI = ({
  data = [],
  children,
  className,
}: {
  data?: KPIItem[];
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full ${className ?? ""}`}>
    {data.map((item, i) => {
      const { Icon, iconBg, iconText, accent } = TYPES[item.icon ?? ""] ?? DEFAULT;
      return (
        <div
          key={i}
          className="bg-bg-surface border border-border rounded-xl shadow-card
                     flex items-center gap-3 px-3 py-3
                     md:flex-col md:items-start md:gap-3 md:p-4"
          style={{ borderLeft: `3px solid ${accent}` }}
        >
          {/* Icon + label */}
          <div className="flex items-center gap-3 md:gap-4 md:w-full">
            <span className={`size-8 md:size-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon size={14} strokeWidth={2.5} className={iconText} />
            </span>
            <span className="text-[10px] md:text-xs font-medium text-text-muted leading-tight truncate">
              {item.label}
            </span>
          </div>
          {/* Value */}
          <div className="flex flex-col min-w-0 flex-1 md:flex-none md:w-full">
            <span className="text-base md:text-2xl font-bold text-text-primary leading-tight tabular-nums mt-0.5">
              {item.value ?? 0}
            </span>
          </div>
          {/* Delta */}
          {item.delta !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${
              item.delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            }`}>
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
