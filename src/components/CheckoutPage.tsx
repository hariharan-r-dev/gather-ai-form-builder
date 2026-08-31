interface CheckoutPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CHECKOUT_FEATURES = [
  "Unlimited applications",
  "1,000 submissions/month",
  "Remove Gather branding",
  "Custom branding",
  "CSV export",
  "QR code sharing",
  "Priority support",
];

export default function CheckoutPage({ onSuccess, onBack }: CheckoutPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-2 gap-12 max-w-3xl mx-auto px-6 py-12">
        {/* Left column */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to plans
          </button>
          <h1 className="text-xl font-semibold text-[#0F172A] mb-6">Upgrade to Gather Pro</h1>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="text-base font-semibold text-[#0F172A]">Gather Pro</p>
            <div className="flex items-baseline gap-1 mt-1 mb-4">
              <span className="text-lg font-semibold text-[#0F172A]">$12</span>
              <span className="text-sm text-[#64748B]">/month</span>
            </div>
            <ul className="space-y-2.5">
              {CHECKOUT_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#0F172A]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" className="flex-shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column */}
        <div>
          <p className="text-sm font-semibold text-[#0F172A] mb-4">Payment</p>

          <div className="mb-4">
            <label className="block text-xs text-[#64748B] mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="px-3 py-2.5 border border-[#E2E8F0] rounded-xl w-full text-sm outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 mb-4">
            <svg width="24" height="16" viewBox="0 0 38 24" fill="none">
              <rect width="38" height="24" rx="4" fill="#E2E8F0" />
              <rect x="0" y="8" width="38" height="7" fill="#CBD5E1" />
              <rect x="6" y="14" width="10" height="4" rx="1" fill="#94A3B8" />
            </svg>
            <span className="text-sm text-[#94A3B8]">Card ending in ···· 4242</span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-[#64748B]">Gather Pro · Monthly</span>
              <span className="text-[#0F172A]">$12</span>
            </div>
            <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-sm">
              <span className="text-[#0F172A]">Total</span>
              <span className="font-semibold text-[#0F172A]">$12</span>
            </div>
          </div>

          <button
            onClick={onSuccess}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors mt-4"
          >
            Start Pro
          </button>
          <p className="text-xs text-[#94A3B8] text-center mt-2">Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  );
}
