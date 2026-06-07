import React, { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  useGetClientsQuery,
  useSetupClientMutation,
  useToggleClientStatusMutation,
} from "../../redux/features/clients/clientsSlice.tsx";
import { Table } from "../../components/metrics/table/index.tsx";

const columnHelper = createColumnHelper<any>();

const emptyCompany = { name: "", email: "", phone: "", address: "" };
const emptyOwner   = { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" };

const inputCls = "border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand bg-bg-surface text-text-primary w-full";
const labelCls = "text-xs font-semibold text-text-secondary";

export const Clients = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading } = useGetClientsQuery(undefined, { pollingInterval: 30000 });
  const [setupClient, { isLoading: isCreating }] = useSetupClientMutation();
  const [toggleStatus] = useToggleClientStatusMutation();

  const [showAdd, setShowAdd]   = useState(false);
  const [step, setStep]         = useState<1 | 2>(1);
  const [company, setCompany]   = useState(emptyCompany);
  const [owner, setOwner]       = useState(emptyOwner);
  const [error, setError]       = useState("");

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredClients = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c: any) => {
      const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [clients, search, statusFilter]);

  const resetModal = () => {
    setShowAdd(false);
    setStep(1);
    setCompany(emptyCompany);
    setOwner(emptyOwner);
    setError("");
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(2);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (owner.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (owner.password !== owner.confirmPassword) { setError("Passwords do not match."); return; }

    try {
      const result = await setupClient({
        companyName:    company.name,
        companyEmail:   company.email || undefined,
        companyPhone:   company.phone || undefined,
        companyAddress: company.address || undefined,
        firstName:      owner.firstName,
        lastName:       owner.lastName,
        email:          owner.email,
        phoneNumber:    owner.phone || undefined,
        password:       owner.password,
      }).unwrap();
      resetModal();
      navigate(`/companies/${result.client.id}`);
    } catch (err: any) {
      setError(err?.data?.error || "Something went wrong. Please try again.");
    }
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Company",
      headerClassName: "text-start",
      cell: ({ getValue, row }) => (
        <button onClick={() => navigate(`/companies/${row.original.id}`)} className="font-medium text-text-primary hover:underline text-start">
          {getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      headerClassName: "text-start",
      cell: ({ getValue }) => <span className="text-text-secondary">{getValue() || "—"}</span>,
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      headerClassName: "text-start",
      cell: ({ getValue }) => <span className="text-text-secondary">{getValue() || "—"}</span>,
    }),
    columnHelper.accessor("userCount",    { header: "Employees", headerClassName: "text-center", cellClassName: "text-center" }),
    columnHelper.accessor("totalSales",   { header: "Total Sales", headerClassName: "text-center", cellClassName: "text-center font-medium" }),
    columnHelper.accessor("totalRevenue", {
      header: "Revenue",
      headerClassName: "text-end",
      cellClassName: "text-end font-semibold",
      cell: ({ getValue }) => <span>{getValue()} ₼</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      headerClassName: "text-center",
      cellClassName: "text-center",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => toggleStatus(row.original.id)}
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            getValue() === "active" ? "bg-success-bg text-success-text" : "bg-danger-bg text-danger-text"
          }`}
        >
          {getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("id", {
      header: "",
      headerClassName: "text-center",
      cellClassName: "text-center",
      cell: ({ row }) => (
        <button onClick={() => navigate(`/companies/${row.original.id}`)} className="text-xs text-text-secondary hover:text-text-primary hover:underline">
          View →
        </button>
      ),
    }),
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Companies</h1>
          <p className="text-sm text-text-secondary">{clients.length} registered companies</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Company
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Companies", value: clients.length },
          { label: "Active", value: clients.filter((c: any) => c.status === "active").length },
          { label: "Total Revenue", value: clients.reduce((s: number, c: any) => s + parseFloat(c.totalRevenue || 0), 0).toFixed(2) + " ₼" },
          { label: "Total Sales",   value: clients.reduce((s: number, c: any) => s + (c.totalSales || 0), 0) },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-bg-surface border border-border rounded-lg p-4">
            <p className="text-xs text-text-secondary mb-1">{kpi.label}</p>
            <p className="text-xl font-semibold text-text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary placeholder:text-text-muted"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 text-sm border border-border rounded-lg focus:outline-none focus:border-brand bg-bg-surface text-text-primary"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setStatusFilter(""); }}
            className="px-3 py-2 text-xs text-text-secondary border border-border rounded-lg hover:bg-bg-muted bg-bg-surface"
          >
            Clear
          </button>
        )}
        <span className="text-xs text-text-muted ml-auto">
          {filteredClients.length} of {clients.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border rounded-lg p-4 flex-1 min-h-0 overflow-auto">
        <Table columns={columns} data={filteredClients} isLoading={isLoading} />
      </div>

      {/* Create Company + Owner modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-surface rounded-xl shadow-modal border border-border p-6 w-full max-w-md">

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`flex items-center justify-center size-6 rounded-full text-xs font-semibold ${step === 1 ? "bg-brand text-white" : "bg-bg-muted text-text-secondary"}`}>1</div>
              <span className={`text-xs font-medium ${step === 1 ? "text-text-primary" : "text-text-muted"}`}>Company</span>
              <div className="flex-1 h-px bg-border" />
              <div className={`flex items-center justify-center size-6 rounded-full text-xs font-semibold ${step === 2 ? "bg-brand text-white" : "bg-bg-muted text-text-secondary"}`}>2</div>
              <span className={`text-xs font-medium ${step === 2 ? "text-text-primary" : "text-text-muted"}`}>Owner</span>
            </div>

            {/* Step 1 — Company */}
            {step === 1 && (
              <form onSubmit={handleNext} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-text-primary mb-1">Company Details</h2>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Name *</label>
                  <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className={inputCls} placeholder="Business name" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Email</label>
                  <input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className={inputCls} placeholder="contact@business.com" type="email" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Phone</label>
                  <input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className={inputCls} placeholder="+994 50 000 00 00" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Address</label>
                  <input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className={inputCls} placeholder="123 Main St" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={resetModal} className="flex-1 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover">Next →</button>
                </div>
              </form>
            )}

            {/* Step 2 — Owner */}
            {step === 2 && (
              <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-text-primary mb-1">Owner Details</h2>
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className={labelCls}>First Name *</label>
                    <input value={owner.firstName} onChange={(e) => setOwner({ ...owner, firstName: e.target.value })} className={inputCls} placeholder="John" required />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className={labelCls}>Last Name *</label>
                    <input value={owner.lastName} onChange={(e) => setOwner({ ...owner, lastName: e.target.value })} className={inputCls} placeholder="Smith" required />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Email *</label>
                  <input value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} className={inputCls} placeholder="owner@business.com" type="email" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Phone</label>
                  <input value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value })} className={inputCls} placeholder="+994 50 000 00 00" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Password *</label>
                  <input value={owner.password} onChange={(e) => setOwner({ ...owner, password: e.target.value })} className={inputCls} placeholder="Min. 6 characters" type="password" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Confirm Password *</label>
                  <input value={owner.confirmPassword} onChange={(e) => setOwner({ ...owner, confirmPassword: e.target.value })} className={inputCls} placeholder="Repeat password" type="password" required />
                </div>
                {error && (
                  <p className="text-xs text-danger-text bg-danger-bg border border-danger rounded-lg px-3 py-2">{error}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => { setStep(1); setError(""); }} className="flex-1 py-2 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-muted">← Back</button>
                  <button type="submit" disabled={isCreating} className="flex-1 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover disabled:opacity-50">
                    {isCreating ? "Creating…" : "Create"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
