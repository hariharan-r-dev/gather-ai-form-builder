import { Plan } from "../types";

interface PricingPageProps {
  plan: Plan;
  onUpgrade: () => void;
  onBack: () => void;
}

const FREE_FEATURES = [
  "AI generation",
  "AI editing",
  "1 application",
  "10 submissions/month",
  "Basic templates",
  "Gather branding",
  "File uploads",
  "Basic analytics",
];

const PRO_FEATURES = [
  "AI generation",
  "AI editing",
  "Unlimited applications",
  "1,000 submissions/month",
  "All templates",
  "Remove Gather branding",
  "Custom branding",
  "File uploads",
  "Full analytics",
  "CSV export",
  "QR code sharing",
  "Priority support",
];

const COMPARISON_ROWS: { feature: string; free: string; pro: string }[] = [
  { feature: "AI generation", free: "✓", pro: "✓" },
  { feature: "AI editing", free: "✓", pro: "✓" },
  { feature: "Applications", free: "1", pro: "Unlimited" },
  { feature: "Submissions", free: "10/month", pro: "1,000/month" },
  { feature: "Templates", free: "Basic", pro: "All" },
  { feature: "Gather branding", free: "Included", pro: "Removed" },
  { feature: "Custom branding", free: "—", pro: "✓" },
  { feature: "File uploads", free: "✓", pro: "✓" },
  { feature: "Analytics", free: "Basic", pro: "✓" },
  { feature: "CSV export", free: "—", pro: "✓" },
  { feature: "QR code", free: "—", pro: "✓" },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" className="flex-shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function PricingPage({ plan, onUpgrade, onBack }: PricingPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12 relative">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#0F172A]">Simple plans. More room to gather.</h1>
          <p className="text-[#64748B] mt-2">Start free and upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Free card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
            <p className="text-sm font-semibold text-[#64748B] mb-3">Free</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-[#0F172A]">$0</span>
              <span className="text-sm text-[#64748B]">/month</span>
            </div>
            <p className="text-sm text-[#64748B] mb-5">For trying Gather and creating simple applications.</p>
            <ul className="space-y-2.5 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#0F172A]">
                  <CheckIcon color="#64748B" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-2.5 text-sm font-medium border border-[#E2E8F0] rounded-xl text-[#94A3B8] cursor-default bg-[#F8FAFC]"
            >
              Current plan
            </button>
          </div>

          {/* Pro card */}
          <div className="bg-[#EFF6FF] border-2 border-[#2563EB] rounded-2xl p-6 relative">
            <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#2563EB] text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
              Recommended
            </span>
            <p className="text-sm font-semibold text-[#2563EB] mb-3">Pro</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-[#0F172A]">$12</span>
              <span className="text-sm text-[#64748B]">/month</span>
            </div>
            <p className="text-sm text-[#64748B] mb-5">For people who regularly create and collect applications.</p>
            <ul className="space-y-2.5 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#0F172A]">
                  <CheckIcon color="#2563EB" />
                  {f}
                </li>
              ))}
            </ul>
            {plan === "pro" ? (
              <button
                disabled
                className="w-full py-2.5 text-sm font-medium border border-[#E2E8F0] rounded-xl text-[#94A3B8] cursor-default bg-[#F8FAFC]"
              >
                Current plan
              </button>
            ) : (
              <button
                onClick={onUpgrade}
                className="w-full py-2.5 text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl transition-colors"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
            Everything you need to create and collect applications.
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left text-xs font-medium text-[#64748B] pb-2 px-1">Feature</th>
                <th className="text-center text-xs font-medium text-[#64748B] pb-2 px-1">Free</th>
                <th className="text-center text-xs font-medium text-[#64748B] pb-2 px-1">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={row.feature} className={i < COMPARISON_ROWS.length - 1 ? "border-b border-[#F1F5F9]" : ""}>
                  <td className="py-3 px-1 text-[#0F172A]">{row.feature}</td>
                  <td className="py-3 px-1 text-center text-[#64748B]">{row.free}</td>
                  <td className="py-3 px-1 text-center text-[#0F172A]">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
