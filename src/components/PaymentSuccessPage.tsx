interface PaymentSuccessPageProps {
  onBackToApps: () => void;
}

export default function PaymentSuccessPage({ onBackToApps }: PaymentSuccessPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-[#0F172A]">You&apos;re now on Gather Pro</h1>
        <p className="text-[#64748B] mt-2 mb-8">Your Pro features are ready to use.</p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm rounded-lg font-medium">
            Unlimited applications
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm rounded-lg font-medium">
            1,000 submissions/month
          </span>
        </div>

        <button
          onClick={onBackToApps}
          className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors mb-3"
        >
          Back to applications
        </button>
        <button className="text-sm text-[#2563EB] hover:underline">
          Manage billing
        </button>
      </div>
    </div>
  );
}
