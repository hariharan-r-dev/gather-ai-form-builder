import { useState, useMemo } from "react";
import { RECOMMENDATIONS } from "../../data/promptRecommendations";
import RecommendationCard from "./RecommendationCard";

interface PromptRecommendationsProps {
  onUseRecommendation: (prompt: string) => void;
}

export default function PromptRecommendations({ onUseRecommendation }: PromptRecommendationsProps) {
  const [dismissedRecs, setDismissedRecs] = useState<number[]>([]);

  const visibleRecs = useMemo(() => {
    const pool = RECOMMENDATIONS.map((r, i) => ({ rec: r, index: i })).filter(
      ({ index }) => !dismissedRecs.includes(index)
    );
    return pool.slice(0, 4);
  }, [dismissedRecs]);

  function dismissRec(recIndex: number) {
    setDismissedRecs((prev) => [...prev, recIndex]);
  }

  if (visibleRecs.length === 0) return null;

  return (
    <div className="flex justify-center px-6 pt-6 flex-shrink-0">
      <div className="w-full" style={{ maxWidth: 896 }}>
        <p className="text-[14px] font-semibold text-[#0F172A] leading-[20px]">Start with an idea</p>
        <p className="text-[12px] text-[#64748B] leading-[16px] mt-1">
          Tell Gather what you need, or start with one of these.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {visibleRecs.map(({ rec, index }) => (
            <RecommendationCard
              key={index}
              rec={rec}
              onUse={() => onUseRecommendation(rec)}
              onDismiss={() => dismissRec(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
