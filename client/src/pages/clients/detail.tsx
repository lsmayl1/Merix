import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import {
  useGetClientByIdQuery,
  useGetClientSalesQuery,
  useAddClientUserMutation,
  useUpdateClientUserMutation,
  useGetClientProductsQuery,
  useGetClientTransactionsQuery,
  useGetClientSuppliersQuery,
  useGetClientCustomersQuery,
  useGetClientStockMovementsQuery,
  useGetClientDevicesQuery,
  useGetClientLicensesQuery,
} from "../../redux/features/clients/clientsSlice.tsx";
import { Table } from "../../components/metrics/table/index.tsx";

const col = createColumnHelper<any>();

const ROLES = ["admin", "manager", "cashier", "user"];
const STATUSES = ["active", "inactive", "suspended"];
const inputCls = "border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:border-[#0f172a] focus:outline-none w-full";
const labelCls = "text-xs font-semibold text-[#64748b]";

const statusBadge = (v: string) => {
  const c: Record<string, string> = { active: "bg-[#f0fdf4] text-[#166534]", inactive: "bg-[#fef2f2] text-[#991b1b]", suspended: "bg-[#fefce8] text-[#854d0e]" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[v] || c.active}`}>{v}</span>;
};
const roleBadge = (v: string) => {
  const c: Record<string, string> = { admin: "bg-[#faf5ff] text-[#7c3aed]", manager: "bg-[#eff6ff] text-[#1d4ed8]", cashier: "bg-[#f0fdf4] text-[#166534]", user: "bg-[#f1f5f9] text-[#64748b]" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[v] || c.user}`}>{v}</span>;
};
const mono = (v: any) => <span className="font-mono text-xs text-[#64748b]">{v ? String(v).slice(0, 8) : "—"}</span>;
const text = (v: any) => <span className="text-[#64748b] text-sm">{v || "—"}</span>;
const money = (v: any) => <span className="font-medium">{parseFloat(v || 0).toFixed(2)} ₼</span>;
const dateStr = (v: any) => v ? new Date(v).toLocaleDateString("en-GB") : "—";

