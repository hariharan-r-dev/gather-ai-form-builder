import MarketingNavbar from "../components/MarketingNavbar";
import MarketingFooter from "../components/MarketingFooter";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-32 pb-24 px-5 sm:px-8 lg:px-20 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]/60">
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-4 mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-[#94A3B8]">Last updated: September 1, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-[#475569] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">1. Agreement to Terms</h2>
            <p>
              By accessing or using Gather, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">2. Description of Service</h2>
            <p>
              Gather provides an AI-powered SaaS application that enables users to generate, publish, and manage custom application forms and review applicant submissions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">3. User Accounts and Content</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You retain all ownership rights to the content and applicant submissions collected through your forms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">4. Usage Limits and Subscriptions</h2>
            <p>
              Free accounts are limited to 1 published application and 10 submissions per month. Pro subscriptions unlock unlimited applications and higher submission volume as described in our Pricing terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0F172A]">5. Contact Information</h2>
            <p>
              For questions regarding these Terms of Service, please contact us at <span className="text-[#2563EB] font-medium">support@gather.app</span>.
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
