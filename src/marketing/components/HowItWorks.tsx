export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-white px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px] min-h-auto lg:min-h-[1033px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-start h-full">
        {/* Section Header */}
        <div className="max-w-2xl text-left">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B]"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            From an idea to a ready-to- <br />
            publish application.
          </h2>
          <div className="pt-3 flex flex-col items-start">
            <p
              className="w-full max-w-full sm:max-w-[448px] text-[#62748E] text-sm sm:text-base lg:text-[17px] leading-relaxed lg:leading-[27.625px]"
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 400,
              }}
            >
              Gather handles the setup so you can focus on what you want to collect.
            </p>
          </div>
        </div>

        {/* Product Mockups Section Wrapper */}
        <div className="w-full pt-8 sm:pt-12 lg:pt-[56px] flex flex-col items-start self-stretch">
          {/* 4 Cards Responsive Grid Container */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch self-stretch">
            {/* 01 Describe Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0 self-stretch">
              <div className="mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "#EFF6FF",
                    color: "#155DFC",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  01
                </div>
                <h3
                  className="mb-1.5"
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Describe
                </h3>
                <p
                  style={{
                    color: "#475569",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    lineHeight: "20px",
                  }}
                >
                  Tell Gather what you need to collect in plain language.
                </p>
              </div>

              {/* Step 01 UI Snippet */}
              <div className="bg-[#F0F7FF] border border-[#DBEAFE] rounded-2xl p-3.5 space-y-2.5">
                <span
                  className="block uppercase tracking-wider"
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: "#2563EB",
                  }}
                >
                  WHAT ARE YOU COLLECTING?
                </span>
                <div
                  className="bg-white border border-[#DBEAFE] rounded-xl p-2.5 shadow-2xs"
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                    color: "#0F172B",
                    lineHeight: "17px",
                  }}
                >
                  &ldquo;Create a job application for a junior UX designer.&rdquo;
                </div>
                <button
                  type="button"
                  className="w-full h-8.5 bg-[#2563EB] rounded-lg shadow-xs text-center flex items-center justify-center cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  Generate
                </button>
              </div>
            </div>

            {/* 02 Generate Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0 self-stretch">
              <div className="mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "#EFF6FF",
                    color: "#155DFC",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  02
                </div>
                <h3
                  className="mb-1.5"
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Generate
                </h3>
                <p
                  style={{
                    color: "#475569",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "13px",
                    lineHeight: "20px",
                  }}
                >
                  Gather creates the application structure, questions, and appropriate fields.
                </p>
              </div>

              {/* Step 02 UI Snippet */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs">
                {/* Header */}
                <div className="border-b border-[#F1F5F9] pb-2 mb-2.5">
                  <div
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#0F172B",
                    }}
                  >
                    Junior UX Designer Application
                  </div>
                  <div
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "10.5px",
                      color: "#94A3B8",
                      marginTop: "1.5px",
                    }}
                  >
                    4 sections · 9 questions
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  <div>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10.5px",
                        fontWeight: 500,
                        color: "#475569",
                      }}
                    >
                      Full name *
                    </span>
                    <div className="h-7 w-full bg-white border border-[#E2E8F0] rounded-lg" />
                  </div>

                  <div>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10.5px",
                        fontWeight: 500,
                        color: "#475569",
                      }}
                    >
                      Email address *
                    </span>
                    <div className="h-7 w-full bg-white border border-[#E2E8F0] rounded-lg" />
                  </div>

                  <div>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10.5px",
                        fontWeight: 500,
                        color: "#475569",
                      }}
                    >
                      Years of experience
                    </span>
                    <div
                      className="h-7 w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 flex items-center justify-between"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10.5px",
                        color: "#94A3B8",
                      }}
                    >
                      <span>Select...</span>
                      <svg
                        className="w-3.5 h-3.5 text-[#94A3B8]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <span
                      className="block mb-1"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10.5px",
                        fontWeight: 500,
                        color: "#475569",
                      }}
                    >
                      UX tools you use
                    </span>
                    <div className="h-7 w-full bg-white border border-[#E2E8F0] rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* 03 Review Card (Exact match to reference) */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0 self-stretch">
              <div className="mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "#EFF6FF",
                    color: "#155DFC",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  03
                </div>
                <h3
                  className="mb-1.5"
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Review
                </h3>
                <p
                  style={{
                    color: "#475569",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22px",
                  }}
                >
                  Edit and refine the generated application before publishing.
                </p>
              </div>

              {/* Step 03 UI Snippet */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
                {/* Header */}
                <div className="pt-3.5 px-4 pb-2.5 border-b border-[#F1F5F9]">
                  <span
                    className="block uppercase tracking-wider"
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    APPLICATION EDITOR
                  </span>
                </div>

                {/* Question List */}
                <div className="p-3 space-y-2">
                  {/* Question Row 1 */}
                  <div className="p-2 px-2.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <rect y="3" width="16" height="1.5" rx="0.75" />
                        <rect y="7.25" width="16" height="1.5" rx="0.75" />
                        <rect y="11.5" width="16" height="1.5" rx="0.75" />
                      </svg>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#0F172B",
                            lineHeight: "16px",
                          }}
                        >
                          Full name
                        </span>
                        <span
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "10.5px",
                            color: "#94A3B8",
                            lineHeight: "14px",
                          }}
                        >
                          Short text
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Req
                      </span>
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Question Row 2 */}
                  <div className="p-2 px-2.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <rect y="3" width="16" height="1.5" rx="0.75" />
                        <rect y="7.25" width="16" height="1.5" rx="0.75" />
                        <rect y="11.5" width="16" height="1.5" rx="0.75" />
                      </svg>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#0F172B",
                            lineHeight: "16px",
                          }}
                        >
                          Email address
                        </span>
                        <span
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "10.5px",
                            color: "#94A3B8",
                            lineHeight: "14px",
                          }}
                        >
                          Email
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Req
                      </span>
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Question Row 3 */}
                  <div className="p-2 px-2.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <rect y="3" width="16" height="1.5" rx="0.75" />
                        <rect y="7.25" width="16" height="1.5" rx="0.75" />
                        <rect y="11.5" width="16" height="1.5" rx="0.75" />
                      </svg>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#0F172B",
                            lineHeight: "16px",
                          }}
                        >
                          Portfolio URL
                        </span>
                        <span
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "10.5px",
                            color: "#94A3B8",
                            lineHeight: "14px",
                          }}
                        >
                          URL
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Req
                      </span>
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Question Row 4 */}
                  <div className="p-2 px-2.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <rect y="3" width="16" height="1.5" rx="0.75" />
                        <rect y="7.25" width="16" height="1.5" rx="0.75" />
                        <rect y="11.5" width="16" height="1.5" rx="0.75" />
                      </svg>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: "#0F172B",
                            lineHeight: "16px",
                          }}
                        >
                          Design process
                        </span>
                        <span
                          style={{
                            fontFamily: "Geist, sans-serif",
                            fontSize: "10.5px",
                            color: "#94A3B8",
                            lineHeight: "14px",
                          }}
                        >
                          Long text
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Req
                      </span>
                      <span
                        className="border border-[#E2E8F0] rounded-lg px-2 py-0.5 bg-white text-center shadow-2xs"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          color: "#64748B",
                        }}
                      >
                        Edit
                      </span>
                    </div>
                  </div>

                  {/* Add question button */}
                  <div
                    className="border border-dashed border-[#CBD5E1] rounded-xl py-2 text-center flex items-center justify-center gap-1 cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#64748B",
                    }}
                  >
                    <span>+</span>
                    <span>Add question</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 Publish Card (Exact match to reference) */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 lg:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between w-full min-w-0 self-stretch">
              <div className="mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "#EFF6FF",
                    color: "#155DFC",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  04
                </div>
                <h3
                  className="mb-1.5"
                  style={{
                    color: "#0F172B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Publish
                </h3>
                <p
                  style={{
                    color: "#475569",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22px",
                  }}
                >
                  Publish your application and share it with applicants.
                </p>
              </div>

              {/* Step 04 UI Snippet */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
                {/* Header */}
                <div className="pt-3.5 px-4 pb-2.5 border-b border-[#F1F5F9]">
                  <span
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#155DFC",
                    }}
                  >
                    Published
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-3">
                  <div>
                    <span
                      className="block uppercase tracking-wider mb-1.5"
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#94A3B8",
                        letterSpacing: "0.05em",
                      }}
                    >
                      APPLICATION LINK
                    </span>
                    <div className="p-2.5 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                      <span
                        className="truncate"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "12.5px",
                          color: "#475569",
                        }}
                      >
                        gather.app/apply/jun...
                      </span>
                      <span
                        className="hover:underline cursor-pointer ml-1"
                        style={{
                          fontFamily: "Geist, sans-serif",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#155DFC",
                        }}
                      >
                        Copy
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full h-9.5 bg-[#155DFC] rounded-xl shadow-xs text-center flex items-center justify-center cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
