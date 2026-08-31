export type UpgradeModalTrigger = "submission-limit" | "app-limit" | "csv-export" | "branding" | "generic";

interface UpgradeModalProps {
  trigger: UpgradeModalTrigger;
  onUpgrade: () => void;
  onClose: () => void;
}

const CONTENT: Record<UpgradeModalTrigger, { heading: string; body: string }> = {
  "submission-limit": {
    heading: "You've reached your free submission limit",
    body: "You've collected 10 of 10 submissions this month. Upgrade to Pro to continue collecting submissions.",
  },
  "app-limit": {
    heading: "Upgrade to publish more applications",
    body: "Free includes 1 published application. Pro includes unlimited applications.",
  },
  "csv-export": {
    heading: "CSV export is a Pro feature",
    body: "Export your submissions as a CSV file with Gather Pro.",
  },
  branding: {
    heading: "Remove Gather branding with Pro",
    body: "Make every application fully yours with custom branding.",
  },
  generic: {
    heading: "Upgrade to Gather Pro",
    body: "Unlock unlimited applications, 1,000 submissions/month, custom branding, and more.",
  },
};

const FEATURES = [
  "Unlimited applications",
  "1,000 submissions/month",
  "Custom branding & CSV export",
];

export default function UpgradeModal({ trigger, onUpgrade, onClose }: UpgradeModalProps) {
  const { heading, body } = CONTENT[trigger];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#0F172A] mb-2">{heading}</h2>
        <p className="text-sm text-[#64748B] mb-5">{body}</p>

        <ul className="space-y-2 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="text-xs text-[#64748B] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-1 mb-5">
          <span className="text-2xl font-semibold text-[#0F172A]">$12</span>
          <span className="text-sm text-[#64748B]">/month</span>
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-2.5 text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl transition-colors mb-2"
        >
          Upgrade to Pro
        </button>
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
