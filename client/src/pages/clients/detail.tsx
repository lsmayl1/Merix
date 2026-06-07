import React, { useState, useMemo } from "react";
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
import { SaleDetailsModal } from "./SaleDetailsModal.tsx";

const col = createColumnHelper<any>();

const ROLES    = ["admin", "manager", "cashier", "user"];
const STATUSES = ["active", "inactive", "suspended"];
const inputCls = "border border-border rounded-lg px-3 py-2 text-sm focus:border-brand focus:outline-none w-full bg-bg-surface text-text-primary";
const labelCls = "text-xs font-semibold text-text-secondary";

const statusBadge = (v: string) => {
  const c: Record<string, string> = {
    active:    "bg-success-bg text-success-text",
    inactive:  "bg-danger-bg text-danger-text",
    suspended: "bg-warning-bg text-warning-text",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[v] || c.active}`}>{v}</span>;
};

const roleBadge = (v: string) => {
  const c: Record<string, string> = {
    admin:   "bg-[#faf5ff] text-[#7c3aed]",
    manager: "bg-info-bg text-info-text",
    cashier: "bg-success-bg text-success-text",
    user:    "bg-bg-muted text-text-secondary",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[v] || c.user}`}>{v}</span>;
};

const mono    = (v: any) => <span className="font-mono text-xs text-text-secondary">{v ? String(v).slice(0, 8) : "—"}</span>;
const text    = (v: any) => <span className="text-text-secondary text-sm">{v || "—"}</span>;
const money   = (v: any) => <span className="font-medium text-text-primary">{parseFloat(v || 0).toFixed(2)} ₼</span>;
const dateStr = (v: any) => v ? new Date(v).toLocaleDateString("en-GB") : "—";

