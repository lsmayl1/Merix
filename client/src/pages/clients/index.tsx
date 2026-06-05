import React, { useState } from "react";
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
        <button
          onClick={() => navigate(`/companies/${row.original.id}`)}
          className="font-medium text-[#0f172a] hover:underline text-start"
        >
          {getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      headerClassName: "text-start",
      cell: ({ getValue }) => <span className="text-[#64748b]">{getValue() || "—"}</span>,
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      headerClassName: "text-start",
      cell: ({ getValue }) => <span className="text-[#64748b]">{getValue() || "—"}</span>,
    }),
    columnHelper.accessor("userCount", {
      header: "Employees",
      headerClassName: "text-center",
      cellClassName: "text-center",
    }),
    columnHelper.accessor("totalSales", {
      header: "Total Sales",
      headerClassName: "text-center",
      cellClassName: "text-center font-medium",
    }),
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
            getValue() === "active"
              ? "bg-[#f0fdf4] text-[#166534]"
              : "bg-[#fef2f2] text-[#991b1b]"
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
        <button
          onClick={() => navigate(`/companies/${row.original.id}`)}
          className="text-xs text-[#64748b] hover:text-[#0f172a] hover:underline"
        >
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
          <h1 className="text-xl font-semibold text-[#0f172a]">Companies</h1>
          <p className="text-sm text-[#64748b]">{clients.length} registered companies</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Company
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Companies", value: clients.length },
          { label: "Active", value: clients.filter((c: any) => c.status === "active").length },
          {
            label: "Total Revenue",
            value: clients.reduce((s: number, c: any) => s + parseFloat(c.totalRevenue || 0), 0).toFixed(2) + " ₼",
          },
          {
            label: "Total Sales",
            value: clients.reduce((s: number, c: any) => s + (c.totalSales || 0), 0),
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-xs text-[#64748b] mb-1">{kpi.label}</p>
            <p className="text-xl font-semibold text-[#0f172a]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
        <Table columns={columns} data={clients} isLoading={isLoading} />
      </div>

      {/* Create Company + Owner modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              <div className={`flex items-center justify-center size-6 rounded-full text-xs font-semibold ${
                step === 1 ? "bg-[#0f172a] text-white" : "bg-[#f1f5f9] text-[#64748b]"
              }`}>1</div>
              <span className={`text-xs font-medium ${step === 1 ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>Company</span>
              <div className="flex-1 h-px bg-[#e2e8f0]" />
              <div className={`flex items-center justify-center size-6 rounded-full text-xs font-semibold ${
                step === 2 ? "bg-[#0f172a] text-white" : "bg-[#f1f5f9] text-[#64748b]"
              }`}>2</div>
              <span className={`text-xs font-medium ${step === 2 ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>Owner</span>
            </div>

            {/* Step 1 — Company */}
            {step === 1 && (
              <form onSubmit={handleNext} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Company Details</h2>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Name *</label>
                  <input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="Business name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Email</label>
                  <input
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="contact@business.com"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Phone</label>
                  <input
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="+994 50 000 00 00"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Address</label>
                  <input
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b]"
                  >
                    Next →
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 — Owner */}
            {step === 2 && (
              <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Owner Details</h2>
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-semibold text-[#64748b]">First Name *</label>
                    <input
                      value={owner.firstName}
                      onChange={(e) => setOwner({ ...owner, firstName: e.target.value })}
                      className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-semibold text-[#64748b]">Last Name *</label>
                    <input
                      value={owner.lastName}
                      onChange={(e) => setOwner({ ...owner, lastName: e.target.value })}
                      className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Email *</label>
                  <input
                    value={owner.email}
                    onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="owner@business.com"
                    type="email"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Phone</label>
                  <input
                    value={owner.phone}
                    onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="+994 50 000 00 00"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Password *</label>
                  <input
                    value={owner.password}
                    onChange={(e) => setOwner({ ...owner, password: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="Min. 6 characters"
                    type="password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">Confirm Password *</label>
                  <input
                    value={owner.confirmPassword}
                    onChange={(e) => setOwner({ ...owner, confirmPassword: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
                    placeholder="Repeat password"
                    type="password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">{error}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b] disabled:opacity-50"
                  >
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
