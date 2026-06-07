import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, ChevronDown, RotateCcw } from "lucide-react";
import { useGetClientSaleByIdQuery } from "../../redux/features/clients/clientsSlice.tsx";

const fmt = (v: any) => Number(v || 0).toFixed(2);

// ── Badge ────────────────────────────────────────────────────────────────────

type BadgeColor = "gray" | "rose" | "amber" | "emerald" | "blue" | "purple";
const BADGE_COLORS: Record<BadgeColor, string> = {
  gray:    "bg-bg-muted    text-text-muted   border-border",
  rose:    "bg-rose-50    text-rose-600    border-rose-200    dark:bg-rose-950/40    dark:text-rose-400    dark:border-rose-800",
  amber:   "bg-amber-50   text-amber-600   border-amber-200   dark:bg-amber-950/40   dark:text-amber-400   dark:border-amber-800",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  blue:    "bg-blue-50    text-blue-600    border-blue-200    dark:bg-blue-950/40    dark:text-blue-400    dark:border-blue-800",
  purple:  "bg-purple-50  text-purple-600  border-purple-200  dark:bg-purple-950/40  dark:text-purple-400  dark:border-purple-800",
};

const Badge = ({ children, color = "gray" }: { children: React.ReactNode; color?: BadgeColor }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${BADGE_COLORS[color]}`}>
    {children}
  </span>
);

// ── Payment method badge ──────────────────────────────────────────────────────

const PaymentBadge = ({ method }: { method: string }) => {
  const m = (method || "").toLowerCase();
  const color: BadgeColor = m === "cash" ? "emerald" : m === "mixed" ? "amber" : m === "credit" ? "rose" : "blue";
  return <Badge color={color}>{method}</Badge>;
};

// ── Return History ────────────────────────────────────────────────────────────

const ReturnHistoryBlock = ({ returns }: { returns: any[] }) => {
  const [open, setOpen] = useState(true);
  if (!returns || returns.length === 0) return null;

  return (
    <div className="border border-rose-200 dark:border-rose-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <RotateCcw size={14} className="text-rose-500" />
          <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            Return History ({returns.length})
          </span>
        </div>
        <ChevronDown size={14} className={`text-rose-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="divide-y divide-rose-100 dark:divide-rose-900/40">
          {returns.map((ret: any, idx: number) => (
            <div key={ret.return_id || idx} className="px-4 py-3 bg-bg-surface">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Badge color="rose">Return #{idx + 1}</Badge>
                  {ret.date && (
                    <span className="text-[11px] text-text-muted font-mono">{ret.date}</span>
                  )}
                </div>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  −₼{fmt(ret.total_refunded ?? ret.amount ?? 0)}
                </span>
              </div>
              {ret.reason && (
                <p className="text-xs text-text-secondary italic mb-2.5">"{ret.reason}"</p>
              )}
              {ret.items && ret.items.length > 0 && (
                <div className="rounded-lg border border-rose-200 dark:border-rose-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-rose-50/70 dark:bg-rose-950/30 text-[10px] uppercase tracking-wide text-rose-400">
                        <th className="text-left px-3 py-1.5 font-medium">Product</th>
                        <th className="text-center px-3 py-1.5 font-medium">Qty</th>
                        <th className="text-right px-3 py-1.5 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100 dark:divide-rose-900/30">
                      {ret.items.map((item: any, i: number) => (
                        <tr key={i} className="text-text-secondary">
                          <td className="px-3 py-2">{item.name || item.product_name || "—"}</td>
                          <td className="px-3 py-2 text-center tabular-nums">
                            {Number(item.returned_quantity ?? item.qty ?? item.quantity ?? 1).toFixed(3)}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium text-rose-600 dark:text-rose-400">
                            −₼{fmt(item.refund_amount ?? item.amount ?? 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Payments Table ────────────────────────────────────────────────────────────

const PaymentsTable = ({ payments }: { payments: any[] }) => {
  if (!payments || payments.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-2">
        Payments
      </p>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-subtle text-[11px] uppercase tracking-wide text-text-muted">
              <th className="text-left px-4 py-2 font-medium">#</th>
              <th className="text-left px-4 py-2 font-medium">Method</th>
              <th className="text-right px-4 py-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p: any, i: number) => {
              const method = p.payment_type || p.method || p.type || "payment";
              return (
                <tr key={i} className="bg-bg-surface hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-2.5 text-text-muted text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <PaymentBadge method={method} />
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-text-primary">
                    ₼{fmt(p.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Modal ────────────────────────────────────────────────────────────────

export const SaleDetailsModal = ({
  clientId,
  saleId,
  onClose,
}: {
  clientId: string;
  saleId: string;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const { data, isLoading } = useGetClientSaleByIdQuery(
    { id: clientId, saleId },
    { skip: !saleId }
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(saleId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const totalReturned = (data?.returns || []).reduce(
    (s: number, r: any) => s + Number(r.total_refunded ?? r.amount ?? 0),
    0
  );
  const hasPartialReturn = totalReturned > 0;
  const shortId = "#" + saleId.slice(0, 8);

  // Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface rounded-2xl border border-border shadow-modal w-full max-w-lg flex flex-col max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base font-semibold text-text-primary">
              {data?.type === "return" ? "Return Receipt" : "Sale Receipt"}
            </h2>
            {hasPartialReturn && (
              <Badge color="rose">
                <RotateCcw size={9} /> Partially returned
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !data ? (
            <div className="py-12 text-center text-text-muted text-sm">Sale not found</div>
          ) : (
            <>
              {/* Meta */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Sale ID</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-medium text-text-secondary">{shortId}</span>
                    <button
                      onClick={handleCopy}
                      className="text-text-muted hover:text-text-primary transition-colors"
                      title="Copy ID"
                    >
                      {copied
                        ? <Check size={13} className="text-emerald-500" />
                        : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-1.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Date</p>
                  <p className="text-sm text-text-secondary font-medium">{data.date}</p>
                </div>
              </div>

              {/* Type + payment badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={data.type === "return" ? "rose" : "emerald"}>
                  {data.type}
                </Badge>
                <PaymentBadge method={data.paymentMethod} />
              </div>

              {/* ── Items table ── */}
              {data.items?.length > 0 ? (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-2">
                    Items ({data.items.length})
                  </p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-bg-subtle text-[11px] uppercase tracking-wide text-text-muted">
                          <th className="text-left px-4 py-2.5 font-medium">Product</th>
                          <th className="text-center px-3 py-2.5 font-medium">Price</th>
                          <th className="text-center px-3 py-2.5 font-medium">Qty</th>
                          <th className="text-right px-4 py-2.5 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {data.items.map((item: any, i: number) => {
                          const qty      = Number(item.quantity  ?? item.qty   ?? 1);
                          const price    = Number(item.sell_price ?? item.price ?? 0);
                          const subtotal = Number(item.subtotal   ?? qty * price);
                          const retQty   = Number(item.returned_quantity ?? 0);
                          const isFullReturn    = retQty > 0 && retQty >= qty;
                          const isPartialReturn = retQty > 0 && retQty < qty;

                          return (
                            <tr
                              key={i}
                              className={`transition-colors ${
                                isFullReturn
                                  ? "bg-rose-50/40 dark:bg-rose-950/20"
                                  : "bg-bg-surface hover:bg-bg-subtle/60"
                              }`}
                            >
                              {/* Product */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-medium ${isFullReturn ? "text-text-muted line-through" : "text-text-primary"}`}>
                                    {item.name || item.product_name || "—"}
                                  </span>
                                  {isFullReturn    && <Badge color="rose">Returned</Badge>}
                                  {isPartialReturn && <Badge color="amber">Partial</Badge>}
                                </div>
                                {retQty > 0 && (
                                  <p className="text-[11px] text-rose-400 mt-0.5">
                                    −{retQty.toFixed(3)} returned
                                  </p>
                                )}
                              </td>
                              {/* Price */}
                              <td className={`px-3 py-3 text-center tabular-nums ${isFullReturn ? "text-text-muted" : "text-text-secondary"}`}>
                                ₼{fmt(price)}
                              </td>
                              {/* Qty */}
                              <td className="px-3 py-3 text-center">
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className={`tabular-nums ${isFullReturn ? "text-text-muted line-through" : "text-text-secondary"}`}>
                                    {qty.toFixed(3)}
                                  </span>
                                  {isPartialReturn && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                                      {(qty - retQty).toFixed(3)} left
                                    </span>
                                  )}
                                </div>
                              </td>
                              {/* Total */}
                              <td className="px-4 py-3 text-right">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className={`tabular-nums font-medium ${isFullReturn ? "text-text-muted line-through" : "text-text-primary"}`}>
                                    ₼{fmt(subtotal)}
                                  </span>
                                  {retQty > 0 && (
                                    <span className="text-[10px] text-rose-400 tabular-nums">
                                      −₼{fmt(price * retQty)}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted italic">No item details synced for this sale.</p>
              )}

              {/* ── Return history ── */}
              <ReturnHistoryBlock returns={data.returns} />

              {/* ── Totals ── */}
              <div className="bg-bg-subtle rounded-xl p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₼{fmt(data.subtotal_amount)}</span>
                </div>
                {Number(data.discounted_amount) > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Discount</span>
                    <span className="tabular-nums text-warning">−₼{fmt(data.discounted_amount)}</span>
                  </div>
                )}
                {hasPartialReturn && (
                  <div className="flex justify-between text-rose-500 dark:text-rose-400">
                    <span>Returned</span>
                    <span className="tabular-nums">−₼{fmt(totalReturned)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-text-primary pt-2 border-t border-dashed border-border">
                  <span>Total</span>
                  <span className="tabular-nums text-lg">₼{fmt(data.total_amount)}</span>
                </div>
              </div>

              {/* ── Payments ── */}
              <PaymentsTable payments={data.payments} />
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-3 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
