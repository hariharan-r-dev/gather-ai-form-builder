import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";

export default function WhatsNewPage() {
  const [filter, setFilter] = useState<"all" | "whats-new" | "coming-soon">("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#BFDBFE] selection:text-[#1E40AF]">
      {/* Top Header Breadcrumb Bar */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-5 sm:px-8 lg:px-[80px] py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[13.5px]">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#475569] hover:text-[#0F172B] transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white shadow-2xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
                  <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
                  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
                </svg>
              </div>
              <span className="font-normal text-[#475569]">Gather</span>
            </Link>
            <span className="text-[#CBD5E1] font-light">/</span>
            <span className="text-[#0F172B] font-semibold">What&apos;s New</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[720px] mx-auto w-full px-5 sm:px-6 pt-12 sm:pt-16 pb-20">
        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h1
            className="text-[36px] sm:text-[40px] font-bold text-[#0F172B] tracking-tight mb-2 leading-tight"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            What&apos;s new
          </h1>
          <p
            className="text-[14.5px] text-[#62748E] leading-normal"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            See what&apos;s new in Gather and what&apos;s coming next.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="inline-flex items-center p-1 bg-white rounded-lg border border-[#E2E8F0] shadow-2xs mb-10">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-[#0F172B] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172B]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("whats-new")}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
              filter === "whats-new"
                ? "bg-[#0F172B] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172B]"
            }`}
          >
            What&apos;s new
          </button>
          <button
            type="button"
            onClick={() => setFilter("coming-soon")}
            className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
              filter === "coming-soon"
                ? "bg-[#0F172B] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172B]"
            }`}
          >
            Coming soon
          </button>
        </div>

        {/* Section 1: WHAT'S NEW */}
        {(filter === "all" || filter === "whats-new") && (
          <section className="mb-12">
            {/* Header with Divider Line */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-semibold text-[#94A3B8] tracking-widest uppercase flex-shrink-0">
                WHAT&apos;S NEW
              </span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Grouped Cards with Divider Lines */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#F1F5F9] overflow-hidden">
              {/* Card 1 */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                    WHAT&apos;S NEW
                  </span>
                  <Link
                    to="/whats-new/ai-application-generation"
                    className="text-[#2563EB] text-[13px] font-medium hover:underline inline-flex items-center gap-1 group"
                  >
                    Learn more <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172B] mb-1">
                  AI application generation
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Create an application from an idea with Gather&apos;s AI.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                    WHAT&apos;S NEW
                  </span>
                  <Link
                    to="/whats-new/improved-application-editor"
                    className="text-[#2563EB] text-[13px] font-medium hover:underline inline-flex items-center gap-1 group"
                  >
                    Learn more <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172B] mb-1">
                  Improved application editor
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Refine questions and sections more easily before publishing.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                    WHAT&apos;S NEW
                  </span>
                  <Link
                    to="/whats-new/new-templates"
                    className="text-[#2563EB] text-[13px] font-medium hover:underline inline-flex items-center gap-1 group"
                  >
                    Explore templates <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172B] mb-1">
                  New templates
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Start from ready-made application structures instead of building everything from scratch.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: COMING SOON */}
        {(filter === "all" || filter === "coming-soon") && (
          <section className="mb-12">
            {/* Header with Divider Line & Subtext */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] font-semibold text-[#94A3B8] tracking-widest uppercase flex-shrink-0">
                COMING SOON
              </span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>
            <p className="text-[12.5px] text-[#64748B] mb-4">
              Things we&apos;re working on.
            </p>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs">
              <span className="inline-block bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-2.5">
                COMING SOON
              </span>
              <h3 className="text-[15px] font-bold text-[#0F172B] mb-1">
                Feature name
              </h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                Short explanation of what it will allow users to do.
              </p>
            </div>
          </section>
        )}

        {/* Callout Box: "Have an idea for Gather?" */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 sm:p-10 shadow-2xs text-center flex flex-col items-center justify-center mt-12 mb-16">
          <h3 className="text-[16px] font-bold text-[#0F172B] mb-1">
            Have an idea for Gather?
          </h3>
          <p className="text-[13px] text-[#64748B] mb-5">
            Tell us what you&apos;d like to see next.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0F172B] hover:bg-[#1E293B] text-white text-[12.5px] font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Contact support
          </Link>
        </div>
      </main>

      {/* Dark Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}


