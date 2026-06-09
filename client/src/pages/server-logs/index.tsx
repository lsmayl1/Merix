import { useEffect, useRef, useState } from "react";
import { getCookie } from "../../redux/services/tokenService";

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  ts: string;
  level: LogLevel;
  msg: string;
}

const levelColor: Record<LogLevel, string> = {
  info:  "text-slate-300",
  warn:  "text-yellow-400",
  error: "text-red-400",
};

const levelBadge: Record<LogLevel, string> = {
  info:  "text-slate-500",
  warn:  "text-yellow-600",
  error: "text-red-500",
};

const WS_URL = (import.meta.env.VITE_API_URL as string)
  .replace(/^http/, "ws")
  .replace(/\/api$/, "");

export const ServerLogs = () => {
  const [logs, setLogs]       = useState<LogEntry[]>([]);
  const [status, setStatus]   = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [paused, setPaused]   = useState(false);
  const [filter, setFilter]   = useState<LogLevel | "all">("all");
  const bottomRef             = useRef<HTMLDivElement>(null);
  const pausedRef             = useRef(paused);
  const wsRef                 = useRef<WebSocket | null>(null);

  pausedRef.current = paused;

  useEffect(() => {
    const token = getCookie("token");
    const ws = new WebSocket(`${WS_URL}/ws/logs?token=${token}`);
    wsRef.current = ws;

    ws.onopen  = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("disconnected");

    ws.onmessage = (e) => {
      if (pausedRef.current) return;
      try {
        const entry: LogEntry = JSON.parse(e.data);
        setLogs((prev) => [...prev.slice(-999), entry]);
      } catch {}
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!paused) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, paused]);

  const visible = filter === "all" ? logs : logs.filter((l) => l.level === filter);

  const statusDot: Record<typeof status, string> = {
    connecting:   "bg-yellow-400",
    connected:    "bg-green-400",
    disconnected: "bg-red-500",
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${statusDot[status]}`} />
          <span className="text-sm text-text-secondary capitalize">{status}</span>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "info", "warn", "error"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-brand text-white"
                  : "bg-bg-muted text-text-secondary hover:text-text-primary"
              }`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={() => setPaused((p) => !p)}
            className="px-2.5 py-1 rounded text-xs font-medium bg-bg-muted text-text-secondary hover:text-text-primary transition-colors"
          >
            {paused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={() => setLogs([])}
            className="px-2.5 py-1 rounded text-xs font-medium bg-bg-muted text-text-secondary hover:text-text-primary transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Log terminal */}
      <div className="flex-1 min-h-0 bg-[#0d1117] rounded-lg border border-border overflow-y-auto font-mono text-xs p-3 leading-5">
        {visible.length === 0 && (
          <span className="text-slate-600">No logs yet…</span>
        )}
        {visible.map((entry, i) => (
          <div key={i} className="flex gap-2 hover:bg-white/5 px-1 rounded">
            <span className="text-slate-600 shrink-0 select-none">
              {new Date(entry.ts).toLocaleTimeString()}
            </span>
            <span className={`shrink-0 uppercase w-10 ${levelBadge[entry.level]}`}>
              [{entry.level}]
            </span>
            <span className={`break-all ${levelColor[entry.level]}`}>{entry.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
