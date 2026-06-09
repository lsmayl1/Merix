import { useEffect, useState } from "react";
import { Download, HardDrive, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const API = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/api");

interface InstallerInfo {
  available: boolean;
  fileName: string;
  sizeMB: number;
  sizeBytes: number;
  updatedAt: string;
}

export const DownloadPage = () => {
  const [info, setInfo]       = useState<InstallerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/download/info`);
      const data = await res.json();
      setInfo(data);
    } catch {
      setError("Server ilə əlaqə qurulamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInfo(); }, []);

  const handleDownload = () => {
    window.location.href = `${API}/download/installer`;
  };

  const updatedDate = info?.updatedAt
    ? new Date(info.updatedAt).toLocaleDateString("az-AZ", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Merix ERP — Yükləmə</h1>
        <p className="text-sm text-text-secondary mt-1">
          Müştərilər üçün Merix ERP qurulum faylı buradan yüklənilir.
        </p>
      </div>

      {/* Card */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">

        {/* Top band */}
        <div className="bg-brand/5 border-b border-border px-6 py-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <HardDrive size={22} />
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">Merix ERP Setup</p>
            <p className="text-xs text-text-muted">Windows 10/11 · x64</p>
          </div>
          <button
            onClick={fetchInfo}
            className="ml-auto size-8 flex items-center justify-center rounded-lg border border-border
                       text-text-muted hover:text-text-primary hover:bg-bg-muted transition-colors"
            title="Yenilə"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <RefreshCw size={14} className="animate-spin" />
              Yüklənir...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-danger text-sm">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {!loading && !error && info && (
            <div className="flex flex-col gap-5">
              {/* Status */}
              {info.available ? (
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <CheckCircle size={15} />
                  Fayl mövcuddur və yüklənməyə hazırdır
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                  <AlertCircle size={15} />
                  Fayl hələ server üzərinə yüklənməyib
                </div>
              )}

              {/* Meta */}
              {info.available && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-page border border-border rounded-lg px-4 py-3">
                    <p className="text-[11px] text-text-muted uppercase tracking-wide mb-0.5">Fayl ölçüsü</p>
                    <p className="text-lg font-bold text-text-primary tabular-nums">{info.sizeMB} MB</p>
                  </div>
                  <div className="bg-bg-page border border-border rounded-lg px-4 py-3">
                    <p className="text-[11px] text-text-muted uppercase tracking-wide mb-0.5">Son yenilənmə</p>
                    <p className="text-lg font-bold text-text-primary">{updatedDate}</p>
                  </div>
                </div>
              )}

              {/* Download button */}
              {info.available && (
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2.5 h-11 px-6 w-full
                             bg-brand text-white text-sm font-semibold rounded-xl
                             hover:opacity-90 active:opacity-80 transition-opacity shadow-sm"
                >
                  <Download size={16} />
                  MerixSetup.exe yüklə ({info.sizeMB} MB)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-bg-surface border border-border rounded-xl px-6 py-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Qurulum addımları</h2>
        <ol className="flex flex-col gap-2">
          {[
            "Yuxarıdakı düyməyə basaraq .exe faylını yükləyin.",
            "Yüklənmiş faylı işə salın (Administrator kimi).",
            "Qurulum sihirbazı PostgreSQL verilənlər bazasını avtomatik quracaq.",
            "Qurulum tamamlandıqdan sonra Merix masaüstü ikonu ilə açın.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span className="size-5 rounded-full bg-brand/10 text-brand text-[11px] font-bold
                               flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Admin note */}
      <p className="text-xs text-text-muted text-center">
        Yeni versiya yükləmək üçün server üzərindəki{" "}
        <code className="bg-bg-muted px-1 py-0.5 rounded text-text-secondary">server/downloads/MerixSetup.exe</code>{" "}
        faylını dəyişdirin.
      </p>
    </div>
  );
};
