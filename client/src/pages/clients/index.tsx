import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useToggleClientStatusMutation,
} from "../../redux/features/clients/clientsSlice.tsx";
import { Table } from "../../components/metrics/table/index.tsx";

const columnHelper = createColumnHelper<any>();

export const Clients = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading, refetch } = useGetClientsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [createClient] = useCreateClientMutation();
  const [toggleStatus] = useToggleClientStatusMutation();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    await createClient(form);
    setForm({ name: "", email: "", phone: "" });
    setShowAdd(false);
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
            value:
              clients.reduce((s: number, c: any) => s + parseFloat(c.totalRevenue || 0), 0).toFixed(2) + " ₼",
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

      {/* Add client modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#0f172a] mb-4">New Company</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b]">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:border-[#0f172a]"
                  placeholder="Business name"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b]">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:border-[#0f172a]"
                  placeholder="contact@business.com"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b]">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:border-[#0f172a]"
                  placeholder="+994 50 000 00 00"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
