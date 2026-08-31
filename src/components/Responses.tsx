import { useState, useEffect } from "react";
import { Application, Submission, Plan } from "../types";
import { submissionService } from "../services/submissions/submissionService";

interface ResponsesProps {
  app: Application;
  onSelectApplicant: (submission: Submission) => void;
  plan?: Plan;
  usageCount?: number;
  onUpgrade?: () => void;
  onPublish?: () => void;
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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filtered = search.trim()
    ? submissions.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : submissions;

  function handleExportCSV() {
    if (plan === "free") {
      onUpgrade && onUpgrade();
      return;
    }
    if (submissions.length === 0) return;

    // Generate CSV
    const headers = ["Submission ID", "Name", "Email", "Submitted Date", "Answers"];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      s.submitted,
      `"${s.answers.map((a) => `${a.question}: ${a.answer}`).join(" | ").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${app.slug || "application"}-submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const effectiveUsage = submissions.length || usageCount;

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

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Views", value: Math.max(submissions.length * 2 + 3, app.status === "published" ? 12 : 0).toString() },
            { label: "Started", value: Math.max(submissions.length + 1, app.status === "published" ? 5 : 0).toString() },
            { label: "Submissions", value: submissions.length.toString() },
            { label: "Completion rate", value: submissions.length > 0 ? "84.2%" : "0.0%" },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B] mb-1">{m.label}</p>
              <p className="text-xl font-semibold text-[#0F172A]">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg flex-1 max-w-xs focus-within:border-[#2563EB] transition-all">
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
              <button onClick={() => setSearch("")} className="text-[#94A3B8] hover:text-[#64748B] cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <span className="text-xs text-[#94A3B8]">
            {filtered.length} submission{filtered.length !== 1 ? "s" : ""}
          </span>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-xs text-[#94A3B8]">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center">
            <p className="text-sm font-medium text-[#0F172A] mb-1">No submissions yet</p>
            <p className="text-xs text-[#64748B]">Submissions will appear here when someone completes this application.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
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
                    className={`cursor-pointer hover:bg-[#F8FAFC] transition-colors ${i < filtered.length - 1 ? "border-b border-[#E2E8F0]" : ""}`}
                  >
                    <td className="px-4 py-3 text-[#94A3B8]">
                      #{submissions.length - i}
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
                    <td className="px-4 py-3 text-[#94A3B8] hidden md:table-cell">{sub.submitted}</td>
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
