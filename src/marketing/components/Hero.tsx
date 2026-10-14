export default function Hero() {
  return (
    <section
      className="relative overflow-hidden w-full flex flex-col items-start shrink-0 self-stretch bg-[#F8FAFC] px-5 sm:px-8 lg:px-[80px] pt-12 sm:pt-16 lg:pt-[80px] pb-10 sm:pb-12 lg:pb-[42px] min-h-auto lg:min-h-[1042px]"
    >
      {/* Top Heading & Copy with Exact Typography Specifications */}
      <div className="w-full max-w-4xl mx-auto text-center mb-10 sm:mb-14 lg:mb-16">
        <h1
          className="text-center font-normal text-[#0F172B] text-3xl sm:text-5xl lg:text-[60px] leading-[1.15] lg:leading-[63.6px] tracking-tight lg:tracking-[-1.5px]"
          style={{
            fontFamily: "Geist, sans-serif",
            color: "#0F172B",
          }}
        >
          Describe it. <br />
          We build the application.
        </h1>
        <p
          className="text-center font-normal mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base lg:text-[18px] leading-relaxed lg:leading-[27px]"
          style={{
            fontFamily: "Geist, sans-serif",
            color: "#62748E",
          }}
        >
          Tell Gather what you need to collect, and AI creates a ready-to-publish application for you.
        </p>
      </div>

      {/* Grid Pattern Wrapper with Scattered Squares */}
      <div className="relative w-full max-w-7xl mx-auto flex-1 flex flex-col justify-end">
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute -inset-6 sm:-inset-10 bg-[linear-gradient(to_right,#DBEAFE_1px,transparent_1px),linear-gradient(to_bottom,#DBEAFE_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none rounded-3xl" />

        {/* Scattered Decorative Floating Blue Squares matching reference */}
        <div className="absolute top-4 left-6 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute top-12 left-16 w-4 h-4 bg-[#60A5FA] rounded-xs opacity-75 pointer-events-none" />
        <div className="absolute top-3 left-1/3 w-3 h-3 bg-[#3B82F6] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute top-4 right-10 w-4 h-4 bg-[#60A5FA] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute top-20 right-3 w-3 h-3 bg-[#3B82F6] rounded-xs opacity-70 pointer-events-none" />

        <div className="absolute top-1/3 -left-4 w-3.5 h-3.5 bg-[#60A5FA] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#3B82F6] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute top-2/3 -left-5 w-3.5 h-3.5 bg-[#60A5FA] rounded-xs opacity-75 pointer-events-none" />

        <div className="absolute top-1/3 -right-3 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute top-1/2 -right-5 w-4 h-4 bg-[#60A5FA] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute top-2/3 -right-2 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-90 pointer-events-none" />

        <div className="absolute bottom-6 left-8 w-4 h-4 bg-[#3B82F6] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute bottom-12 left-1/4 w-3.5 h-3.5 bg-[#60A5FA] rounded-xs opacity-75 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-[#60A5FA] rounded-xs opacity-85 pointer-events-none" />
        <div className="absolute bottom-5 right-12 w-3.5 h-3.5 bg-[#3B82F6] rounded-xs opacity-80 pointer-events-none" />
        <div className="absolute bottom-14 right-2 w-3 h-3 bg-[#60A5FA] rounded-xs opacity-70 pointer-events-none" />

        {/* The Main Showcase White Container Card */}
        <div className="relative bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2E8F0]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] leading-tight mb-4">
                Build <br />
                applications <br />
                with AI.
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-8">
                Start with an idea and let Gather create the structure, questions, and sections. Refine everything before you publish.
              </p>

              {/* 4 Feature Points */}
              <div className="space-y-4">
                {/* 1. GENERATION */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 text-xs">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase block">
                      GENERATION
                    </span>
                    <span className="text-xs font-medium text-[#0F172A]">
                      Generate from a prompt
                    </span>
                  </div>
                </div>

                {/* 2. EDITING */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 text-xs">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase block">
                      EDITING
                    </span>
                    <span className="text-xs font-medium text-[#0F172A]">
                      Edit with Ask Gather
                    </span>
                  </div>
                </div>

                {/* 3. STRUCTURE */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 text-xs">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase block">
                      STRUCTURE
                    </span>
                    <span className="text-xs font-medium text-[#0F172A]">
                      Organize sections
                    </span>
                  </div>
                </div>

                {/* 4. REVIEW */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 text-xs">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] tracking-wider uppercase block">
                      REVIEW
                    </span>
                    <span className="text-xs font-medium text-[#0F172A]">
                      Review before publishing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actual Gather Application Builder Canvas */}
          <div className="lg:col-span-8 flex flex-col bg-white">
            {/* App Header Bar */}
            <div className="h-14 px-5 sm:px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white flex-shrink-0">
              {/* Left Breadcrumbs */}
              <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-[#64748B] min-w-0">
                <span className="font-bold text-[#0F172A] text-sm">Gather</span>
                <span className="text-[#CBD5E1]">/</span>
                <span className="text-[#64748B] hidden sm:inline">Applications</span>
                <span className="text-[#CBD5E1] hidden sm:inline">/</span>
                <span className="text-[#0F172A] font-semibold truncate">
                  Junior UX Designer Application
                </span>
              </div>

              {/* Right Action Tabs & Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="flex items-center bg-[#F8FAFC] rounded-lg p-0.5 text-xs border border-[#E2E8F0]">
                  <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] font-semibold rounded-md shadow-2xs">
                    Build
                  </span>
                  <span className="px-2.5 py-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
                    Submissions
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-lg hover:text-[#0F172A] cursor-pointer hidden md:inline">
                  Preview
                </span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Inner Content: Ask Gather Column + Form Builder Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
              {/* Ask Gather Sub-Column */}
              <div className="md:col-span-5 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#E2E8F0] bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                    ASK GATHER
                  </span>

                  {/* Ask Gather Prompt & Response Bubble */}
                  <div className="bg-[#F0F7FF] border border-[#DBEAFE] rounded-xl p-3.5 space-y-2 text-xs">
                    <p className="text-[#64748B] text-[11px] leading-relaxed">
                      &ldquo;Create a job application for a junior UX designer...&rdquo;
                    </p>
                    <p className="text-[#2563EB] font-semibold text-[11px] flex items-center gap-1">
                      <span>★</span>
                      <span>Created your Junior UX Designer Application.</span>
                    </p>
                  </div>
                </div>

                {/* Ask Gather Bottom Pill Input */}
                <div className="mt-8 pt-3">
                  <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                    <span className="text-[11px] text-[#94A3B8] pl-1">Ask Gather...</span>
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] shadow-2xs">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Canvas Column */}
              <div className="md:col-span-7 p-4 sm:p-5 bg-white space-y-3">
                {/* Form Title & Description Box */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A] mb-2">
                    Junior UX Designer Application
                  </h3>
                  <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#94A3B8]">
                    Application description
                  </div>
                </div>

                {/* Section Title */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-2">
                    PERSONAL INFORMATION
                  </span>

                  {/* 5 Questions List */}
                  <div className="space-y-2">
                    {/* 1. First name */}
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">First name</div>
                        <div className="text-[10px] text-[#94A3B8]">Short answer · Required</div>
                      </div>
                      <span className="text-[#94A3B8] text-xs">⋮</span>
                    </div>

                    {/* 2. Last name */}
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">Last name</div>
                        <div className="text-[10px] text-[#94A3B8]">Short answer · Required</div>
                      </div>
                      <span className="text-[#94A3B8] text-xs">⋮</span>
                    </div>

                    {/* 3. Phone Number */}
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">Phone Number</div>
                        <div className="text-[10px] text-[#94A3B8]">Phone</div>
                      </div>
                      <span className="text-[#94A3B8] text-xs">⋮</span>
                    </div>

                    {/* 4. Email */}
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">Email</div>
                        <div className="text-[10px] text-[#94A3B8]">Email</div>
                      </div>
                      <span className="text-[#94A3B8] text-xs">⋮</span>
                    </div>

                    {/* 5. LinkedIn Profile URL */}
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between shadow-2xs">
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A]">LinkedIn Profile URL</div>
                        <div className="text-[10px] text-[#94A3B8]">URL</div>
                      </div>
                      <span className="text-[#94A3B8] text-xs">⋮</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section Tabs */}
                <div className="pt-3 flex flex-wrap items-center gap-2 text-xs border-t border-[#F1F5F9]">
                  <span className="text-[#64748B] hover:text-[#0F172A] cursor-pointer font-medium">
                    + Add section
                  </span>
                  <div className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-lg border border-[#BFDBFE] font-medium flex items-center gap-1.5 shadow-2xs">
                    <span>⠿</span>
                    <span>Experience</span>
                    <span className="text-[#94A3B8]">⋮</span>
                  </div>
                  <div className="px-2.5 py-1 bg-[#F8FAFC] text-[#64748B] rounded-lg border border-[#E2E8F0] font-medium flex items-center gap-1.5">
                    <span>⠿</span>
                    <span>Education</span>
                    <span className="text-[#94A3B8]">⋮</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
