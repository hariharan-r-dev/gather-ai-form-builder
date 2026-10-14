import { useState } from "react";
import { Plan } from "../types";
import { useApplications } from "../app/AppProvider";

interface PricingPageProps {
  plan: Plan;
  submissionUsage?: number;
  onUpgrade: () => void;
  onBack: () => void;
  backLabel?: string;
}

const COMPARISON_ROWS = [
  { feature: "AI form generation & editing", free: "✓", pro: "✓" },
  { feature: "Submissions per month", free: "10", pro: "1,000" },
  { feature: "Published forms", free: "1", pro: "Unlimited" },
  { feature: "Total forms", free: "Unlimited", pro: "Unlimited" },
  { feature: "Questions & sections per form", free: "Unlimited", pro: "Unlimited" },
  { feature: "File upload support", free: "✓ (up to 10MB)", pro: "✓ (up to 50MB)" },
  { feature: "Remove Gather branding", free: "—", pro: "✓" },
  { feature: "CSV response export", free: "✓", pro: "✓" },
  { feature: "Priority support", free: "—", pro: "✓" },
];

export default function PricingPage({
  plan,
  submissionUsage = 0,
  onUpgrade,
  onBack,
  backLabel = "Back",
}: PricingPageProps) {
  const { applications } = useApplications();
  const [activeTab, setActiveTab] = useState<"usage" | "limits">("usage");
  const [showPlanModal, setShowPlanModal] = useState(false);

  const isFree = plan === "free";
  const submissionLimit = isFree ? 10 : 1000;
  const submissionPercent = Math.min((submissionUsage / submissionLimit) * 100, 100);
  const remainingSubmissions = Math.max(0, submissionLimit - submissionUsage);

  const totalForms = applications.length;
  const publishedForms = applications.filter((a) => a.status === "published").length;
  const draftForms = applications.filter((a) => a.status !== "published").length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Dynamic Contextual Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors mb-6 cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span>{backLabel}</span>
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Billing &amp; usage</h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage your Gather plan, submissions, and usage.
          </p>
        </div>

        {/* Divider underneath page heading */}
        <div className="border-b border-[#E2E8F0] mb-8" />

        {/* ── 1. Current Plan Section ── */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
            Current plan
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {isFree ? "Gather Free" : "Gather Pro"}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB]">
                    Active Plan
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  {isFree
                    ? "Build and publish forms with AI."
                    : "Unlimited forms and 1,000 submissions per month."}
                </p>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#475569] mt-3">
                  <span>• {submissionLimit} submissions/month</span>
                  <span>• {isFree ? "1 published form" : "Unlimited published forms"}</span>
                  <span>• AI form generation &amp; editing</span>
                  <span>• File upload support</span>
                </div>
              </div>

              {isFree ? (
                <button
                  onClick={onUpgrade}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex-shrink-0 self-start sm:self-center"
                >
                  Upgrade
                </button>
              ) : (
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="px-4 py-2 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-medium rounded-xl transition-colors cursor-pointer flex-shrink-0 self-start sm:self-center"
                >
                  Manage plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. Gather Upgrade Promotion (if Free) ── */}
        {isFree && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-white border border-[#BFDBFE] rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2563EB] text-white tracking-wide uppercase">
                      Pro Plan
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">
                    Upgrade your Gather plan
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Get more submissions and higher usage limits as your forms grow.
                  </p>
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#475569] pt-1">
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>1,000 submissions / month</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Unlimited published forms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Remove Gather branding</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPlanModal(true)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex-shrink-0 self-start md:self-center"
                >
                  View plans
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Usage Section ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Usage</h2>
              <p className="text-xs text-[#64748B]">
                View your Gather usage for the current period.
              </p>
            </div>

            {/* Segmented Control [Usage] [Limits] */}
            <div className="flex bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setActiveTab("usage")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "usage"
                    ? "bg-white text-[#0F172A] shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Usage
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("limits")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === "limits"
                    ? "bg-white text-[#0F172A] shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                Limits
              </button>
            </div>
          </div>

          {activeTab === "usage" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Submission Usage Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#0F172A]">Submissions</h3>
                    <span className="text-xs font-bold text-[#0F172A]">
                      {submissionUsage} / {submissionLimit}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">Submissions this month</p>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        submissionPercent >= 100
                          ? "bg-red-500"
                          : submissionPercent >= 80
                          ? "bg-amber-500"
                          : "bg-[#2563EB]"
                      }`}
                      style={{ width: `${submissionPercent}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                  <span>{remainingSubmissions} submissions remaining</span>
                  <span className="text-[11px] text-[#94A3B8]">Renews monthly</span>
                </div>
              </div>

              {/* Forms Usage Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#0F172A]">Forms</h3>
                    <span className="text-xs font-bold text-[#0F172A]">{totalForms} total</span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">Your Gather form portfolio</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B]">Total forms created</span>
                      <span className="font-semibold text-[#0F172A]">{totalForms}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#F8FAFC]">
                      <span className="text-[#64748B]">Published forms</span>
                      <span className="font-semibold text-[#2563EB]">{publishedForms}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#64748B]">Draft forms</span>
                      <span className="font-semibold text-[#64748B]">{draftForms}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[11px] text-[#94A3B8]">
                  {isFree ? "Free plan includes 1 active published form." : "Pro plan includes unlimited published forms."}
                </div>
              </div>
            </div>
          ) : (
            /* Limits View */
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Plan limits</h3>
              <div className="divide-y divide-[#F1F5F9] text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">Submissions / month</span>
                  <span className="font-semibold text-[#0F172A]">{submissionLimit}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">Published forms</span>
                  <span className="font-semibold text-[#0F172A]">{isFree ? "1" : "Unlimited"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">Form sections &amp; questions</span>
                  <span className="font-semibold text-[#0F172A]">Unlimited</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">AI form generation &amp; editing</span>
                  <span className="font-semibold text-[#2563EB]">Included</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">File upload size per file</span>
                  <span className="font-semibold text-[#0F172A]">{isFree ? "10 MB" : "50 MB"}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#64748B]">Response CSV export</span>
                  <span className="font-semibold text-[#0F172A]">Included</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Plans Modal ── */}
        {showPlanModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setShowPlanModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#E2E8F0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Gather Plans</h3>
                  <p className="text-xs text-[#64748B]">Simple plans. More room to gather.</p>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Free Plan */}
                  <div className="border border-[#E2E8F0] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">Free</h4>
                      <div className="text-2xl font-bold text-[#0F172A] mt-2">$0</div>
                      <p className="text-xs text-[#64748B] mt-1">For trying Gather and creating forms.</p>
                      <ul className="text-xs space-y-2 text-[#475569] mt-4">
                        <li>• 1 Published Application</li>
                        <li>• 10 Submissions/month</li>
                        <li>• AI Generation &amp; Editing</li>
                        <li>• File Uploads up to 10MB</li>
                      </ul>
                    </div>
                    <button
                      disabled
                      className="mt-6 w-full py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] text-[#94A3B8] bg-[#F8FAFC]"
                    >
                      {isFree ? "Current Plan" : "Free Tier"}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="border-2 border-[#2563EB] rounded-2xl p-5 flex flex-col justify-between bg-[#EFF6FF]/40 relative">
                    <span className="absolute -top-2.5 right-4 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Recommended
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#2563EB]">Pro</h4>
                      <div className="text-2xl font-bold text-[#0F172A] mt-2">
                        $12 <span className="text-xs text-[#64748B] font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">For collecting regular submissions.</p>
                      <ul className="text-xs space-y-2 text-[#475569] mt-4">
                        <li>• Unlimited Applications</li>
                        <li>• 1,000 Submissions/month</li>
                        <li>• Remove Gather Branding</li>
                        <li>• Priority Support &amp; Exports</li>
                      </ul>
                    </div>
                    {isFree ? (
                      <button
                        onClick={() => {
                          setShowPlanModal(false);
                          onUpgrade();
                        }}
                        className="mt-6 w-full py-2 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors cursor-pointer"
                      >
                        Upgrade to Pro
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-6 w-full py-2 text-xs font-semibold rounded-xl border border-[#2563EB] text-[#2563EB] bg-white"
                      >
                        Current Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature Comparison */}
                <div className="border-t border-[#E2E8F0] pt-6">
                  <h4 className="text-xs font-semibold text-[#0F172A] mb-3">Feature Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                          <th className="py-2">Feature</th>
                          <th className="py-2 text-center">Free</th>
                          <th className="py-2 text-center">Pro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {COMPARISON_ROWS.map((row, idx) => (
                          <tr key={idx}>
                            <td className="py-2 text-[#0F172A] font-medium">{row.feature}</td>
                            <td className="py-2 text-center text-[#64748B]">{row.free}</td>
                            <td className="py-2 text-center text-[#2563EB] font-medium">{row.pro}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
