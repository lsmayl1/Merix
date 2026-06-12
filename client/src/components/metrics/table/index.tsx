import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";

export const Table = ({
  data = [],
  columns = [],
  isLoading = false,
  path,
  pageSize = 10,
}: {
  data?: any[];
  columns?: any[];
  isLoading?: boolean;
  path?: string;
  pageSize?: number;
}) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    autoResetPageIndex: true,
  });

  const { pageIndex } = table.getState().pagination;
  const total    = data.length;
  const from     = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to       = Math.min((pageIndex + 1) * pageSize, total);
  const pageCount = table.getPageCount();
  const showPagination = !isLoading && pageCount > 1;
  const skeletonRows = Array.from({ length: 6 });

  const pageNumbers = (): (number | "…")[] => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i);
    const pages: (number | "…")[] = [];
    if (pageIndex < 4) {
      pages.push(0, 1, 2, 3, 4, "…", pageCount - 1);
    } else if (pageIndex >= pageCount - 4) {
      pages.push(0, "…", pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1);
    } else {
      pages.push(0, "…", pageIndex - 1, pageIndex, pageIndex + 1, "…", pageCount - 1);
    }
    return pages;
  };

  return (
    <div className="w-full h-full flex flex-col rounded-xl bg-bg-surface border border-border overflow-hidden">
      {/* Table */}
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={`px-4 py-2.5 text-xs font-semibold text-text-secondary uppercase tracking-wide
                      bg-bg-subtle text-nowrap border-b border-border
                      ${i === 0 ? "rounded-tl-xl" : ""}
                      ${i === hg.headers.length - 1 ? "rounded-tr-xl" : ""}
                      ${(header.column.columnDef as any).headerClassName ?? "text-center"}`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              skeletonRows.map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-bg-muted rounded-md animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <PackageOpen size={40} className="text-text-muted" />
                    <span className="text-sm text-text-muted font-medium">No data</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => path && navigate(`${path}/${(row.original as any).id}`)}
                  className={`border-b border-border/50 hover:bg-bg-subtle transition-colors duration-100 ${path ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2.5 text-sm text-text-primary text-nowrap ${(cell.column.columnDef as any).cellClassName ?? ""}`}
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

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-col gap-2 py-3 px-4 md:flex-row md:items-center md:justify-between shrink-0 border-t border-border">
          <span className="text-xs text-text-muted">
            {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-border
                         bg-bg-surface text-text-secondary disabled:opacity-40 hover:bg-bg-muted transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {pageNumbers().map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="h-8 w-8 flex items-center justify-center text-xs text-text-muted select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => table.setPageIndex(p as number)}
                  className={`h-8 min-w-8 rounded-md border px-2 text-xs font-semibold transition-colors ${
                    pageIndex === p
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-bg-surface text-text-secondary hover:bg-bg-muted"
                  }`}
                >
                  {(p as number) + 1}
                </button>
              )
            )}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-border
                         bg-bg-surface text-text-secondary disabled:opacity-40 hover:bg-bg-muted transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
