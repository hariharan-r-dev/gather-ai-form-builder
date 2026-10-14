import MarketingNavbar from "../components/MarketingNavbar";
import MarketingFooter from "../components/MarketingFooter";
import { Link } from "react-router-dom";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-32 pb-24 px-5 sm:px-8 lg:px-20 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]/60">
            Privacy & Security
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-4 mb-2">
            Privacy Policy & Legal
          </h1>
          <p className="text-xs text-[#94A3B8]">Last updated: September 1, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-[#475569] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when creating an account, generating application forms, and collecting responses. Respondent answers and uploaded files are stored strictly on behalf of the form creator.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">2. Data Security & Storage</h2>
            <p>
              All database records and file attachments are secured in Supabase PostgreSQL and private cloud storage buckets protected by Row-Level Security (RLS) policies and HTTPS encryption in transit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">3. How We Use Data</h2>
            <p>
              We use collected information solely to provide, operate, and maintain Gather&apos;s application services. We do not sell respondent data or applicant records to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">4. GDPR & CCPA Compliance</h2>
            <p>
              You have the right to request access to, modification of, or deletion of your personal data at any time by contacting our privacy compliance team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">5. Legal Contact</h2>
            <p>
              For legal and data privacy inquiries, contact <span className="text-[#2563EB] font-medium">legal@gather.app</span>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
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
