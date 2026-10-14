import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MarketingFooter from "../components/MarketingFooter";

interface ArticleData {
  slug: string;
  badge: string;
  statusBadge: string;
  title: string;
  subtitle: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  steps: {
    number: string;
    title: string;
    description: string;
  }[];
  relatedUpdates: {
    slug: string;
    title: string;
    description: string;
  }[];
}

const ARTICLES: Record<string, ArticleData> = {
  "ai-application-generation": {
    slug: "ai-application-generation",
    badge: "WHAT'S NEW",
    statusBadge: "AVAILABLE NOW",
    title: "AI application generation",
    subtitle: "Create an application from an idea with Gather's AI.",
    heroHeadline: "Start with an idea.",
    heroSubheadline: "Gather builds the application.",
    heroDescription:
      "Tell Gather what you want to collect and let AI create the initial structure for you — questions, sections, and all.",
    steps: [
      {
        number: "01",
        title: "Describe what you need",
        description:
          "Tell Gather what you're collecting — a job application, event registration, intake form, or anything else.",
      },
      {
        number: "02",
        title: "Generate your application",
        description:
          "Gather creates the questions, sections, and structure based on your description.",
      },
      {
        number: "03",
        title: "Refine with AI",
        description:
          "Use Ask Gather to make targeted changes — add a section, reword a question, or restructure the flow.",
      },
      {
        number: "04",
        title: "Publish",
        description:
          "Review your application and publish it when it's ready.",
      },
    ],
    relatedUpdates: [
      {
        slug: "improved-application-editor",
        title: "Improved application editor",
        description: "Refine questions and sections more easily before publishing.",
      },
      {
        slug: "new-templates",
        title: "New templates",
        description:
          "Start from ready-made application structures instead of building everything from scratch.",
      },
    ],
  },
  "improved-application-editor": {
    slug: "improved-application-editor",
    badge: "WHAT'S NEW",
    statusBadge: "AVAILABLE NOW",
    title: "Improved application editor",
    subtitle: "Refine questions and sections more easily before publishing.",
    heroHeadline: "Precision controls.",
    heroSubheadline: "Total creative freedom.",
    heroDescription:
      "Reorder sections seamlessly, tweak question types, and configure atomic limits with zero guesswork.",
    steps: [
      {
        number: "01",
        title: "Drag & Reorder",
        description:
          "Effortlessly re-arrange sections and questions with intuitive visual handles.",
      },
      {
        number: "02",
        title: "Instant Live Preview",
        description:
          "Toggle between mobile and desktop live interactive preview modes instantly.",
      },
      {
        number: "03",
        title: "Custom Field Validation",
        description:
          "Enforce required attachments, file size limits up to 50MB, and specific input formats.",
      },
      {
        number: "04",
        title: "One-Click Deploy",
        description:
          "Save changes automatically to Supabase PostgreSQL and publish in real-time.",
      },
    ],
    relatedUpdates: [
      {
        slug: "ai-application-generation",
        title: "AI application generation",
        description: "Create an application from an idea with Gather's AI.",
      },
      {
        slug: "new-templates",
        title: "New templates",
        description:
          "Start from ready-made application structures instead of building everything from scratch.",
      },
    ],
  },
  "new-templates": {
    slug: "new-templates",
    badge: "WHAT'S NEW",
    statusBadge: "AVAILABLE NOW",
    title: "New templates",
    subtitle:
      "Start from ready-made application structures instead of building everything from scratch.",
    heroHeadline: "Proven templates.",
    heroSubheadline: "Ready in seconds.",
    heroDescription:
      "Choose from curated industry blueprints designed for grants, job candidates, beta testers, and event registrations.",
    steps: [
      {
        number: "01",
        title: "Browse Curated Gallery",
        description:
          "Explore role-specific templates designed by top hiring managers and organizers.",
      },
      {
        number: "02",
        title: "Customize with AI",
        description:
          "Tailor pre-built questions to your organization's exact requirements in seconds.",
      },
      {
        number: "03",
        title: "Brand & Theme",
        description:
          "Apply custom colors, organization logos, and custom response confirmations.",
      },
      {
        number: "04",
        title: "Share & Collect",
        description:
          "Distribute responsive public links and manage incoming submissions cleanly.",
      },
    ],
    relatedUpdates: [
      {
        slug: "ai-application-generation",
        title: "AI application generation",
        description: "Create an application from an idea with Gather's AI.",
      },
      {
        slug: "improved-application-editor",
        title: "Improved application editor",
        description: "Refine questions and sections more easily before publishing.",
      },
    ],
  },
};