const TABS = [
  { key: "overview",   label: "Overview" },
  { key: "employees",  label: "Employees" },
  { key: "products",   label: "Products" },
  { key: "sales",      label: "Sales" },
  { key: "transactions", label: "Transactions" },
  { key: "suppliers",  label: "Suppliers" },
  { key: "customers",  label: "Customers" },
  { key: "stock",      label: "Stock Movements" },
  { key: "devices",    label: "Devices" },
  { key: "licenses",   label: "Licenses" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Column definitions ──────────────────────────────────────────────────────

const productCols = [
  col.accessor("name",    { header: "Product", cell: ({ getValue }) => <span className="font-medium text-[#0f172a]">{getValue()}</span> }),
  col.accessor("barcode", { header: "Barcode", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("price",   { header: "Price", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("stock",   { header: "Stock", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => <span className="font-medium">{parseFloat(getValue() || 0)}</span> }),
  col.accessor("unit",    { header: "Unit", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("isActive", { header: "Status", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue() ? "active" : "inactive") }),
  col.accessor("syncedAt", { header: "Synced", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const transactionCols = [
  col.accessor("id",            { header: "ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("type",          { header: "Type", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("amount",        { header: "Amount", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("paymentMethod", { header: "Payment", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("notes",         { header: "Notes", cell: ({ getValue }) => <span className="text-[#64748b] text-xs truncate max-w-[200px] block">{getValue() || "—"}</span> }),
  col.accessor("date",          { header: "Date", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const supplierCols = [
  col.accessor("name",    { header: "Supplier", cell: ({ getValue }) => <span className="font-medium text-[#0f172a]">{getValue()}</span> }),
  col.accessor("email",   { header: "Email", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("phone",   { header: "Phone", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("balance", { header: "Balance", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("syncedAt", { header: "Synced", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const customerCols = [
  col.accessor("name",    { header: "Customer", cell: ({ getValue }) => <span className="font-medium text-[#0f172a]">{getValue()}</span> }),
  col.accessor("email",   { header: "Email", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("phone",   { header: "Phone", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("balance", { header: "Balance", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("syncedAt", { header: "Synced", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const stockCols = [
  col.accessor("id",        { header: "ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("productId", { header: "Product ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("type",      { header: "Type", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("quantity",  { header: "Qty", headerClassName: "text-center", cellClassName: "text-center font-medium", cell: ({ getValue }) => parseFloat(getValue() || 0) }),
  col.accessor("unitCost",  { header: "Unit Cost", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("date",      { header: "Date", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const deviceCols = [
  col.accessor("deviceName",         { header: "Device", cell: ({ getValue }) => <span className="font-medium text-[#0f172a]">{getValue()}</span> }),
  col.accessor("deviceId",           { header: "Device ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("machineFingerprint", { header: "Fingerprint", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("status",             { header: "Status", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
  col.accessor("lastSeenAt",         { header: "Last Seen", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
  col.accessor("registeredAt",       { header: "Registered", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const licenseCols = [
  col.accessor("licenseKey", { header: "Key", cell: ({ getValue }) => <span className="font-mono text-sm text-[#0f172a]">{getValue()}</span> }),
  col.accessor("type",       { header: "Type", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("status",     { header: "Status", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
  col.accessor("maxDevices", { header: "Max Devices", headerClassName: "text-center", cellClassName: "text-center font-medium" }),
  col.accessor("issuedAt",   { header: "Issued", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
  col.accessor("expiresAt",  { header: "Expires", headerClassName: "text-center", cellClassName: "text-center text-xs text-[#64748b]", cell: ({ getValue }) => dateStr(getValue()) }),
];

const salesCols = [
  col.accessor("id", { header: "Sale ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("subtotal_amount",  { header: "Subtotal", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("discounted_amount", { header: "Discount", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => <span className="text-[#f59e0b]">{money(getValue())}</span> }),
  col.accessor("total_amount",     { header: "Total", headerClassName: "text-end", cellClassName: "text-end font-semibold", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("paymentMethod", { header: "Payment", headerClassName: "text-center", cellClassName: "text-center",
    cell: ({ getValue }) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getValue() === "cash" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#eff6ff] text-[#1d4ed8]"}`}>{getValue()}</span>,
  }),
  col.accessor("type", { header: "Type", headerClassName: "text-center", cellClassName: "text-center",
    cell: ({ getValue }) => <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getValue() === "return" ? "bg-[#fef2f2] text-[#991b1b]" : "bg-[#f0fdf4] text-[#166534]"}`}>{getValue()}</span>,
  }),
  col.accessor("date", { header: "Date", headerClassName: "text-center", cellClassName: "text-center text-[#64748b] text-xs" }),
];

const employeeCols = (onEdit: (u: any) => void) => [
  col.accessor("firstName", { header: "Name", cell: ({ row }) => <span className="font-medium text-[#0f172a]">{row.original.firstName} {row.original.lastName}</span> }),
  col.accessor("email",       { header: "Email", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("phoneNumber", { header: "Phone", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("role",        { header: "Role", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue()) }),
  col.accessor("status",      { header: "Status", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
  col.accessor("id", { header: "", headerClassName: "text-center", cellClassName: "text-center",
    cell: ({ row }) => <button onClick={() => onEdit(row.original)} className="text-xs text-[#64748b] hover:text-[#0f172a] hover:underline">Edit</button>,
  }),
];

// ── Component ───────────────────────────────────────────────────────────────

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");
  const [page, setPage] = useState(1);

  // Add employee
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", role: "cashier" });
  const [addUserError, setAddUserError] = useState("");
  const [addClientUser, { isLoading: addingUser }] = useAddClientUserMutation();

  // Edit employee
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", role: "", status: "", password: "" });
  const [editError, setEditError] = useState("");
  const [updateClientUser, { isLoading: updatingUser }] = useUpdateClientUserMutation();

  const { data: client, isLoading: clientLoading } = useGetClientByIdQuery(id!, { pollingInterval: 30000 });
  const { data: salesData, isLoading: salesLoading } = useGetClientSalesQuery({ id: id!, page }, { skip: tab !== "sales" && tab !== "overview" });
  const { data: products = [],   isLoading: productsLoading }   = useGetClientProductsQuery(id!,  { skip: tab !== "products" });
  const { data: transactions = [], isLoading: txLoading }       = useGetClientTransactionsQuery(id!, { skip: tab !== "transactions" });
  const { data: suppliers = [],  isLoading: suppliersLoading }  = useGetClientSuppliersQuery(id!, { skip: tab !== "suppliers" });
  const { data: customers = [],  isLoading: customersLoading }  = useGetClientCustomersQuery(id!, { skip: tab !== "customers" });
  const { data: stockMoves = [], isLoading: stockLoading }      = useGetClientStockMovementsQuery(id!, { skip: tab !== "stock" });
  const { data: devices = [],    isLoading: devicesLoading }    = useGetClientDevicesQuery(id!,   { skip: tab !== "devices" });
  const { data: licenses = [],   isLoading: licensesLoading }   = useGetClientLicensesQuery(id!,  { skip: tab !== "licenses" });

  const openEdit = (user: any) => {
    setEditUser(user);
    setEditForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phoneNumber: user.phoneNumber || "", role: user.role || "cashier", status: user.status || "active", password: "" });
    setEditError("");
  };

  if (clientLoading) return <div className="flex items-center justify-center h-full text-[#64748b]">Loading...</div>;
  if (!client) return <div className="flex items-center justify-center h-full text-[#64748b]">Company not found.</div>;

  const summary = client.summary || {};

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/companies")} className="size-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] text-[#64748b]">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#0f172a]">{client.name}</h1>
          <p className="text-sm text-[#64748b]">
            {client.email || ""}{client.email && client.phone ? " · " : ""}{client.phone || ""}
          </p>
        </div>
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${client.status === "active" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fef2f2] text-[#991b1b]"}`}>
          {client.status}
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-white border border-[#e2e8f0] rounded-lg p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); if (t.key === "sales") setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Employees",   value: client.users?.length ?? 0 },
                { label: "Total Sales", value: summary.totalSales ?? 0 },
                { label: "Revenue",     value: (summary.totalRevenue ?? "0.00") + " ₼" },
                { label: "Cash",        value: (summary.totalCash ?? "0.00") + " ₼" },
                { label: "Returns",     value: summary.returnSales ?? 0 },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-[#e2e8f0] rounded-lg p-4">
                  <p className="text-xs text-[#64748b] mb-1">{kpi.label}</p>
                  <p className="text-xl font-semibold text-[#0f172a]">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
              <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Recent Sales</h2>
              <Table columns={salesCols} data={salesData?.sales?.slice(0, 5) || []} isLoading={salesLoading} />
            </div>
          </>
        )}

        {/* ── Employees ── */}
        {tab === "employees" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#0f172a]">Employees ({client.users?.length ?? 0})</h2>
              <button onClick={() => setShowAddUser(true)} className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg transition-colors">+ Add Employee</button>
            </div>
            {client.users?.length > 0
              ? <Table columns={employeeCols(openEdit)} data={client.users} isLoading={false} />
              : <p className="text-sm text-[#94a3b8]">No employees yet.</p>}
          </div>
        )}

        {/* ── Products ── */}
        {tab === "products" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Products ({products.length})</h2>
            <Table columns={productCols} data={products} isLoading={productsLoading} />
          </div>
        )}

        {/* ── Sales ── */}
        {tab === "sales" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#0f172a]">
              Sales {salesData?.total !== undefined && <span className="ml-1 text-xs text-[#64748b] font-normal">{salesData.total} total</span>}
            </h2>
            <div className="flex-1 min-h-0 overflow-auto">
              <Table columns={salesCols} data={salesData?.sales || []} isLoading={salesLoading} />
            </div>
            {salesData?.pageCount > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40">Prev</button>
                <span className="text-sm text-[#64748b]">{page} / {salesData.pageCount}</span>
                <button onClick={() => setPage((p) => Math.min(salesData.pageCount, p + 1))} disabled={page === salesData.pageCount} className="px-3 py-1 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        )}

        {/* ── Transactions ── */}
        {tab === "transactions" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Transactions ({transactions.length})</h2>
            <Table columns={transactionCols} data={transactions} isLoading={txLoading} />
          </div>
        )}

        {/* ── Suppliers ── */}
        {tab === "suppliers" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Suppliers ({suppliers.length})</h2>
            <Table columns={supplierCols} data={suppliers} isLoading={suppliersLoading} />
          </div>
        )}

        {/* ── Customers ── */}
        {tab === "customers" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Customers ({customers.length})</h2>
            <Table columns={customerCols} data={customers} isLoading={customersLoading} />
          </div>
        )}

        {/* ── Stock Movements ── */}
        {tab === "stock" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Stock Movements ({stockMoves.length})</h2>
            <Table columns={stockCols} data={stockMoves} isLoading={stockLoading} />
          </div>
        )}

        {/* ── Devices ── */}
        {tab === "devices" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Devices ({devices.length})</h2>
            <Table columns={deviceCols} data={devices} isLoading={devicesLoading} />
          </div>
        )}

        {/* ── Licenses ── */}
        {tab === "licenses" && (
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-3">Licenses ({licenses.length})</h2>
            <Table columns={licenseCols} data={licenses} isLoading={licensesLoading} />
          </div>
        )}
      </div>

      {/* ── Add Employee Modal ── */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Add Employee</h2>
            <form onSubmit={async (e) => {
              e.preventDefault(); setAddUserError("");
              try { await addClientUser({ clientId: id!, ...addUserForm }).unwrap(); setShowAddUser(false); setAddUserForm({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", role: "cashier" }); }
              catch (err: any) { setAddUserError(err?.data?.error || "Failed to create employee"); }
            }} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelCls}>First Name *</label><input value={addUserForm.firstName} onChange={(e) => setAddUserForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="John" className={inputCls} required /></div>
                <div className="flex flex-col gap-1"><label className={labelCls}>Last Name *</label><input value={addUserForm.lastName} onChange={(e) => setAddUserForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Doe" className={inputCls} required /></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelCls}>Email *</label><input type="email" value={addUserForm.email} onChange={(e) => setAddUserForm((p) => ({ ...p, email: e.target.value }))} placeholder="john@company.com" className={inputCls} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelCls}>Phone</label><input value={addUserForm.phoneNumber} onChange={(e) => setAddUserForm((p) => ({ ...p, phoneNumber: e.target.value }))} placeholder="+994 50 000 00 00" className={inputCls} /></div>
                <div className="flex flex-col gap-1"><label className={labelCls}>Role</label><select value={addUserForm.role} onChange={(e) => setAddUserForm((p) => ({ ...p, role: e.target.value }))} className={inputCls}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelCls}>Password *</label><input type="password" value={addUserForm.password} onChange={(e) => setAddUserForm((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" className={inputCls} required /></div>
              {addUserError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{addUserError}</p>}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]">Cancel</button>
                <button type="submit" disabled={addingUser} className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b] disabled:opacity-60">{addingUser ? "Creating..." : "Create Employee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Employee Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Edit Employee</h2>
            <form onSubmit={async (e) => {
              e.preventDefault(); setEditError("");
              try {
                const payload: Record<string, any> = { clientId: id!, userId: editUser.id, firstName: editForm.firstName, lastName: editForm.lastName, email: editForm.email, phoneNumber: editForm.phoneNumber, role: editForm.role, status: editForm.status };
                if (editForm.password) payload.password = editForm.password;
                await updateClientUser(payload).unwrap(); setEditUser(null);
              } catch (err: any) { setEditError(err?.data?.error || "Failed to update employee"); }
            }} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelCls}>First Name *</label><input value={editForm.firstName} onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))} className={inputCls} required /></div>
                <div className="flex flex-col gap-1"><label className={labelCls}>Last Name *</label><input value={editForm.lastName} onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))} className={inputCls} required /></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelCls}>Email *</label><input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className={inputCls} required /></div>
              <div className="flex flex-col gap-1"><label className={labelCls}>Phone</label><input value={editForm.phoneNumber} onChange={(e) => setEditForm((p) => ({ ...p, phoneNumber: e.target.value }))} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelCls}>Role</label><select value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))} className={inputCls}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                <div className="flex flex-col gap-1"><label className={labelCls}>Status</label><select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} className={inputCls}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelCls}>New Password <span className="font-normal text-[#94a3b8]">(leave blank to keep current)</span></label><input type="password" value={editForm.password} onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" className={inputCls} /></div>
              {editError && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{editError}</p>}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setEditUser(null)} className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]">Cancel</button>
                <button type="submit" disabled={updatingUser} className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b] disabled:opacity-60">{updatingUser ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
