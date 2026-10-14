export default function Submissions() {
  const submissionsList = [
    {
      initials: "AK",
      name: "Alex Kim",
      date: "Sep 1, 2025",
      status: "Published",
      isDraft: false,
      active: false,
    },
    {
      initials: "JL",
      name: "Jordan Lee",
      date: "Aug 31, 2025",
      status: "Draft",
      isDraft: true,
      active: true,
    },
    {
      initials: "SR",
      name: "Sam Rivera",
      date: "Aug 30, 2025",
      status: "Published",
      isDraft: false,
      active: false,
    },
    {
      initials: "MC",
      name: "Morgan Chen",
      date: "Aug 30, 2025",
      status: "Draft",
      isDraft: true,
      active: false,
    },
    {
      initials: "RP",
      name: "Riley Park",
      date: "Aug 29, 2025",
      status: "Published",
      isDraft: false,
      active: false,
    },
  ];

  return (
    <section
      id="submissions"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Heading & Subtitle */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-4 sm:mb-6"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Once they submit, <br />
            everything stays <br className="hidden sm:inline" />
            organized.
          </h2>

          <p
            className="text-sm sm:text-base text-[#62748E] leading-relaxed max-w-[420px]"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            View your application submissions in Gather and open individual responses when you need to review them.
          </p>
        </div>

        {/* Right Column: 2 Cards (Table + Detail Card) */}
        <div className="lg:col-span-7 flex flex-col gap-5 w-full max-w-[620px] lg:ml-auto">
          {/* Card 1: Submissions Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-[#F1F5F9]">
              <span
                style={{
                  color: "#0F172B",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Submissions
              </span>
              <span
                style={{
                  color: "#8FA0B8",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                5 total
              </span>
            </div>

            {/* Table Grid */}
            <div className="w-full text-left">
              {/* Column Titles */}
              <div className="grid grid-cols-12 px-5 py-2.5 bg-[#FBFDFF] border-b border-[#F1F5F9] text-[10px] font-bold text-[#94A3B8] tracking-wider uppercase">
                <div className="col-span-6">FORM</div>
                <div className="col-span-3">SUBMITTED</div>
                <div className="col-span-3 text-right">STATUS</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-[#F1F5F9]">
                {submissionsList.map((row) => (
                  <div
                    key={row.name}
                    className={`grid grid-cols-12 px-5 py-3 items-center transition-colors ${
                      row.active ? "bg-[#F0F7FF]" : "hover:bg-[#F8FAFD]"
                    }`}
                  >
                    {/* Form / Applicant */}
                    <div className="col-span-6 flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                          row.active
                            ? "bg-[#DBEAFE] text-[#2563EB]"
                            : "bg-[#E2E8F0] text-[#64748B]"
                        }`}
                      >
                        {row.initials}
                      </span>
                      <span
                        style={{
                          color: "#0F172B",
                          fontFamily: "Geist, sans-serif",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {row.name}
                      </span>
                    </div>

                    {/* Submitted Date */}
                    <div
                      className="col-span-3"
                      style={{
                        color: row.active ? "#2563EB" : "#64748B",
                        fontFamily: "Geist, sans-serif",
                        fontSize: "12px",
                        fontWeight: row.active ? 500 : 400,
                      }}
                    >
                      {row.date}
                    </div>

                    {/* Status */}
                    <div className="col-span-3 flex justify-end">
                      {row.status === "Published" ? (
                        <span className="bg-[#EFF6FF] text-[#2563EB] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Jordan Lee Detail Response */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            {/* Detail Card Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9] mb-4">
              <span className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[12px] font-bold flex items-center justify-center flex-shrink-0">
                JL
              </span>
              <div>
                <h4
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  Jordan Lee
                </h4>
                <p
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                  }}
                >
                  Submitted Aug 31, 2025
                </p>
              </div>
            </div>

            {/* 2-Column Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {/* Field 1 */}
              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  FULL NAME
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Jordan Lee
                </span>
              </div>

              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  EMAIL ADDRESS
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  jordan@designstudio.co
                </span>
              </div>

              {/* Field 2 */}
              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  YEARS OF EXPERIENCE
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  2 years
                </span>
              </div>

              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  UX TOOLS YOU USE
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Figma, Maze, Notion
                </span>
              </div>

              {/* Field 3 */}
              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  PORTFOLIO URL
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  jordanlee.design
                </span>
              </div>

              <div>
                <span
                  style={{
                    color: "#94A3B8",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                  className="uppercase block mb-1"
                >
                  LINKEDIN URL
                </span>
                <span
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  linkedin.com/in/jordanlee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
