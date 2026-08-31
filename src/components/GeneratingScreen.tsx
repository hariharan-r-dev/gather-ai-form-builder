import { useEffect, useState } from "react";

const STEPS = [
  "Understanding your requirements",
  "Planning sections",
  "Creating questions",
  "Choosing field types",
  "Reviewing application",
];

interface GeneratingScreenProps {
  prompt: string;
  onDone: () => void;
}

export default function GeneratingScreen({ prompt, onDone }: GeneratingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < STEPS.length) {
        setCompletedSteps((prev) => [...prev, i]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        setTimeout(onDone, 600);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 relative flex-shrink-0">
            {!done ? (
              <svg className="animate-spin text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg className="text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <h2 className="text-base font-semibold text-[#0F172A]">Creating your application</h2>
        </div>

        {prompt && (
          <div className="bg-[#EFF6FF] rounded-xl px-3.5 py-2.5 mb-6 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 mt-0.5 text-[#2563EB] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <p className="text-xs text-[#1D4ED8] leading-relaxed">{prompt}</p>
          </div>
        )}

        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isComplete = completedSteps.includes(idx);
            const isActive = !isComplete && completedSteps.length === idx;
            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isComplete
                      ? "bg-[#2563EB]"
                      : isActive
                      ? "border-2 border-[#2563EB] border-t-transparent animate-spin"
                      : "border border-[#E2E8F0]"
                  }`}
                >
                  {isComplete && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isComplete ? "text-[#0F172A]" : isActive ? "text-[#2563EB]" : "text-[#CBD5E1]"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
