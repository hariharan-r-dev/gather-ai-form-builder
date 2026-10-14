import { useState } from "react";
import { Plan } from "../types";
import { useApplications } from "../app/AppProvider";

interface SettingsProps {
  plan: Plan;
  submissionUsage: number;
  onUpgrade: () => void;
  onBack: () => void;
  backLabel?: string;
}

type Section = "profile" | "billing" | "whats-new" | "contact";

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

export default function Settings({
  plan,
  submissionUsage,
  onUpgrade,
  onBack,
  backLabel = "Back",
}: SettingsProps) {
  const [section, setSection] = useState<Section>("profile");

  const navItem = (id: Section, label: string, icon: React.ReactNode) => {
    const active = section === id;
    return (
      <button
        key={id}
        onClick={() => setSection(id)}
        className={`w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors mx-1 cursor-pointer ${
          active
            ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        }`}
        style={{ width: "calc(100% - 8px)" }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="bg-white border-r border-[#E2E8F0] flex-shrink-0 w-[220px] flex flex-col py-4">
        {/* Dynamic Contextual Back button */}
        <button
          onClick={onBack}
          className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 px-4 py-2 mb-2 transition-colors cursor-pointer"
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
          <span className="truncate">{backLabel}</span>
        </button>

        {/* MY ACCOUNT */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1 select-none">
            My Account
          </div>
          {navItem(
            "profile",
            "Profile",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        {/* BILLING */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1 select-none">
            Billing
          </div>
          {navItem(
            "billing",
            "Billing & usage",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          )}
        </div>

        {/* SUPPORT */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1 select-none">
            Support
          </div>
          {navItem(
            "whats-new",
            "What's new",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          )}
          {navItem(
            "contact",
            "Contact support",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
          )}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-8 py-10">
          {section === "profile" && <ProfileSection />}
          {section === "billing" && (
            <BillingSection
              plan={plan}
              submissionUsage={submissionUsage}
              onUpgrade={onUpgrade}
            />
          )}
          {section === "whats-new" && <WhatsNewSection />}
          {section === "contact" && <ContactSection />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">My account</h1>
      <p className="text-xs sm:text-sm text-[#64748B] mt-1 mb-8">Manage your personal account details.</p>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        {/* Photo */}
        <div>
          <div className="text-xs font-semibold text-[#0F172A] mb-3">Profile photo</div>
          <div className="flex flex-col items-start gap-2">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white text-base font-semibold flex items-center justify-center">
              HR
            </div>
            <button className="text-xs text-[#2563EB] hover:underline cursor-pointer">Upload photo</button>
          </div>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="text-xs font-medium text-[#0F172A] block mb-1.5">Name</label>
          <input
            type="text"
            defaultValue="Hariharan R"
            className="px-3 py-2 border border-[#E2E8F0] rounded-xl w-full text-xs sm:text-sm outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-xs font-medium text-[#0F172A] block mb-1.5">Email</label>
          <input
            type="email"
            defaultValue="hariharan.creates@gmail.com"
            disabled
            className="px-3 py-2 border border-[#E2E8F0] rounded-xl w-full text-xs sm:text-sm outline-none bg-[#F8FAFC] text-[#64748B]"
          />
          <p className="text-[11px] text-[#94A3B8] mt-1.5">Your email is used to sign in to Gather.</p>
        </div>

        {/* Signed in with */}
        <div className="mt-6 flex items-center gap-2 text-xs text-[#64748B]">
          <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#4285F4]">
            G
          </div>
          Signed in with Google
        </div>

        {/* Save */}
        <button className="mt-6 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer">
          Save changes
        </button>
      </div>
    </div>
  );
}

function BillingSection({
  plan,
  submissionUsage,
  onUpgrade,
}: {
  plan: Plan;
  submissionUsage: number;
  onUpgrade: () => void;
}) {
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
    <div>
      {/* Header */}
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
  );
}

function WhatsNewSection() {
  const updates = [
    {
      date: "Aug 28, 2026",
      title: "AI application generation",
      desc: "Create complete, structured applications from a short description. Gather handles sections, questions, and answer types automatically.",
      tag: "New",
    },
    {
      date: "Aug 22, 2026",
      title: "Rich text question editing",
      desc: "Bold, italic, underline, and link formatting now available in question and description fields.",
      tag: "Improved",
    },
    {
      date: "Aug 15, 2026",
      title: "Submissions dashboard",
      desc: "View, search, and export your application submissions from a single clean interface.",
      tag: "New",
    },
    {
      date: "Aug 8, 2026",
      title: "Application templates",
      desc: "Start faster with ready-made templates for jobs, scholarships, events, volunteers, and more.",
      tag: "New",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">What&apos;s new</h1>
      <p className="text-xs sm:text-sm text-[#64748B] mt-1 mb-8">
        See what&apos;s new and improved in Gather.
      </p>

      {updates.map((u) => (
        <div key={u.title} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">{u.date}</span>
            <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              {u.tag}
            </span>
          </div>
          <div className="text-sm font-semibold text-[#0F172A] mt-1">{u.title}</div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">{u.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ContactSection() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">How can we help?</h1>
      <p className="text-xs sm:text-sm text-[#64748B] mt-1 mb-8">
        Have a question or something not working? We&apos;re here to help.
      </p>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div className="w-12 h-12 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <p className="text-sm font-medium text-[#0F172A] text-center">Chat with us</p>
        <p className="text-xs sm:text-sm text-[#64748B] text-center mt-1">
          We typically reply in a few minutes.
        </p>

        <button className="mt-5 w-full px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer">
          Start a conversation
        </button>

        <a
          href="#"
          className="text-xs text-[#2563EB] hover:underline text-center block mt-3"
        >
          View help center
        </a>

        <p className="text-[11px] text-[#94A3B8] text-center mt-6">
          Support is powered by Crisp. Clicking &quot;Start a conversation&quot; opens the Crisp
          chat widget.
        </p>
      </div>
    </div>
  );
}
