interface FreeBannerProps {
  usageCount: number;
  limit: number;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export default function FreeBanner({ usageCount, limit, onUpgrade, onDismiss }: FreeBannerProps) {
  const atLimit = usageCount >= limit;
  const nearLimit = usageCount >= 8 && !atLimit;

  const bannerClass = atLimit
    ? "bg-[#FFFBEB] border-b border-[#FDE68A]"
    : "bg-[#EFF6FF] border-b border-[#BFDBFE]";

  const iconColor = nearLimit || atLimit ? "#F59E0B" : "#2563EB";

  let message: React.ReactNode;
  if (atLimit) {
    message = (
      <>
        You&apos;ve reached your <strong>10 submission limit</strong> for this month.
      </>
    );
  } else if (nearLimit) {
    message = (
      <>
        You&apos;ve used <strong>{usageCount} of 10</strong> submissions this month.
      </>
    );
  } else {
    message = (
      <>
        You can collect <strong>10 submissions</strong> this month for free.
      </>
    );
  }

  return (
    <div className={`${bannerClass} h-14 flex items-center px-6 justify-between flex-shrink-0`}>
      <div className="w-6" />
      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill={iconColor} stroke={iconColor} strokeWidth="1">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span>{message}</span>
        <button
          onClick={onUpgrade}
          className="px-3 py-1.5 text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition-colors ml-3"
        >
          Get more submissions
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="p-1.5 text-[#94A3B8] hover:text-[#64748B] transition-colors"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
