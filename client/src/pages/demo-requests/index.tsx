import React, { useState } from "react";
import { useGetDemoRequestsQuery, useUpdateDemoRequestMutation } from "../../redux/features/demo/demoRequestsSlice.tsx";

const STATUS_COLORS: Record<string, string> = {
  new:       "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  done:      "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  new:       "New",
  contacted: "Contacted",
  done:      "Done",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("az-AZ", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export const DemoRequests = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useGetDemoRequestsQuery({ status: statusFilter || undefined });
  const [updateStatus] = useUpdateDemoRequestMutation();
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Demo Requests</h1>
          <p className="text-sm text-text-secondary mt-0.5">{total} total request{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          {["", "new", "contacted", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                statusFilter === s
                  ? "bg-brand text-white"
                  : "bg-bg-muted text-text-secondary hover:text-text-primary"
              }`}
            >
              {s === "" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-text-secondary text-sm">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-text-secondary text-sm">No demo requests yet.</div>
      ) : (
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-muted">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Name</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Company</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Message</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Date</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any) => (
                <React.Fragment key={row.id}>
                  <tr className="border-b border-border hover:bg-bg-muted transition">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.company || "—"}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      <div>{row.phone || ""}</div>
                      <div className="text-xs">{row.email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-xs">
                      {row.message
                        ? <span className="text-sm italic">{row.message}</span>
                        : <span className="text-text-muted text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{fmtDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                        {STATUS_LABELS[row.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus({ id: row.id, status: e.target.value })}
                        className="text-xs border border-border rounded-lg px-2 py-1 bg-bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DemoRequests;
