import MarketingNavbar from "../components/MarketingNavbar";
import MarketingFooter from "../components/MarketingFooter";
import { Link } from "react-router-dom";

const POSTS = [
  {
    title: "How AI is Streamlining Hiring & Grant Pipelines in 2026",
    excerpt: "Learn how modern organizers and hiring managers are saving 10+ hours a week by letting AI generate structured application forms and review criteria.",
    date: "Sep 4, 2026",
    readTime: "4 min read",
    tag: "AI & Automation",
  },
  {
    title: "Designing High-Conversion Application Forms: 5 Golden Rules",
    excerpt: "From progressive multi-step disclosures to mobile-first file uploads, discover the key UX principles that double completion rates.",
    date: "Aug 28, 2026",
    readTime: "6 min read",
    tag: "Product Design",
  },
  {
    title: "Why We Migrated to Server-Authoritative Database Limits",
    excerpt: "A deep technical dive into atomic PostgreSQL transactions, Supabase row locking, and preventing concurrency race conditions.",
    date: "Aug 15, 2026",
    readTime: "8 min read",
    tag: "Engineering",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-32 pb-24 px-5 sm:px-8 lg:px-20 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]/60">
            Gather Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-4 mb-3">
            Insights, Guides, and Product Updates
          </h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            Articles and engineering stories from the team building the future of intelligent applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-md hover:border-[#2563EB]/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                  <span className="font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]/50">
                    {post.tag}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-[#0F172A] mb-2 leading-snug hover:text-[#2563EB] transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed mb-6">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>{post.date}</span>
                <span className="text-[#2563EB] font-semibold flex items-center gap-1">
                  Read article →
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
          >
            ← Back to Gather Home
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
