import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from "../../redux/features/companies/companiesSlice.tsx";
import { Table } from "../../components/metrics/table/index.tsx";

const columnHelper = createColumnHelper<any>();

export const Companies = () => {
  const { data: companies = [], isLoading } = useGetCompaniesQuery(undefined, {
    pollingInterval: 30000,
  });
  const [updateCompany] = useUpdateCompanyMutation();
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const openEdit = (company: any) => {
    setEditing(company);
    setForm({
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompany({ id: editing.id, ...form });
    setEditing(null);
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Company",
      headerClassName: "text-start",
      cell: ({ getValue }) => (
        <span className="font-medium text-[#0f172a]">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("client", {
      header: "Client (MerixERP)",
      headerClassName: "text-start",
      cell: ({ getValue }) => (
        <span className="text-[#64748b]">{getValue()?.name || "—"}</span>
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
    columnHelper.accessor("address", {
      header: "Address",
      headerClassName: "text-start",
      cell: ({ getValue }) => (
        <span className="text-[#64748b] text-xs">{getValue() || "—"}</span>
      ),
    }),
    columnHelper.accessor("is_active", {
      header: "Status",
      headerClassName: "text-center",
      cellClassName: "text-center",
      cell: ({ getValue }) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            getValue()
              ? "bg-[#f0fdf4] text-[#166534]"
              : "bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {getValue() ? "active" : "inactive"}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Registered",
      headerClassName: "text-center",
      cellClassName: "text-center text-xs text-[#64748b]",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue()).toLocaleDateString("en-GB") : "—",
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => openEdit(row.original)}
          className="text-xs text-[#64748b] hover:text-[#0f172a] hover:underline"
        >
          Edit
        </button>
      ),
    }),
  ];

  const activeCount = companies.filter((c: any) => c.is_active).length;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#0f172a]">Companies</h1>
        <p className="text-sm text-[#64748b]">
          All registered MerixERP company profiles
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total Companies", value: companies.length },
          { label: "Active", value: activeCount },
          { label: "Inactive", value: companies.length - activeCount },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-xs text-[#64748b] mb-1">{kpi.label}</p>
            <p className="text-xl font-semibold text-[#0f172a]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 flex-1 min-h-0 overflow-auto">
        <Table columns={columns} data={companies} isLoading={isLoading} />
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-[#0f172a] mb-4">
              Edit Company
            </h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              {[
                { key: "name", label: "Name *", type: "text", required: true },
                { key: "email", label: "Email", type: "email", required: false },
                { key: "phone", label: "Phone", type: "text", required: false },
                { key: "address", label: "Address", type: "text", required: false },
              ].map(({ key, label, type, required }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#64748b]">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:border-[#0f172a]"
                    required={required}
                  />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f1f5f9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
