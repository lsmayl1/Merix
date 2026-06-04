import React, { useState, useRef, useEffect } from "react";
import {
  useGetTablesQuery,
  useGetTableRowsQuery,
  useRunQueryMutation,
} from "../../redux/features/database/databaseSlice.tsx";

/* ── small helpers ─────────────────────────────────── */
const Badge = ({ children, color = "gray" }: { children: React.ReactNode; color?: string }) => {
  const map: Record<string, string> = {
    gray:    "bg-[#f1f5f9] text-[#64748b]",
    green:   "bg-[#f0fdf4] text-[#166534]",
    blue:    "bg-[#eff6ff] text-[#1d4ed8]",
    red:     "bg-[#fef2f2] text-[#991b1b]",
    yellow:  "bg-[#fffbeb] text-[#92400e]",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${map[color] ?? map.gray}`}>
      {children}
    </span>
  );
};

const typeColor = (t: string) => {
  if (/int|serial|numeric|decimal|float|double/i.test(t)) return "blue";
  if (/char|text|varchar/i.test(t)) return "green";
  if (/bool/i.test(t)) return "yellow";
  if (/date|time|timestamp/i.test(t)) return "gray";
  return "gray";
};

/* ── Table browser panel ───────────────────────────── */
const TableBrowser = ({ table }: { table: any }) => {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { data, isFetching } = useGetTableRowsQuery({ name: table.name, limit, offset });

  const cols = data?.rows?.length ? Object.keys(data.rows[0]) : table.columns.map((c: any) => c.column_name);
  const pageCount = Math.ceil((data?.total ?? 0) / limit);
  const page = Math.floor(offset / limit) + 1;

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-[#0f172a]">{table.name}</span>
          <Badge color="gray">{data?.total ?? table.rowCount} rows</Badge>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={page === 1}
              className="px-2 py-1 border border-[#e2e8f0] rounded text-xs text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40">
              ‹ Prev
            </button>
            <span className="text-xs text-[#64748b]">{page} / {pageCount}</span>
            <button onClick={() => setOffset(offset + limit)} disabled={page === pageCount}
              className="px-2 py-1 border border-[#e2e8f0] rounded text-xs text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-40">
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Column definitions */}
      <div className="flex flex-wrap gap-1.5">
        {table.columns.map((col: any) => (
          <span key={col.column_name} className="flex items-center gap-1 px-2 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] rounded text-xs">
            <span className="text-[#0f172a] font-medium">{col.column_name}</span>
            <Badge color={typeColor(col.data_type)}>{col.data_type}</Badge>
            {col.is_nullable === "NO" && <Badge color="red">NOT NULL</Badge>}
          </span>
        ))}
      </div>

      {/* Data grid */}
      <div className="flex-1 min-h-0 overflow-auto border border-[#e2e8f0] rounded-lg">
        {isFetching ? (
          <div className="flex items-center justify-center h-32 text-sm text-[#94a3b8]">Loading...</div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="sticky top-0 bg-[#f8fafc] border-b border-[#e2e8f0]">
                {cols.map((col) => (
                  <th key={col} className="px-3 py-2 text-left font-semibold text-[#64748b] text-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.rows?.map((row: any, i: number) => (
                <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  {cols.map((col) => (
                    <td key={col} className="px-3 py-2 text-[#0f172a] text-nowrap max-w-[200px] truncate font-mono">
                      {row[col] === null
                        ? <span className="text-[#94a3b8] italic">null</span>
                        : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

/* ── Main page ─────────────────────────────────────── */
export const Database = () => {
  const { data: tables = [], isLoading } = useGetTablesQuery(undefined);
  const [runQuery, { isLoading: running }] = useRunQueryMutation();
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [tab, setTab] = useState<"browser" | "console">("browser");
  const [sql, setSql] = useState("SELECT * FROM \"users\" LIMIT 10;");
  const [result, setResult] = useState<any>(null);
  const [queryError, setQueryError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-select first table
  useEffect(() => {
    if (tables.length && !selectedTable) setSelectedTable(tables[0]);
  }, [tables]);

  const handleRun = async () => {
    if (!sql.trim()) return;
    setQueryError("");
    setResult(null);
    try {
      const res = await runQuery(sql).unwrap();
      setResult(res);
    } catch (err: any) {
      setQueryError(err?.data?.error || "Query failed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRun();
  };

  const resultCols = result?.rows?.length ? Object.keys(result.rows[0]) : [];

  return (
    <div className="flex h-full min-h-0 gap-3">
      {/* Sidebar: table list */}
      <div className="w-52 shrink-0 bg-white border border-[#e2e8f0] rounded-xl flex flex-col overflow-hidden">
        <div className="px-3 py-3 border-b border-[#e2e8f0]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">Tables</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="text-xs text-[#94a3b8] px-3 py-4">Loading...</p>
          ) : (
            tables.map((t: any) => (
              <button
                key={t.name}
                onClick={() => { setSelectedTable(t); setTab("browser"); }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f8fafc] transition-colors ${
                  selectedTable?.name === t.name && tab === "browser" ? "bg-[#f1f5f9]" : ""
                }`}
              >
                <span className="font-mono text-xs text-[#0f172a] truncate">{t.name}</span>
                <span className="text-[10px] text-[#94a3b8] shrink-0 ml-1">{t.rowCount}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-[#e2e8f0] rounded-xl px-2 py-1.5 w-fit">
          {(["browser", "console"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                tab === t ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
              }`}
            >
              {t === "browser" ? "🗂 Table Browser" : "⌨ SQL Console"}
            </button>
          ))}
        </div>

        {tab === "browser" ? (
          <div className="flex-1 min-h-0 bg-white border border-[#e2e8f0] rounded-xl p-4 overflow-hidden flex flex-col">
            {selectedTable
              ? <TableBrowser key={selectedTable.name} table={selectedTable} />
              : <p className="text-sm text-[#94a3b8]">Select a table from the left.</p>
            }
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col gap-3">
            {/* Editor */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#e2e8f0] bg-[#f8fafc]">
                <span className="text-xs font-semibold text-[#64748b]">SQL Editor</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#94a3b8]">Ctrl+Enter to run</span>
                  <button
                    onClick={handleRun}
                    disabled={running}
                    className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg disabled:opacity-60 flex items-center gap-1.5 transition-colors"
                  >
                    {running ? (
                      <>
                        <svg className="size-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        Running...
                      </>
                    ) : (
                      <>▶ Run</>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={6}
                spellCheck={false}
                className="w-full px-4 py-3 font-mono text-sm text-[#0f172a] bg-white resize-none focus:outline-none"
                placeholder="SELECT * FROM users LIMIT 10;"
              />
            </div>

            {/* Results */}
            {(result || queryError) && (
              <div className="flex-1 min-h-0 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-center gap-3 px-4 py-2 border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <span className="text-xs font-semibold text-[#64748b]">Results</span>
                  {result && (
                    <>
                      <Badge color={result.type === "select" ? "blue" : "green"}>
                        {result.type === "select" ? `${result.rowCount} rows` : `${result.affected} affected`}
                      </Badge>
                      <Badge color="gray">{result.duration}ms</Badge>
                    </>
                  )}
                  {queryError && <Badge color="red">Error</Badge>}
                </div>

                {queryError ? (
                  <div className="px-4 py-3 font-mono text-sm text-red-600 bg-red-50">{queryError}</div>
                ) : result?.type === "select" ? (
                  <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="sticky top-0 bg-[#f8fafc] border-b border-[#e2e8f0]">
                          <th className="px-3 py-2 text-left text-[#94a3b8] font-medium w-8">#</th>
                          {resultCols.map((col) => (
                            <th key={col} className="px-3 py-2 text-left font-semibold text-[#64748b] text-nowrap">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row: any, i: number) => (
                          <tr key={i} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                            <td className="px-3 py-2 text-[#94a3b8]">{i + 1}</td>
                            {resultCols.map((col) => (
                              <td key={col} className="px-3 py-2 text-nowrap max-w-[240px] truncate font-mono text-[#0f172a]">
                                {row[col] === null
                                  ? <span className="text-[#94a3b8] italic">null</span>
                                  : String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-emerald-700 font-medium">{result?.message}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
