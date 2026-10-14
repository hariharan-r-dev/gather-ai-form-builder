import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AppProvider";

export default function PricingSection() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [showFreeFeatures, setShowFreeFeatures] = useState(false);
  const [showProFeatures, setShowProFeatures] = useState(false);

  function handleFreeCTA() {
    if (isSignedIn) {
      navigate("/app");
    } else {
      navigate("/signup");
    }
  }

  function handleProCTA() {
    if (isSignedIn) {
      navigate("/app/pricing");
    } else {
      navigate("/signup");
    }
  }

  const checkIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const comparisonRows = [
    {
      feature: "AI form generation & editing",
      free: checkIcon,
      pro: checkIcon,
    },
    {
      feature: "Submissions per month",
      free: "10",
      pro: "1,000",
    },
    {
      feature: "Published forms",
      free: "1",
      pro: "Unlimited",
    },
    {
      feature: "Total forms",
      free: "Unlimited",
      pro: "Unlimited",
    },
    {
      feature: "Questions & sections per form",
      free: "Unlimited",
      pro: "Unlimited",
    },
    {
      feature: "File upload",
      free: "Up to 10MB",
      pro: "Up to 50MB",
    },
    {
      feature: "Remove Gather branding",
      free: <span className="text-[#94A3B8] font-normal text-base sm:text-lg leading-none">—</span>,
      pro: checkIcon,
    },
    {
      feature: "CSV response export",
      free: checkIcon,
      pro: checkIcon,
    },
    {
      feature: "Priority support",
      free: <span className="text-[#94A3B8] font-normal text-base sm:text-lg leading-none">—</span>,
      pro: checkIcon,
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-3"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Simple plans. <br />
            More room to gather.
          </h2>
          <p
            className="text-sm sm:text-[15px] text-[#62748E] leading-relaxed"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* 2 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px] w-full mb-16 items-stretch">
          {/* Free Plan Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 md:p-8 shadow-xs flex flex-col h-full">
            <h3
              style={{
                color: "#0F172B",
                fontFamily: "Geist, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Free
            </h3>

            <div className="flex items-baseline gap-1 mb-2">
              <span
                style={{
                  color: "#0F172B",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                }}
              >
                $0
              </span>
            </div>

            <p
              style={{
                color: "#64748B",
                fontFamily: "Geist, sans-serif",
                fontSize: "12.5px",
                lineHeight: "1.5",
                marginBottom: "20px",
                minHeight: "38px",
              }}
            >
              For trying Gather and creating your first Forms.
            </p>

            {/* CTA Button placed above features */}
            <button
              type="button"
              onClick={handleFreeCTA}
              className="w-full py-2.5 px-4 rounded-lg text-[13px] font-medium text-[#0F172B] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer mb-3 md:mb-7 shadow-2xs text-center"
            >
              Get Started
            </button>

            {/* Mobile Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setShowFreeFeatures((prev) => !prev)}
              className="md:hidden w-full flex items-center justify-center gap-1.5 py-1 text-[13px] font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors cursor-pointer"
            >
              <span>{showFreeFeatures ? "Hide Features" : "Show Features"}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  showFreeFeatures ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Features List */}
            <div
              className={`${
                showFreeFeatures ? "block" : "hidden"
              } md:block space-y-3 pt-4 border-t border-[#F1F5F9] md:border-0 md:pt-0`}
            >
              {[
                "1 published application",
                "10 submissions / month",
                "AI generation & editing",
                "File uploads up to 10MB",
                "CSV response export",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span
                    style={{
                      color: "#334155",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan Card */}
          <div className="bg-white rounded-2xl border border-[#3B82F6] p-6 sm:p-7 md:p-8 shadow-xs flex flex-col h-full relative">
            <div className="absolute top-6 right-6 bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-[#BFDBFE]">
              Recommended
            </div>

            <h3
              style={{
                color: "#0F172B",
                fontFamily: "Geist, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Pro
            </h3>

            <div className="flex items-baseline gap-1 mb-2">
              <span
                style={{
                  color: "#0F172B",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: "1.1",
                  letterSpacing: "-0.02em",
                }}
              >
                $12
              </span>
              <span
                style={{
                  color: "#64748B",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                }}
              >
                /mo
              </span>
            </div>

            <p
              style={{
                color: "#64748B",
                fontFamily: "Geist, sans-serif",
                fontSize: "12.5px",
                lineHeight: "1.5",
                marginBottom: "20px",
                minHeight: "38px",
              }}
            >
              For collecting regular submissions with more room to grow.
            </p>

            {/* CTA Button placed above features */}
            <button
              type="button"
              onClick={handleProCTA}
              className="w-full py-2.5 px-4 rounded-lg text-[13px] font-medium text-white bg-[#155DFC] hover:bg-[#124bce] transition-colors shadow-2xs cursor-pointer mb-3 md:mb-7 flex items-center justify-center text-center"
            >
              Get Started
            </button>

            {/* Mobile Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setShowProFeatures((prev) => !prev)}
              className="md:hidden w-full flex items-center justify-center gap-1.5 py-1 text-[13px] font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors cursor-pointer"
            >
              <span>{showProFeatures ? "Hide Features" : "Show Features"}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  showProFeatures ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Features List */}
            <div
              className={`${
                showProFeatures ? "block" : "hidden"
              } md:block space-y-3 pt-4 border-t border-[#F1F5F9] md:border-0 md:pt-0`}
            >
              {[
                "Unlimited published applications",
                "1,000 submissions / month",
                "AI generation & editing",
                "File uploads up to 50MB",
                "Remove Gather branding",
                "CSV response export",
                "Priority support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span
                    style={{
                      color: "#334155",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-[760px] w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-12 px-6 sm:px-8 py-4 sm:py-4.5 bg-[#F8FAFC] border-b border-[#F1F5F9] text-[14.5px] sm:text-[15px] font-semibold">
                <div className="col-span-6 text-[#0F172B] font-semibold">Feature</div>
                <div className="col-span-3 text-center text-[#0F172B] font-semibold">Free</div>
                <div className="col-span-3 text-center text-[#155DFC] font-semibold">Pro</div>
              </div>

              <div className="divide-y divide-[#F1F5F9]">
                {comparisonRows.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-12 px-6 sm:px-8 py-4 sm:py-4.5 items-center hover:bg-[#F8FAFD] transition-colors text-[14px] sm:text-[14.5px]"
                  >
                    <div className="col-span-6 text-[#1E293B] font-normal leading-relaxed">
                      {row.feature}
                    </div>
                    <div className="col-span-3 text-center text-[#475569] flex items-center justify-center">
                      {row.free}
                    </div>
                    <div className="col-span-3 text-center text-[#1E293B] font-normal flex items-center justify-center">
                      {row.pro}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

