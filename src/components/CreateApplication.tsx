import { useState } from "react";

const READY_PROMPTS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1Z" />
      </svg>
    ),
    title: "Job application",
    prompt:
      "Create a job application for a junior UX designer with questions about experience, portfolio, education and availability.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Scholarship application",
    prompt:
      "Create a scholarship application for undergraduate students with questions about academic background, achievements and financial need.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Event speaker application",
    prompt:
      "Create a speaker application for a technology conference with questions about experience, topic, bio and session proposal.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
    title: "Course application",
    prompt:
      "Create an application for a UX design course with questions about experience, goals and availability.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Volunteer application",
    prompt:
      "Create a volunteer application with questions about interests, skills, availability and previous experience.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Community application",
    prompt:
      "Create an application for people who want to join a professional community.",
  },
];

interface CreateApplicationProps {
  onGenerate: (prompt: string) => void;
  onRequireAuth: () => void;
  isSignedIn: boolean;
  defaultPrompt?: string;
}

export default function CreateApplication({ onGenerate, onRequireAuth, isSignedIn, defaultPrompt }: CreateApplicationProps) {
  const [prompt, setPrompt] = useState(defaultPrompt ?? "");

  function handleGenerate() {
    if (!isSignedIn) {
      onRequireAuth();
      return;
    }
    onGenerate(prompt || "Create a job application for a junior UX designer");
  }

  function handleUsePrompt(p: string) {
    setPrompt(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-[2rem] font-semibold text-[#0F172A] leading-tight tracking-tight">
            Create an application
          </h1>
          <p className="text-[#64748B] mt-2 text-base">
            Describe what you need and Gather will build it for you.
          </p>
        </div>

        {/* AI prompt */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-1.5 mb-3">
          <div className="flex items-start gap-2.5 px-3 pt-2.5 pb-1">
            <svg
              className="w-4 h-4 mt-0.5 text-[#2563EB] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the application you need..."
              className="flex-1 text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none outline-none min-h-[72px] leading-relaxed bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-2.5">
            <span className="text-xs text-[#94A3B8]">
              <span className="text-[#B0BAC9]">Try:</span>{" "}
              Create a job application for a junior UX designer...
            </span>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Generate application
            </button>
          </div>
        </div>

        {/* Educational section */}
        <div className="mt-10 mb-10 px-1">
          <h2 className="text-sm font-semibold text-[#0F172A] mb-1">Not sure what to write?</h2>
          <p className="text-xs text-[#64748B] mb-4">Tell us what you&apos;re collecting, who it&apos;s for, and what you want to know.</p>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] rounded-lg text-xs font-medium text-[#475569]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
              What you&apos;re creating
            </span>
            <span className="text-[#CBD5E1] text-sm">+</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] rounded-lg text-xs font-medium text-[#475569]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Who it&apos;s for
            </span>
            <span className="text-[#CBD5E1] text-sm">+</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] rounded-lg text-xs font-medium text-[#475569]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              What you need to know
            </span>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
            <p className="text-xs text-[#475569] leading-relaxed">
              <span className="text-[#94A3B8] font-medium mr-1.5">Example</span>
              Create a job application for junior UX designers with questions about experience, portfolio, education and availability.
            </p>
          </div>
        </div>

        {/* Ready-made prompts */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[#0F172A]">Or start with a ready-made prompt</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Choose a prompt and customize it before generating.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {READY_PROMPTS.map((rp) => (
              <div
                key={rp.title}
                className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 flex items-start gap-3 group hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 text-[#64748B] group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB] transition-colors mt-0.5">
                  {rp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#0F172A] mb-0.5">{rp.title}</div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">{rp.prompt}</p>
                </div>
                <button
                  onClick={() => handleUsePrompt(rp.prompt)}
                  className="flex-shrink-0 text-[11px] font-medium text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use prompt
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
