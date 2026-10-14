export default function ApplicationTypes() {
  const applicationTypes = [
    {
      title: "Job Applications",
      prompt: '"Create a job application for a software engineer."',
    },
    {
      title: "Event Applications",
      prompt: '"Create a speaker application for our annual conference."',
    },
    {
      title: "Workshop Applications",
      prompt: '"Create an application for our UX design workshop."',
    },
    {
      title: "Course Applications",
      prompt: '"Create an enrollment application for our product design course."',
    },
    {
      title: "Community Applications",
      prompt: '"Create a membership application for our design community."',
    },
    {
      title: "Scholarship Applications",
      prompt: '"Create a scholarship application for students studying design."',
    },
    {
      title: "Volunteer Applications",
      prompt: '"Create a volunteer application for our community event."',
    },
    {
      title: "Accelerator Applications",
      prompt: '"Create a startup application for our accelerator program."',
    },
  ];

  return (
    <section
      id="application-types"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-white px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-start">
        {/* Section Header */}
        <div className="max-w-2xl text-left mb-10 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-3"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            One simple way to create any application.
          </h2>
          <p
            className="text-sm sm:text-base text-[#62748E] leading-relaxed"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Start with a description and create applications for the <br className="hidden sm:inline" />
            information you need to collect.
          </p>
        </div>

        {/* 8 Clean Cards Grid (4x2 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
          {applicationTypes.map((app) => (
            <div
              key={app.title}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs hover:border-[#CBD5E1] hover:shadow-xs transition-all flex flex-col justify-start min-h-[140px]"
            >
              <h3
                style={{
                  color: "#0F172B",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {app.title}
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
                {app.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
