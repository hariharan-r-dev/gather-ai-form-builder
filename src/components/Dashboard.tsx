const TEMPLATES = [
  { icon: "💼", name: "Job Application", desc: "Collect applications for open roles.", questions: 9 },
  { icon: "🎓", name: "Scholarship Application", desc: "Screen students for funding opportunities.", questions: 11 },
  { icon: "🎟️", name: "Event Registration", desc: "Manage sign-ups and attendee details.", questions: 7 },
  { icon: "🎤", name: "Speaker Submission", desc: "Find speakers for your event or conference.", questions: 8 },
  { icon: "📚", name: "Course Application", desc: "Enroll students in programs and courses.", questions: 10 },
  { icon: "🤝", name: "Volunteer Application", desc: "Recruit and screen volunteers.", questions: 8 },
  { icon: "🏘️", name: "Community Membership", desc: "Accept members into your community.", questions: 6 },
  { icon: "💰", name: "Grant Application", desc: "Collect and review grant proposals.", questions: 13 },
  { icon: "🏪", name: "Vendor Application", desc: "Onboard and evaluate new vendors.", questions: 10 },
];

interface DashboardProps {
  onCreateApp: (prompt: string) => void;
  onRequireAuth: () => void;
  isSignedIn: boolean;
}

export default function Dashboard({ onCreateApp, onRequireAuth, isSignedIn }: DashboardProps) {
  function handleTemplateClick(name: string) {
    if (!isSignedIn) {
      onRequireAuth();
      return;
    }
    onCreateApp(`Create a ${name.toLowerCase()}`);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-[#0F172A]">Templates</h1>
          <p className="text-sm text-[#64748B] mt-1">Start with a ready-made application and customize it.</p>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["Popular", "Work", "Education", "Events", "Community", "Other"].map((cat, i) => (
            <button
              key={cat}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${i === 0 ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#94A3B8]"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#2563EB]/40 hover:shadow-sm transition-all group flex flex-col"
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-sm font-medium text-[#0F172A] mb-0.5">{t.name}</div>
              <div className="text-xs text-[#64748B] leading-relaxed mb-3 flex-1">{t.desc}</div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#94A3B8]">{t.questions} questions</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[11px] text-[#64748B] hover:text-[#0F172A] transition-colors">
                    Preview
                  </button>
                  <button
                    onClick={() => handleTemplateClick(t.name)}
                    className="text-[11px] font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                  >
                    Use template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
