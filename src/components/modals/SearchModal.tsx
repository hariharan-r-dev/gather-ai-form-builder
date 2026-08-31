import { useState, useEffect, useRef } from "react";
import { Application } from "../../types";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  closed: "Closed",
};

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  draft: { dot: "bg-[#94A3B8]", bg: "bg-[#F1F5F9]", text: "text-[#64748B]" },
  published: { dot: "bg-[#2563EB]", bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
  closed: { dot: "bg-[#E2E8F0]", bg: "bg-[#F8FAFC]", text: "text-[#94A3B8]" },
};

interface SearchModalProps {
  applications: Application[];
  onClose: () => void;
  onOpenApp: (app: Application) => void;
}

export default function SearchModal({ applications, onClose, onOpenApp }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim()
    ? applications.filter((a) => a.name.toLowerCase().includes(query.toLowerCase().trim()))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ paddingTop: "15vh", background: "rgba(15,23,42,0.2)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full mx-4 overflow-hidden"
        style={{ maxWidth: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications..."
            className="flex-1 text-sm text-[#0F172A] bg-transparent outline-none placeholder:text-[#94A3B8]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto">
          {query.trim() === "" ? (
            <p className="text-[13px] text-[#94A3B8] text-center py-10">Search your created applications</p>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-[#0F172A] mb-1">No applications found</p>
              <p className="text-xs text-[#64748B]">Try a different search term.</p>
            </div>
          ) : (
            results.map((app) => {
              const s = STATUS_COLORS[app.status] ?? STATUS_COLORS.draft;
              return (
                <button
                  key={app.id}
                  onClick={() => { onClose(); onOpenApp(app); }}
                  className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9] last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{app.name}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{app.responses} submission{app.responses !== 1 ? "s" : ""} · Updated {app.lastUpdated}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ml-3 ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {STATUS_LABELS[app.status] ?? app.status}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
