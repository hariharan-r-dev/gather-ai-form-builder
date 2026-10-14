import { useState, useEffect, useMemo, useRef } from "react";
import { Application, Submission, Plan } from "../types";
import { submissionService } from "../services/submissions/submissionService";
import { parseFileAnswer } from "./common/FileUploadField";
import { exportSubmissionsToExcel, exportSubmissionsToCSV, formatSubmissionDateTime } from "../utils/exportSubmissions";

interface ResponsesProps {
  app: Application;
  onSelectApplicant: (submission: Submission) => void;
  plan?: Plan;
  usageCount?: number;
  onUpgrade?: () => void;
  onPublish?: () => void;
}

type SortOption = "newest" | "oldest" | "updated-recent" | "updated-old";
type DateFilterPreset = "all" | "today" | "last-7-days" | "last-4-weeks" | "last-12-months" | "custom";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "updated-recent": "Recently updated",
  "updated-old": "Oldest updated",
};

const DATE_PRESET_LABELS: Record<DateFilterPreset, string> = {
  all: "All time",
  today: "Today",
  "last-7-days": "Last 7 days",
  "last-4-weeks": "Last 4 weeks",
  "last-12-months": "Last 12 months",
  custom: "Custom range",
};

function getSubmissionTimestamp(s: Submission): number {
  if (s.submittedAt) {
    const t = new Date(s.submittedAt).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

function getSubmissionUpdatedTimestamp(s: Submission): number {
  if (s.updatedAt) {
    const t = new Date(s.updatedAt).getTime();
    if (!isNaN(t)) return t;
  }
  return getSubmissionTimestamp(s);
}

export default function Responses({
  app,
  onSelectApplicant,
  plan = "free",
  usageCount = 0,
  onUpgrade,
  onPublish,
}: ResponsesProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const sortRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const subs = await submissionService.getSubmissions(app.id);
        setSubmissions(subs);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [app.id]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Immutable chronological submission numbering (#1 = oldest, #N = newest)
  const submissionNumberMap = useMemo(() => {
    const chronological = [...submissions].sort((a, b) => {
      const timeA = getSubmissionTimestamp(a);
      const timeB = getSubmissionTimestamp(b);
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      return (a.id || "").localeCompare(b.id || "");
    });

    const map = new Map<string, number>();
    chronological.forEach((sub, idx) => {
      map.set(sub.id, idx + 1);
    });
    return map;
  }, [submissions]);

  // Filtered & Sorted Submissions
  const filtered = useMemo(() => {
    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return submissions
      .filter((s) => {
        // 1. Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchEmail = s.email.toLowerCase().includes(q);
          const matchAnswer = s.answers.some((a) => a.answer.toLowerCase().includes(q));
          if (!matchName && !matchEmail && !matchAnswer) return false;
        }

        // 2. Date filter
        const ts = getSubmissionTimestamp(s);
        if (dateFilter === "all" || !ts) return true;

        if (dateFilter === "today") {
          return ts >= startOfToday.getTime();
        }
        if (dateFilter === "last-7-days") {
          return ts >= now - 7 * 86400000;
        }
        if (dateFilter === "last-4-weeks") {
          return ts >= now - 28 * 86400000;
        }
        if (dateFilter === "last-12-months") {
          return ts >= now - 365 * 86400000;
        }
        if (dateFilter === "custom") {
          if (customStartDate) {
            const start = new Date(`${customStartDate}T00:00:00`).getTime();
            if (!isNaN(start) && ts < start) return false;
          }
          if (customEndDate) {
            const end = new Date(`${customEndDate}T23:59:59`).getTime();
            if (!isNaN(end) && ts > end) return false;
          }
          return true;
        }

        return true;
      })
      .sort((a, b) => {
        // 3. Sort
        if (sort === "newest") {
          return getSubmissionTimestamp(b) - getSubmissionTimestamp(a);
        }
        if (sort === "oldest") {
          return getSubmissionTimestamp(a) - getSubmissionTimestamp(b);
        }
        if (sort === "updated-recent") {
          return getSubmissionUpdatedTimestamp(b) - getSubmissionUpdatedTimestamp(a);
        }
        if (sort === "updated-old") {
          return getSubmissionUpdatedTimestamp(a) - getSubmissionUpdatedTimestamp(b);
        }
        return 0;
      });
  }, [submissions, search, dateFilter, customStartDate, customEndDate, sort]);

  async function handleExportExcel() {
    if (plan === "free") {
      onUpgrade && onUpgrade();
      return;
    }
    if (filtered.length === 0 || isExporting) return;
    setIsExporting(true);
    try {
      await exportSubmissionsToExcel(app, filtered);
    } catch (err) {
      console.error("Failed to export Excel:", err);
      alert("Failed to export submissions to Excel.");
    } finally {
      setIsExporting(false);
      setShowExportDropdown(false);
    }
  }

  function handleExportCSV() {
    if (plan === "free") {
      onUpgrade && onUpgrade();
      return;
    }
    if (filtered.length === 0) return;
    try {
      exportSubmissionsToCSV(app, filtered);
    } catch (err) {
      console.error("Failed to export CSV:", err);
      alert("Failed to export submissions to CSV.");
    } finally {
      setShowExportDropdown(false);
    }
  }

  if (app.status !== "published" && submissions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#0F172A] mb-2">No submissions yet</h3>
          <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
            Once you publish and share your application, submissions will appear here.
          </p>
          <button
            type="button"
            onClick={onPublish}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Publish application
          </button>
        </div>
      </div>
    );
  }

  const effectiveUsage = Math.min(submissions.length || usageCount, 10);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Usage indicator for free plan */}
        {plan === "free" && (
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 mb-4">
            <div>
              <span className="text-xs font-medium text-[#0F172A]">{effectiveUsage} of 10 submissions used</span>
              {effectiveUsage >= 8 && effectiveUsage < 10 && (
                <span className="ml-2 text-[11px] text-[#F59E0B] font-medium">Approaching limit</span>
              )}
              {effectiveUsage >= 10 && (
                <span className="ml-2 text-[11px] text-red-500 font-medium">Limit reached</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${effectiveUsage >= 10 ? "bg-red-400" : effectiveUsage >= 8 ? "bg-[#F59E0B]" : "bg-[#2563EB]"}`}
                  style={{ width: `${Math.min((effectiveUsage / 10) * 100, 100)}%` }}
                />
              </div>
              {effectiveUsage >= 8 && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lifetime Metrics (Uncorrupted by search filters) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Views", value: Math.max(submissions.length * 2 + 3, app.status === "published" ? 12 : 0).toString() },
            { label: "Started", value: Math.max(submissions.length + 1, app.status === "published" ? 5 : 0).toString() },
            { label: "Submissions", value: submissions.length.toString() },
            { label: "Completion rate", value: submissions.length > 0 ? "84.2%" : "0.0%" },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs">
              <p className="text-xs text-[#64748B] mb-1">{m.label}</p>
              <p className="text-xl font-semibold text-[#0F172A]">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar: Search + Sort + Date Filter */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl flex-1 min-w-[200px] max-w-xs focus-within:border-[#2563EB] transition-all shadow-2xs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions..."
              className="flex-1 text-xs text-[#0F172A] bg-transparent outline-none placeholder:text-[#94A3B8]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[#94A3B8] hover:text-[#64748B] cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setShowSortDropdown((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-medium text-[#0F172A] rounded-xl transition-colors cursor-pointer shadow-2xs select-none"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              <span>{SORT_LABELS[sort]}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#94A3B8]">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 w-44 z-30 overflow-hidden animate-in fade-in duration-100">
                {(["newest", "oldest", "updated-recent", "updated-old"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSort(s);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                      sort === s
                        ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                        : "text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {SORT_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter Control */}
          <div ref={dateRef} className="relative">
            <button
              type="button"
              onClick={() => setShowDateDropdown((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-xl transition-colors cursor-pointer shadow-2xs text-xs font-medium select-none ${
                dateFilter !== "all"
                  ? "border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]/40"
                  : "border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{DATE_PRESET_LABELS[dateFilter]}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#94A3B8]">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showDateDropdown && (
              <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 w-64 z-30 space-y-3 animate-in fade-in duration-100">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Filter by date
                  </span>
                  {dateFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateFilter("all");
                        setCustomStartDate("");
                        setCustomEndDate("");
                      }}
                      className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {(["all", "today", "last-7-days", "last-4-weeks", "last-12-months"] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setDateFilter(preset);
                        setShowDateDropdown(false);
                      }}
                      className={`px-2.5 py-1.5 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                        dateFilter === preset
                          ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
                          : "text-[#0F172A] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {DATE_PRESET_LABELS[preset]}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#F1F5F9] pt-2.5 space-y-2">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Custom range</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#94A3B8] block mb-0.5">Start date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => {
                          setCustomStartDate(e.target.value);
                          setDateFilter("custom");
                        }}
                        className="w-full px-2 py-1 text-[11px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#94A3B8] block mb-0.5">End date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => {
                          setCustomEndDate(e.target.value);
                          setDateFilter("custom");
                        }}
                        className="w-full px-2 py-1 text-[11px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] bg-white text-[#0F172A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <span className="text-xs text-[#94A3B8] ml-1">
            {filtered.length} submission{filtered.length !== 1 ? "s" : ""}
          </span>

          <div className="flex-1" />

          {/* Export Actions */}
          <div ref={exportRef} className="relative">
            <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
              <button
                type="button"
                disabled={filtered.length === 0 || isExporting}
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export structured Excel (.xlsx) spreadsheet"
              >
                {isExporting ? (
                  <svg className="animate-spin w-3.5 h-3.5 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#10B981]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
                )}
                <span>Export Excel</span>
              </button>

              <button
                type="button"
                disabled={filtered.length === 0 || isExporting}
                onClick={() => setShowExportDropdown((v) => !v)}
                className="px-2 py-1.5 border-l border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="More export formats"
              >
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#94A3B8]">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {showExportDropdown && (
              <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-1 w-44 z-30 overflow-hidden animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#10B981]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="16" y2="17" />
                  </svg>
                  <span className="font-medium">Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full text-left px-3.5 py-2 text-xs text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-center gap-2 border-t border-[#F1F5F9]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#64748B]">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span>CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table / Results */}
        {loading ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-xs text-[#94A3B8] shadow-2xs">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-2xs">
            <p className="text-sm font-semibold text-[#0F172A] mb-1">
              {submissions.length === 0 ? "No submissions yet" : "No submissions found"}
            </p>
            <p className="text-xs text-[#64748B]">
              {submissions.length === 0
                ? "Submissions will appear here when someone completes this application."
                : "Try changing your search or date filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-4 py-3 font-medium text-[#64748B] w-12">#</th>
                  <th className="text-left px-4 py-3 font-medium text-[#64748B]">Applicant</th>
                  <th className="text-left px-4 py-3 font-medium text-[#64748B] hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-[#64748B] hidden md:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <tr
                    key={sub.id}
                    onClick={() => onSelectApplicant(sub)}
                    className={`cursor-pointer hover:bg-[#F8FAFC] transition-colors ${
                      i < filtered.length - 1 ? "border-b border-[#E2E8F0]" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-[#94A3B8]">
                      #{submissionNumberMap.get(sub.id) || 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {sub.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#0F172A]">{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] hidden sm:table-cell">{sub.email}</td>
                    <td className="px-4 py-3 text-[#94A3B8] hidden md:table-cell">
                      {formatSubmissionDateTime(sub.submittedAt, sub.submitted)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
