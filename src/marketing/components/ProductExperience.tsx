export default function ProductExperience() {
  const checklist = [
    "Every question is editable",
    "Add, remove, or reorder fields",
    "Control required and optional fields",
    "Preview before publishing",
  ];

  const sections = [
    {
      label: "PERSONAL INFORMATION",
      items: [
        {
          title: "Full name",
          type: "Short text",
          required: true,
        },
        {
          title: "Email address",
          type: "Email",
          required: true,
        },
        {
          title: "Phone number",
          type: "Short text",
          required: false,
        },
      ],
    },
    {
      label: "EXPERIENCE",
      items: [
        {
          title: "Years of experience",
          type: "Dropdown",
          required: false,
        },
        {
          title: "UX tools you use",
          type: "Short text",
          required: false,
        },
      ],
    },
    {
      label: "PORTFOLIO",
      items: [
        {
          title: "Portfolio URL",
          type: "URL",
          required: true,
        },
        {
          title: "Design process",
          type: "Long text",
          required: true,
        },
      ],
    },
  ];

  return (
    <section
      id="product-experience"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch bg-[#0F172B] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Headline, Copy & Checklist */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-white mb-5 sm:mb-6"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            AI builds the starting point. <br />
            You make it yours.
          </h2>

          <p
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mb-7 sm:mb-9 max-w-[460px]"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Gather gives you a complete application to work from, while keeping every important part editable.
          </p>

          {/* Checklist */}
          <div className="space-y-4">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-[4px] bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#3B82F6] flex-shrink-0">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span
                  style={{
                    color: "#CBD5E1",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Application Editor Card Mockup */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xl w-full max-w-[620px]">
            {/* Header: Title & Action Buttons */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "22px",
                  }}
                >
                  Junior UX Designer Application
                </h3>
                <span
                  style={{
                    color: "#64748B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                >
                  7 questions · 3 sections
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="bg-white border border-[#E2E8F0] text-[#0F172B] hover:bg-slate-50 transition-colors rounded-lg px-3.5 py-1.5 text-[12px] font-medium shadow-2xs cursor-pointer"
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="bg-[#155DFC] text-white hover:bg-[#124bce] transition-colors rounded-lg px-4 py-1.5 text-[12px] font-medium shadow-2xs cursor-pointer"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Sections & Form Fields */}
            <div className="space-y-4 pt-4">
              {sections.map((section) => (
                <div key={section.label} className="space-y-2">
                  {/* Section Divider & Label */}
                  <div className="flex items-center gap-3">
                    <span
                      style={{
                        color: "#94A3B8",
                        fontFamily: "Geist, sans-serif",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                      className="uppercase whitespace-nowrap"
                    >
                      {section.label}
                    </span>
                    <div className="h-[1px] bg-[#F1F5F9] w-full" />
                  </div>

                  {/* Question Rows */}
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.title}
                        className="bg-[#F8FAFD] border border-[#EBF2FA] rounded-xl p-2.5 px-3.5 flex items-center justify-between shadow-2xs hover:border-[#DBEAFE] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Drag Handle Icon */}
                          <svg
                            className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M2 4.5h12v1H2zm0 3h12v1H2zm0 3h12v1H2z" />
                          </svg>

                          <div>
                            <div
                              style={{
                                color: "#0F172B",
                                fontFamily: "Geist, sans-serif",
                                fontSize: "12.5px",
                                fontWeight: 500,
                                lineHeight: "17px",
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                color: "#94A3B8",
                                fontFamily: "Geist, sans-serif",
                                fontSize: "10.5px",
                                fontWeight: 400,
                              }}
                            >
                              {item.type}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          {item.required && (
                            <span className="border border-[#E2E8F0] bg-white rounded px-2 py-0.5 text-[10px] font-medium text-[#64748B] shadow-2xs">
                              Required
                            </span>
                          )}
                          <span className="border border-[#E2E8F0] bg-white rounded px-2 py-0.5 text-[10px] font-medium text-[#64748B] shadow-2xs cursor-pointer hover:bg-slate-50">
                            Edit
                          </span>
                          <span className="border border-[#E2E8F0] bg-white rounded px-1.5 py-0.5 text-[10px] font-medium text-[#94A3B8] shadow-2xs cursor-pointer hover:bg-slate-50">
                            ✕
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Bottom Add Question Button */}
              <div className="border border-dashed border-[#E2E8F0] rounded-xl py-3 flex items-center justify-center text-[#64748B] text-[12px] font-medium bg-white hover:bg-[#F8FAFD] transition-colors cursor-pointer shadow-2xs">
                + Add question
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
