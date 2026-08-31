const imgSparkle = "/assets/9e203.svg";
const imgClose = "/assets/c7c66.svg";

interface RecommendationCardProps {
  rec: string;
  onUse: () => void;
  onDismiss: () => void;
}

export default function RecommendationCard({ rec, onUse, onDismiss }: RecommendationCardProps) {
  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col flex-1"
      style={{ minWidth: 300, maxWidth: 420 }}
    >
      <div className="flex items-start gap-2.5 w-full">
        {/* Sparkle icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="bg-[#EFF6FF] w-6 h-6 rounded-xl flex items-center justify-center">
            <img src={imgSparkle} alt="" width={12} height={12} />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2.5 min-w-0 py-0.5">
          <p className="text-[13px] font-medium text-[#0F172A] leading-[17.875px]">{rec}</p>
          <button
            onClick={onUse}
            className="self-start border border-[#BFDBFE] text-[#2563EB] text-[12px] font-medium px-2 py-[3px] rounded-lg leading-[16px] hover:bg-[#EFF6FF] transition-colors"
          >
            Use this Form
          </button>
        </div>

        {/* Dismiss */}
        <button onClick={onDismiss} className="flex-shrink-0 ml-1 pt-0.5" aria-label="Dismiss">
          <img
            src={imgClose}
            alt=""
            width={12}
            height={12}
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
}
