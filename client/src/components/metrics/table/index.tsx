import React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

export const Table = ({
  data = [],
  columns = [],
  isLoading = false,
  path,
}: {
  data?: any[];
  columns?: any[];
  isLoading?: boolean;
  path?: string;
}) => {
  const navigate = useNavigate();
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="overflow-auto min-h-0 h-full">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={`px-4 py-2.5 font-medium text-xs text-[#64748b] text-nowrap bg-[#f8fafc] border-b border-[#e2e8f0]
                      ${i === 0 ? "rounded-tl-lg" : ""}
                      ${i === hg.headers.length - 1 ? "rounded-tr-lg" : ""}
                      ${(header.column.columnDef as any).headerClassName ?? ""}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-sm text-[#94a3b8]">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-sm text-[#94a3b8]">
                  No data
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => path && navigate(`${path}/${(row.original as any).id}`)}
                  className={`border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${path ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2.5 text-[#0f172a] text-nowrap
                        ${(cell.column.columnDef as any).cellClassName ?? ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