const TABS = [
  { key: "overview",     label: "Overview" },
  { key: "employees",    label: "Employees" },
  { key: "products",     label: "Products" },
  { key: "sales",        label: "Sales" },
  { key: "transactions", label: "Transactions" },
  { key: "suppliers",    label: "Suppliers" },
  { key: "customers",    label: "Customers" },
  { key: "stock",        label: "Stock Movements" },
  { key: "devices",      label: "Devices" },
  { key: "licenses",     label: "Licenses" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Shared filter helpers ────────────────────────────────────────────────────

const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="relative flex-1 min-w-[160px]">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search…"}
      className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary placeholder:text-text-muted"
    />
  </div>
);

const FilterSelect = ({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="py-1.5 px-3 text-xs border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary"
  >
    <option value="">{placeholder || "All"}</option>
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const ClearBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="px-2.5 py-1.5 text-xs text-text-secondary border border-border rounded-lg hover:bg-bg-muted bg-bg-surface">
    Clear
  </button>
);

const Count = ({ shown, total }: { shown: number; total: number }) => (
  <span className="text-xs text-text-muted ml-auto shrink-0">
    {shown === total ? total : `${shown} / ${total}`}
  </span>
);

// ── Static column definitions ────────────────────────────────────────────────

const productCols = [
  col.accessor("name",    { header: "Product",  cell: ({ getValue }) => <span className="font-medium text-text-primary">{getValue()}</span> }),
  col.accessor("barcode", { header: "Barcode",  cell: ({ getValue }) => text(getValue()) }),
  col.accessor("price",   { header: "Price",    headerClassName: "text-end", cellClassName: "text-end",    cell: ({ getValue }) => money(getValue()) }),
  col.accessor("stock",   { header: "Stock",    headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => <span className="font-medium text-text-primary">{parseFloat(getValue() || 0)}</span> }),
  col.accessor("unit",    { header: "Unit",     headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("isActive",{ header: "Status",   headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue() ? "active" : "inactive") }),
  col.accessor("syncedAt",{ header: "Synced",   headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const transactionCols = [
  col.accessor("id",            { header: "ID",      cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("type",          { header: "Type",    headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("amount",        { header: "Amount",  headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("paymentMethod", { header: "Payment", headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => text(getValue()) }),
  col.accessor("notes",         { header: "Notes",   cell: ({ getValue }) => <span className="text-text-secondary text-xs truncate max-w-[200px] block">{getValue() || "—"}</span> }),
  col.accessor("date",          { header: "Date",    headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const supplierCols = [
  col.accessor("name",    { header: "Supplier", cell: ({ getValue }) => <span className="font-medium text-text-primary">{getValue()}</span> }),
  col.accessor("email",   { header: "Email",    cell: ({ getValue }) => text(getValue()) }),
  col.accessor("phone",   { header: "Phone",    cell: ({ getValue }) => text(getValue()) }),
  col.accessor("balance", { header: "Balance",  headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("syncedAt",{ header: "Synced",   headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const customerCols = [
  col.accessor("name",    { header: "Customer", cell: ({ getValue }) => <span className="font-medium text-text-primary">{getValue()}</span> }),
  col.accessor("email",   { header: "Email",    cell: ({ getValue }) => text(getValue()) }),
  col.accessor("phone",   { header: "Phone",    cell: ({ getValue }) => text(getValue()) }),
  col.accessor("balance", { header: "Balance",  headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("syncedAt",{ header: "Synced",   headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const stockCols = [
  col.accessor("id",        { header: "ID",         cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("productId", { header: "Product ID", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("type",      { header: "Type",       headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("quantity",  { header: "Qty",        headerClassName: "text-center", cellClassName: "text-center font-medium text-text-primary", cell: ({ getValue }) => parseFloat(getValue() || 0) }),
  col.accessor("unitCost",  { header: "Unit Cost",  headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
  col.accessor("date",      { header: "Date",       headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const deviceCols = [
  col.accessor("deviceName",         { header: "Device",      cell: ({ getValue }) => <span className="font-medium text-text-primary">{getValue()}</span> }),
  col.accessor("deviceId",           { header: "Device ID",   cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("machineFingerprint", { header: "Fingerprint", cell: ({ getValue }) => mono(getValue()) }),
  col.accessor("status",             { header: "Status",      headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
  col.accessor("lastSeenAt",         { header: "Last Seen",   headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
  col.accessor("registeredAt",       { header: "Registered",  headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

const licenseCols = [
  col.accessor("licenseKey", { header: "Key",         cell: ({ getValue }) => <span className="font-mono text-sm text-text-primary">{getValue()}</span> }),
  col.accessor("type",       { header: "Type",        headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue() || "—") }),
  col.accessor("status",     { header: "Status",      headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
  col.accessor("maxDevices", { header: "Max Devices", headerClassName: "text-center", cellClassName: "text-center font-medium text-text-primary" }),
  col.accessor("issuedAt",   { header: "Issued",      headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
  col.accessor("expiresAt",  { header: "Expires",     headerClassName: "text-center", cellClassName: "text-center text-xs text-text-secondary", cell: ({ getValue }) => dateStr(getValue()) }),
];

// ── Component ────────────────────────────────────────────────────────────────

export const ClientDetail = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");
  const [page, setPage] = useState(1);

  // Add employee
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", role: "cashier" });
  const [addUserError, setAddUserError] = useState("");
  const [addClientUser, { isLoading: addingUser }] = useAddClientUserMutation();

  // Edit employee
  const [editUser, setEditUser]   = useState<any>(null);
  const [editForm, setEditForm]   = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", role: "", status: "", password: "" });
  const [editError, setEditError] = useState("");
  const [updateClientUser, { isLoading: updatingUser }] = useUpdateClientUserMutation();

  // Sale details modal
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  // ── Filter states ──────────────────────────────────────────────────────────
  const [empSearch,      setEmpSearch]      = useState("");
  const [empRole,        setEmpRole]        = useState("");
  const [productSearch,  setProductSearch]  = useState("");
  const [productUnit,    setProductUnit]    = useState("");
  const [salesFrom,      setSalesFrom]      = useState("");
  const [salesTo,        setSalesTo]        = useState("");
  const [salesPayment,   setSalesPayment]   = useState("");
  const [txType,         setTxType]         = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [stockType,      setStockType]      = useState("");
  const [deviceStatus,   setDeviceStatus]   = useState("");
  const [licenseStatus,  setLicenseStatus]  = useState("");

  // ── API queries ────────────────────────────────────────────────────────────
  const { data: client,         isLoading: clientLoading }    = useGetClientByIdQuery(id!, { pollingInterval: 30000 });
  const { data: salesData,      isLoading: salesLoading }     = useGetClientSalesQuery(
    { id: id!, page, from: salesFrom || undefined, to: salesTo || undefined },
    { skip: tab !== "sales" && tab !== "overview" }
  );
  const { data: products = [],    isLoading: productsLoading }  = useGetClientProductsQuery(id!,  { skip: tab !== "products" });
  const { data: transactions = [], isLoading: txLoading }       = useGetClientTransactionsQuery(id!, { skip: tab !== "transactions" });
  const { data: suppliers = [],   isLoading: suppliersLoading } = useGetClientSuppliersQuery(id!, { skip: tab !== "suppliers" });
  const { data: customers = [],   isLoading: customersLoading } = useGetClientCustomersQuery(id!, { skip: tab !== "customers" });
  const { data: stockMoves = [],  isLoading: stockLoading }     = useGetClientStockMovementsQuery(id!, { skip: tab !== "stock" });
  const { data: devices = [],     isLoading: devicesLoading }   = useGetClientDevicesQuery(id!,   { skip: tab !== "devices" });
  const { data: licenses = [],    isLoading: licensesLoading }  = useGetClientLicensesQuery(id!,  { skip: tab !== "licenses" });

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    const q = empSearch.toLowerCase();
    return (client?.users || []).filter((u: any) => {
      const matchQ = !q || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q);
      const matchR = !empRole || u.role === empRole;
      return matchQ && matchR;
    });
  }, [client?.users, empSearch, empRole]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    return products.filter((p: any) => {
      const matchQ = !q || p.name?.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q);
      const matchU = !productUnit || p.unit === productUnit;
      return matchQ && matchU;
    });
  }, [products, productSearch, productUnit]);

  const filteredSales = useMemo(() =>
    (salesData?.sales || []).filter((s: any) => !salesPayment || s.paymentMethod === salesPayment),
    [salesData?.sales, salesPayment]
  );

  const filteredTransactions = useMemo(() =>
    transactions.filter((t: any) => !txType || t.type === txType),
    [transactions, txType]
  );

  const filteredSuppliers = useMemo(() => {
    const q = supplierSearch.toLowerCase();
    return suppliers.filter((s: any) => !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }, [suppliers, supplierSearch]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase();
    return customers.filter((c: any) => !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q));
  }, [customers, customerSearch]);

  const filteredStock    = useMemo(() => stockMoves.filter((s: any) => !stockType    || s.type   === stockType),    [stockMoves,  stockType]);
  const filteredDevices  = useMemo(() => devices.filter((d: any)    => !deviceStatus || d.status === deviceStatus),  [devices,     deviceStatus]);
  const filteredLicenses = useMemo(() => licenses.filter((l: any)   => !licenseStatus || l.status === licenseStatus), [licenses,   licenseStatus]);

  const openEdit = (user: any) => {
    setEditUser(user);
    setEditForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phoneNumber: user.phoneNumber || "", role: user.role || "cashier", status: user.status || "active", password: "" });
    setEditError("");
  };

  // ── Sales columns (inside component to access setSelectedSaleId) ────────────
  const salesCols = useMemo(() => [
    col.accessor("id",                { header: "Sale ID",  cell: ({ getValue }) => mono(getValue()) }),
    col.accessor("subtotal_amount",   { header: "Subtotal", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => money(getValue()) }),
    col.accessor("discounted_amount", { header: "Discount", headerClassName: "text-end", cellClassName: "text-end", cell: ({ getValue }) => <span className="text-warning font-medium">{parseFloat(getValue() || 0).toFixed(2)} ₼</span> }),
    col.accessor("total_amount",      { header: "Total",    headerClassName: "text-end", cellClassName: "text-end font-semibold", cell: ({ getValue }) => money(getValue()) }),
    col.accessor("paymentMethod", {
      header: "Payment", headerClassName: "text-center", cellClassName: "text-center",
      cell: ({ getValue }) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          getValue() === "cash" ? "bg-success-bg text-success-text" : "bg-info-bg text-info-text"
        }`}>{getValue()}</span>
      ),
    }),
    col.accessor("type", {
      header: "Type", headerClassName: "text-center", cellClassName: "text-center",
      cell: ({ getValue }) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          getValue() === "return" ? "bg-danger-bg text-danger-text" : "bg-success-bg text-success-text"
        }`}>{getValue()}</span>
      ),
    }),
    col.accessor("date", { header: "Date", headerClassName: "text-center", cellClassName: "text-center text-text-secondary text-xs" }),
    col.display({
      id: "details",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedSaleId((row.original as any).id)}
          className="text-xs text-brand hover:underline whitespace-nowrap"
        >
          Details
        </button>
      ),
    }),
  ], []);

  const employeeCols = useMemo(() => [
    col.accessor("firstName", { header: "Name",        cell: ({ row }) => <span className="font-medium text-text-primary">{row.original.firstName} {row.original.lastName}</span> }),
    col.accessor("email",       { header: "Email",     cell: ({ getValue }) => text(getValue()) }),
    col.accessor("phoneNumber", { header: "Phone",     cell: ({ getValue }) => text(getValue()) }),
    col.accessor("role",        { header: "Role",      headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => roleBadge(getValue()) }),
    col.accessor("status",      { header: "Status",    headerClassName: "text-center", cellClassName: "text-center", cell: ({ getValue }) => statusBadge(getValue()) }),
    col.accessor("id", {
      header: "", headerClassName: "text-center", cellClassName: "text-center",
      cell: ({ row }) => (
        <button onClick={() => openEdit(row.original)} className="text-xs text-text-secondary hover:text-text-primary hover:underline">Edit</button>
      ),
    }),
  ], []);

  if (clientLoading) return <div className="flex items-center justify-center h-full text-text-secondary">Loading…</div>;
  if (!client)       return <div className="flex items-center justify-center h-full text-text-secondary">Company not found.</div>;

  const summary = client.summary || {};

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/companies")}
          className="size-8 flex items-center justify-center rounded-lg border border-border hover:bg-bg-muted text-text-secondary transition-colors"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{client.name}</h1>
          <p className="text-sm text-text-secondary">
            {client.email || ""}{client.email && client.phone ? " · " : ""}{client.phone || ""}
          </p>
        </div>
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
          client.status === "active" ? "bg-success-bg text-success-text" : "bg-danger-bg text-danger-text"
        }`}>
          {client.status}
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-bg-surface border border-border rounded-lg p-1 overflow-x-auto shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); if (t.key === "sales") setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? "bg-brand text-white" : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
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
                <div key={kpi.label} className="bg-bg-surface border border-border rounded-lg p-4">
                  <p className="text-xs text-text-secondary mb-1">{kpi.label}</p>
                  <p className="text-xl font-semibold text-text-primary">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Sales</h2>
              <Table columns={salesCols} data={salesData?.sales?.slice(0, 5) || []} isLoading={salesLoading} />
            </div>
          </>
        )}

        {/* ── Employees ── */}
        {tab === "employees" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Employees ({client.users?.length ?? 0})</h2>
              <button onClick={() => setShowAddUser(true)} className="px-3 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-medium rounded-lg transition-colors">
                + Add Employee
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SearchInput value={empSearch} onChange={setEmpSearch} placeholder="Search by name or email…" />
              <FilterSelect value={empRole} onChange={setEmpRole} placeholder="All roles" options={ROLES.map((r) => ({ value: r, label: r }))} />
              {(empSearch || empRole) && <ClearBtn onClick={() => { setEmpSearch(""); setEmpRole(""); }} />}
              <Count shown={filteredEmployees.length} total={client.users?.length ?? 0} />
            </div>
            <Table columns={employeeCols} data={filteredEmployees} isLoading={false} />
          </div>
        )}

        {/* ── Products ── */}
        {tab === "products" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Products ({products.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SearchInput value={productSearch} onChange={setProductSearch} placeholder="Search by name or barcode…" />
              <FilterSelect value={productUnit} onChange={setProductUnit} placeholder="All units" options={[{ value: "piece", label: "Piece" }, { value: "kg", label: "kg" }]} />
              {(productSearch || productUnit) && <ClearBtn onClick={() => { setProductSearch(""); setProductUnit(""); }} />}
              <Count shown={filteredProducts.length} total={products.length} />
            </div>
            <Table columns={productCols} data={filteredProducts} isLoading={productsLoading} />
          </div>
        )}

        {/* ── Sales ── */}
        {tab === "sales" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-sm font-semibold text-text-primary">
                Sales
                {salesData?.total !== undefined && (
                  <span className="ml-1 text-xs text-text-secondary font-normal">{salesData.total} total</span>
                )}
              </h2>
              {/* Date range */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-muted">From</span>
                <input
                  type="date"
                  value={salesFrom}
                  onChange={(e) => { setSalesFrom(e.target.value); setPage(1); }}
                  className="py-1.5 px-2 text-xs border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary"
                />
                <span className="text-xs text-text-muted">To</span>
                <input
                  type="date"
                  value={salesTo}
                  onChange={(e) => { setSalesTo(e.target.value); setPage(1); }}
                  className="py-1.5 px-2 text-xs border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary"
                />
              </div>
              {/* Payment filter */}
              <div className="ml-auto flex items-center gap-2">
                <FilterSelect
                  value={salesPayment} onChange={setSalesPayment} placeholder="All payments"
                  options={[{ value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "credit", label: "Credit" }, { value: "mixed", label: "Mixed" }]}
                />
                {(salesPayment || salesFrom || salesTo) && (
                  <ClearBtn onClick={() => { setSalesPayment(""); setSalesFrom(""); setSalesTo(""); setPage(1); }} />
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <Table columns={salesCols} data={filteredSales} isLoading={salesLoading} />
            </div>
            {salesData?.pageCount > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted disabled:opacity-40">Prev</button>
                <span className="text-sm text-text-secondary">{page} / {salesData.pageCount}</span>
                <button onClick={() => setPage((p) => Math.min(salesData.pageCount, p + 1))} disabled={page === salesData.pageCount} className="px-3 py-1 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        )}

        {/* ── Transactions ── */}
        {tab === "transactions" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Transactions ({transactions.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <FilterSelect value={txType} onChange={setTxType} placeholder="All types" options={[{ value: "income", label: "Income" }, { value: "expense", label: "Expense" }]} />
              {txType && <ClearBtn onClick={() => setTxType("")} />}
              <Count shown={filteredTransactions.length} total={transactions.length} />
            </div>
            <Table columns={transactionCols} data={filteredTransactions} isLoading={txLoading} />
          </div>
        )}

        {/* ── Suppliers ── */}
        {tab === "suppliers" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Suppliers ({suppliers.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SearchInput value={supplierSearch} onChange={setSupplierSearch} placeholder="Search by name or email…" />
              {supplierSearch && <ClearBtn onClick={() => setSupplierSearch("")} />}
              <Count shown={filteredSuppliers.length} total={suppliers.length} />
            </div>
            <Table columns={supplierCols} data={filteredSuppliers} isLoading={suppliersLoading} />
          </div>
        )}

        {/* ── Customers ── */}
        {tab === "customers" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Customers ({customers.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <SearchInput value={customerSearch} onChange={setCustomerSearch} placeholder="Search by name or email…" />
              {customerSearch && <ClearBtn onClick={() => setCustomerSearch("")} />}
              <Count shown={filteredCustomers.length} total={customers.length} />
            </div>
            <Table columns={customerCols} data={filteredCustomers} isLoading={customersLoading} />
          </div>
        )}

        {/* ── Stock Movements ── */}
        {tab === "stock" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Stock Movements ({stockMoves.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <FilterSelect value={stockType} onChange={setStockType} placeholder="All types" options={[{ value: "in", label: "In" }, { value: "out", label: "Out" }, { value: "adjustment", label: "Adjustment" }, { value: "return", label: "Return" }]} />
              {stockType && <ClearBtn onClick={() => setStockType("")} />}
              <Count shown={filteredStock.length} total={stockMoves.length} />
            </div>
            <Table columns={stockCols} data={filteredStock} isLoading={stockLoading} />
          </div>
        )}

        {/* ── Devices ── */}
        {tab === "devices" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Devices ({devices.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <FilterSelect value={deviceStatus} onChange={setDeviceStatus} placeholder="All statuses" options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "suspended", label: "Suspended" }]} />
              {deviceStatus && <ClearBtn onClick={() => setDeviceStatus("")} />}
              <Count shown={filteredDevices.length} total={devices.length} />
            </div>
            <Table columns={deviceCols} data={filteredDevices} isLoading={devicesLoading} />
          </div>
        )}

        {/* ── Licenses ── */}
        {tab === "licenses" && (
          <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Licenses ({licenses.length})</h2>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <FilterSelect value={licenseStatus} onChange={setLicenseStatus} placeholder="All statuses" options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "suspended", label: "Suspended" }]} />
              {licenseStatus && <ClearBtn onClick={() => setLicenseStatus("")} />}
              <Count shown={filteredLicenses.length} total={licenses.length} />
            </div>
            <Table columns={licenseCols} data={filteredLicenses} isLoading={licensesLoading} />
          </div>
        )}
      </div>

      {/* ── Add Employee Modal ── */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-modal border border-border p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Add Employee</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault(); setAddUserError("");
                try {
                  await addClientUser({ clientId: id!, ...addUserForm }).unwrap();
                  setShowAddUser(false);
                  setAddUserForm({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "", role: "cashier" });
                } catch (err: any) { setAddUserError(err?.data?.error || "Failed to create employee"); }
              }}
              className="flex flex-col gap-3"
            >
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
              {addUserError && <p className="text-xs text-danger-text bg-danger-bg border border-danger rounded-lg px-3 py-2">{addUserError}</p>}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted">Cancel</button>
                <button type="submit" disabled={addingUser} className="flex-1 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover disabled:opacity-60">{addingUser ? "Creating…" : "Create Employee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Employee Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-modal border border-border p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Edit Employee</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault(); setEditError("");
                try {
                  const payload: Record<string, any> = { clientId: id!, userId: editUser.id, firstName: editForm.firstName, lastName: editForm.lastName, email: editForm.email, phoneNumber: editForm.phoneNumber, role: editForm.role, status: editForm.status };
                  if (editForm.password) payload.password = editForm.password;
                  await updateClientUser(payload).unwrap();
                  setEditUser(null);
                } catch (err: any) { setEditError(err?.data?.error || "Failed to update employee"); }
              }}
              className="flex flex-col gap-3"
            >
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
              <div className="flex flex-col gap-1">
                <label className={labelCls}>New Password <span className="font-normal text-text-muted">(leave blank to keep current)</span></label>
                <input type="password" value={editForm.password} onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" className={inputCls} />
              </div>
              {editError && <p className="text-xs text-danger-text bg-danger-bg border border-danger rounded-lg px-3 py-2">{editError}</p>}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setEditUser(null)} className="flex-1 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted">Cancel</button>
                <button type="submit" disabled={updatingUser} className="flex-1 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover disabled:opacity-60">{updatingUser ? "Saving…" : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sale Details Modal ── */}
      {selectedSaleId && (
        <SaleDetailsModal
          clientId={id!}
          saleId={selectedSaleId}
          onClose={() => setSelectedSaleId(null)}
        />
      )}
    </div>
  );
};
