export default function UpcomingFeatures() {
  const upcomingCards = [
    {
      num: "01",
      title: "AI summaries",
      description:
        "Quickly understand each application with an AI-generated summary.",
    },
    {
      num: "02",
      title: "Smart applicant search",
      description:
        "Ask questions about your submissions using natural language.",
      quote: '"Show me applicants with 3+ years of experience."',
    },
    {
      num: "03",
      title: "Application comparison",
      description:
        "Compare submissions based on the information you care about.",
    },
    {
      num: "04",
      title: "AI recommendations",
      description:
        "Get assistance identifying applications that best match your requirements.",
    },
  ];

  return (
    <section
      id="upcoming-features"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch bg-[#0F172B] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-start">
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-10 sm:mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <span
              style={{
                color: "#64748B",
                fontFamily: "Geist, sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
              className="uppercase"
            >
              COMING SOON
            </span>
            <span className="bg-white text-[#2563EB] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
              Not yet available
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-white mb-4"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Gather is getting smarter.
          </h2>

          <p
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            We&apos;re building AI tools to help you understand and work with <br className="hidden sm:inline" />
            applications after they come in.
          </p>
        </div>

        {/* 4 Roadmap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
          {upcomingCards.map((card) => (
            <div
              key={card.title}
              className="bg-[#131E35] border border-[#1E2D4A] rounded-2xl p-6 shadow-xs flex flex-col justify-start min-h-[220px] hover:border-[#2A3E66] transition-colors"
            >
              {/* Number Badge */}
              <div className="w-7 h-7 rounded-lg bg-[#1A2E56] text-[#3B82F6] font-bold text-[11px] flex items-center justify-center mb-5">
                {card.num}
              </div>

              <h3
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  color: "#8FA0B8",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "13px",
                  lineHeight: "20px",
                  fontWeight: 400,
                }}
              >
                {card.description}
              </p>

              {card.quote && (
                <p
                  style={{
                    color: "#64748B",
                    fontFamily: "Geist, sans-serif",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: 400,
                    marginTop: "12px",
                  }}
                >
                  {card.quote}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