export default function WhatsNewArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = (slug && ARTICLES[slug]) || ARTICLES["ai-application-generation"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
            <Link
              to="/whats-new"
              className="font-normal text-[#475569] hover:text-[#0F172B] transition-colors"
            >
              What&apos;s New
            </Link>
            <span className="text-[#CBD5E1] font-light">/</span>
            <span className="text-[#0F172B] font-semibold truncate max-w-[220px] sm:max-w-none">
              {article.title}
            </span>
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="flex-1 max-w-[720px] mx-auto w-full px-5 sm:px-6 pt-12 sm:pt-16 pb-20">
        {/* Badges Row */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            {article.badge}
          </span>
          <span className="bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border border-[#BBF7D0]/60">
            {article.statusBadge}
          </span>
        </div>

        {/* Article Title & Subtitle */}
        <div className="mb-10 sm:mb-12">
          <h1
            className="text-[34px] sm:text-[40px] font-bold text-[#0F172B] tracking-tight mb-2 leading-tight"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            {article.title}
          </h1>
          <p
            className="text-[14.5px] text-[#62748E] leading-normal"
            style={{ fontFamily: "Geist, sans-serif" }}
          >
            {article.subtitle}
          </p>
        </div>

        {/* 1. Main Feature Showcase Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172B] tracking-tight mb-1.5">
            {article.heroHeadline} <br />
            {article.heroSubheadline}
          </h2>
          <p className="text-[13.5px] text-[#64748B] leading-relaxed mb-6">
            {article.heroDescription}
          </p>

          {/* Builder Mockup Card */}
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-2xs overflow-hidden">
            {/* Top Editor Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0] text-xs">
              <div className="flex items-center gap-1.5 text-[#64748B] font-medium text-[11.5px]">
                <span className="text-[#0F172B] font-semibold">Gather</span>
                <span className="text-[#CBD5E1]">/</span>
                <span className="truncate max-w-[120px] sm:max-w-none">Forms</span>
                <span className="text-[#CBD5E1]">/</span>
                <span className="text-[#0F172B] font-medium truncate max-w-[150px] sm:max-w-none">
                  Junior UX Designer Application
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]/60">
                  Build
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-[#64748B] px-1.5 py-0.5">
                  Submissions
                </span>
                <span className="hidden sm:inline-block text-[11px] font-medium text-[#64748B] px-1.5 py-0.5">
                  Preview
                </span>
                <button
                  type="button"
                  className="bg-[#2563EB] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xs"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Split Builder View */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Left Column: Ask Gather AI */}
              <div className="md:col-span-4 bg-white rounded-lg border border-[#E2E8F0] p-3 flex flex-col justify-between text-xs">
                <div>
                  <span className="text-[9.5px] font-bold text-[#94A3B8] tracking-wider uppercase block mb-2">
                    ASK GATHER
                  </span>
                  <div className="bg-[#F8FAFC] rounded-md p-2 text-[11px] text-[#475569] mb-2 leading-relaxed border border-[#E2E8F0]/60">
                    &ldquo;make a job application form for junior UX designer&rdquo;
                  </div>
                  <div className="text-[11px] font-medium text-[#2563EB] bg-[#EFF6FF] p-2 rounded-md border border-[#BFDBFE]/60">
                    ✨ Created your Junior UX Designer Application
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[#94A3B8] text-[11px]">
                  <span>Ask a question...</span>
                  <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px]">
                    &uarr;
                  </span>
                </div>
              </div>

              {/* Right Column: Generated Form Canvas */}
              <div className="md:col-span-8 bg-white rounded-lg border border-[#E2E8F0] p-3.5 sm:p-4 text-xs">
                <div className="border-b border-[#F1F5F9] pb-2.5 mb-3">
                  <h4 className="text-[13.5px] font-bold text-[#0F172B]">
                    Junior UX Designer Application
                  </h4>
                  <p className="text-[11px] text-[#94A3B8]">Application description</p>
                </div>

                <div className="mb-2">
                  <span className="text-[9px] font-bold text-[#94A3B8] tracking-wider uppercase block mb-2">
                    PERSONAL INFORMATION
                  </span>

                  <div className="space-y-1.5">
                    {[
                      { label: "First name", type: "Short answer", req: true },
                      { label: "Last name", type: "Short answer", req: true },
                      { label: "Phone number", type: "Phone" },
                      { label: "Email", type: "Email" },
                      { label: "LinkedIn Profile URL", type: "URL" },
                    ].map((field) => (
                      <div
                        key={field.label}
                        className="flex items-center justify-between p-2 rounded border border-[#F1F5F9] bg-[#FBFDFF] text-[11.5px]"
                      >
                        <span className="text-[#0F172B] font-medium">{field.label}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                          {field.req && <span className="text-red-500">*</span>}
                          <span>⋮</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Canvas Controls */}
                <div className="flex items-center gap-2 pt-2 text-[10.5px] text-[#64748B]">
                  <span className="px-2 py-0.5 rounded border border-[#E2E8F0] bg-white">
                    + Add section
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]">
                    ✨ Open AI
                  </span>
                  <span className="px-2 py-0.5 rounded border border-[#E2E8F0] bg-white">
                    Duplicate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Section: HOW IT WORKS */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-semibold text-[#94A3B8] tracking-widest uppercase flex-shrink-0">
              HOW IT WORKS
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {article.steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-2xs"
              >
                <div className="text-xl font-bold text-[#CBD5E1] mb-2 font-mono">
                  {step.number}
                </div>
                <h3 className="text-[14px] font-bold text-[#0F172B] mb-1">
                  {step.title}
                </h3>
                <p className="text-[12.5px] text-[#64748B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Secondary Showcase Card: Applications List Mockup */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs mb-12">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9] text-xs">
            <div className="flex items-center gap-1.5 text-[#64748B] font-medium text-[11.5px]">
              <span className="text-[#0F172B] font-semibold">Gather</span>
              <span className="text-[#CBD5E1]">/</span>
              <span>Applications</span>
            </div>
            <button
              type="button"
              className="bg-[#2563EB] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xs"
            >
              Publish
            </button>
          </div>

          <span className="text-[9.5px] font-bold text-[#94A3B8] tracking-wider uppercase block mb-3">
            MY APPLICATIONS
          </span>

          <div className="space-y-2">
            {[
              { name: "Junior UX Designer Form", count: "14 submissions", status: "Published" },
              { name: "Marketing Intern Form", count: "—", status: "Draft" },
              { name: "Product Manager Form", count: "6 submissions", status: "Published" },
            ].map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-3 rounded-lg border border-[#F1F5F9] bg-[#FBFDFF]"
              >
                <div>
                  <h4 className="text-[12.5px] font-semibold text-[#0F172B]">{app.name}</h4>
                  <span className="text-[10.5px] text-[#94A3B8]">{app.count}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    app.status === "Published"
                      ? "bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]/60"
                      : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Section: RELATED UPDATES */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-semibold text-[#94A3B8] tracking-widest uppercase flex-shrink-0">
              RELATED UPDATES
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#F1F5F9] overflow-hidden">
            {article.relatedUpdates.map((item) => (
              <div
                key={item.slug}
                className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FBFDFF] transition-colors"
              >
                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172B] mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <Link
                  to={`/whats-new/${item.slug}`}
                  className="text-[#2563EB] text-[13px] font-medium hover:underline inline-flex items-center gap-1 group flex-shrink-0"
                >
                  View <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Dark Marketing Footer */}
      <MarketingFooter />
    </div>
  );
}
