export default function Features() {
  const features = [
    {
      title: "AI application generation",
      description: "Describe what you're collecting and Gather creates the application structure for you.",
      ui: (
        <div className="bg-[#F0F6FF] border border-[#DBEAFE] rounded-xl p-4 flex flex-col justify-center h-[148px]">
          <span
            className="block uppercase tracking-wider mb-3"
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: "0.08em",
            }}
          >
            GENERATING
          </span>
          <div className="space-y-2">
            <div className="h-2 bg-[#93C5FD] rounded-full w-[85%]" />
            <div className="h-2 bg-[#BFDBFE] rounded-full w-[65%]" />
            <div className="h-2 bg-[#DBEAFE] rounded-full w-[45%]" />
          </div>
        </div>
      ),
    },
    {
      title: "Smart application structure",
      description: "Gather organizes your application into relevant sections and questions based on your request.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between h-[148px]">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#0F172B]">Personal Info</span>
            <span className="text-[11px] text-[#94A3B8]">3 fields</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#0F172B]">Experience</span>
            <span className="text-[11px] text-[#94A3B8]">2 fields</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#0F172B]">Portfolio</span>
            <span className="text-[11px] text-[#94A3B8]">2 fields</span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-[#0F172B]">About You</span>
            <span className="text-[11px] text-[#94A3B8]">2 fields</span>
          </div>
        </div>
      ),
    },
    {
      title: "Edit and refine",
      description: "Review the generated application and change questions, fields, and structure before publishing.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between h-[148px]">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-1.5 px-2.5 flex items-center justify-between text-[11.5px] shadow-2xs">
            <span className="font-medium text-[#0F172B]">Full name</span>
            <div className="flex items-center gap-1">
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#64748B] font-medium bg-white">
                Edit
              </span>
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#94A3B8] font-medium bg-white">
                ✕
              </span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-1.5 px-2.5 flex items-center justify-between text-[11.5px] shadow-2xs">
            <span className="font-medium text-[#0F172B]">Email address</span>
            <div className="flex items-center gap-1">
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#64748B] font-medium bg-white">
                Edit
              </span>
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#94A3B8] font-medium bg-white">
                ✕
              </span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-1.5 px-2.5 flex items-center justify-between text-[11.5px] shadow-2xs">
            <span className="font-medium text-[#0F172B]">Portfolio URL</span>
            <div className="flex items-center gap-1">
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#64748B] font-medium bg-white">
                Edit
              </span>
              <span className="border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9.5px] text-[#94A3B8] font-medium bg-white">
                ✕
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "AI assistance",
      description: "Use Gather's AI assistance while creating and refining your application.",
      ui: (
        <div className="bg-[#F0F6FF] border border-[#DBEAFE] rounded-xl p-3.5 flex flex-col justify-between h-[148px]">
          <div className="bg-white border border-[#DBEAFE] rounded-lg p-2.5 text-[11.5px] text-[#475569] leading-relaxed shadow-2xs">
            &ldquo;Add a section for portfolio links..*&rdquo;
          </div>
          <span
            className="block"
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "#2563EB",
            }}
          >
            Updating application..
          </span>
        </div>
      ),
    },
    {
      title: "Preview before publishing",
      description: "Review the application experience before making it live.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-center h-[148px]">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between h-full shadow-2xs">
            <div className="h-2 bg-[#CBD5E1] rounded-full w-[45%] mt-0.5" />
            <div className="h-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md w-full" />
            <div className="h-6.5 bg-[#2563EB] rounded-md w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "Publish and share",
      description: "Publish your application and share the application link.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-center gap-3.5 h-[148px]">
          <div className="flex items-center gap-1.5 text-[#2563EB] text-[11.5px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Published</span>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 flex items-center justify-between text-[11px] shadow-2xs">
            <span className="font-mono text-[#64748B] truncate">gather.app/apply/junior-ux-2..</span>
            <span className="text-[#2563EB] font-semibold hover:underline cursor-pointer ml-1.5">
              Copy
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Collect submissions",
      description: "Receive application submissions through your published application.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-between h-[148px]">
          <div className="flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-2">
              <span className="w-5.5 h-5.5 rounded-full bg-[#E2E8F0] text-[#64748B] text-[9.5px] flex items-center justify-center font-bold">
                AK
              </span>
              <span className="font-medium text-[#0F172B]">Alex Kim</span>
            </div>
            <span className="text-[10.5px] text-[#94A3B8]">Sep 1</span>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-2">
              <span className="w-5.5 h-5.5 rounded-full bg-[#E2E8F0] text-[#64748B] text-[9.5px] flex items-center justify-center font-bold">
                JL
              </span>
              <span className="font-medium text-[#0F172B]">Jordan Lee</span>
            </div>
            <span className="text-[10.5px] text-[#94A3B8]">Aug 31</span>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-2">
              <span className="w-5.5 h-5.5 rounded-full bg-[#E2E8F0] text-[#64748B] text-[9.5px] flex items-center justify-center font-bold">
                SR
              </span>
              <span className="font-medium text-[#0F172B]">Sam Rivera</span>
            </div>
            <span className="text-[10.5px] text-[#94A3B8]">Aug 30</span>
          </div>
        </div>
      ),
    },
    {
      title: "Review submissions",
      description: "View submitted applications and review individual responses.",
      ui: (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex flex-col justify-center h-[148px]">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 space-y-2 shadow-2xs h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] flex items-center justify-center font-bold">
                JL
              </span>
              <div>
                <div className="text-[11.5px] font-semibold text-[#0F172B] leading-none">
                  Jordan Lee
                </div>
                <div className="text-[9.5px] text-[#94A3B8] mt-0.5">Aug 31, 2025</div>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[8.5px] font-bold text-[#94A3B8] tracking-wider uppercase block">
                FULL NAME
              </span>
              <div className="h-1.5 bg-[#E2E8F0] rounded-full w-[70%] mb-1.5" />
              <span className="text-[8.5px] font-bold text-[#94A3B8] tracking-wider uppercase block">
                EMAIL
              </span>
              <div className="h-1.5 bg-[#E2E8F0] rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="features"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-white px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-start">
        {/* Section Header */}
        <div className="w-full max-w-[672px] mb-10 sm:mb-12 pt-3 flex flex-col items-start">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B]"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Everything you need to build and collect applications.
          </h2>
        </div>

        {/* 8 Features Grid (4x2 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="mb-6 min-h-[72px]">
                <h3
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    alignSelf: "stretch",
                    color: "#62748E",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "19.5px",
                  }}
                >
                  {feat.description}
                </p>
              </div>

              {/* Product UI Visualization */}
              <div className="w-full mt-auto">{feat.ui}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
