import { useState } from "react";
import { Plan } from "../types";

interface SettingsProps {
  plan: Plan;
  submissionUsage: number;
  onUpgrade: () => void;
  onBack: () => void;
}

type Section = "profile" | "billing" | "whats-new" | "contact";

export default function Settings({ plan, submissionUsage, onUpgrade, onBack }: SettingsProps) {
  const [section, setSection] = useState<Section>("profile");

  const navItem = (id: Section, label: string, icon: React.ReactNode) => {
    const active = section === id;
    return (
      <button
        key={id}
        onClick={() => setSection(id)}
        className={`w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm rounded-lg transition-colors mx-1 ${
          active
            ? "bg-[#EFF6FF] text-[#2563EB] font-medium"
            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        }`}
        style={{ width: "calc(100% - 8px)" }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="bg-white border-r border-[#E2E8F0] flex-shrink-0 w-[220px] flex flex-col py-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="text-sm text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 px-4 py-2 mb-2 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to applications
        </button>

        {/* MY ACCOUNT */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1">
            My Account
          </div>
          {navItem(
            "profile",
            "Profile",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        {/* BILLING */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1">
            Billing
          </div>
          {navItem(
            "billing",
            "Billing & usage",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          )}
        </div>

        {/* SUPPORT */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-[#94A3B8] uppercase px-4 pt-4 pb-1">
            Support
          </div>
          {navItem(
            "whats-new",
            "What's new",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          )}
          {navItem(
            "contact",
            "Contact support",
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
          )}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto px-8 py-10">
          {section === "profile" && <ProfileSection />}
          {section === "billing" && (
            <BillingSection
              plan={plan}
              submissionUsage={submissionUsage}
              onUpgrade={onUpgrade}
            />
          )}
          {section === "whats-new" && <WhatsNewSection />}
          {section === "contact" && <ContactSection />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">My account</h1>
      <p className="text-sm text-[#64748B] mt-1 mb-8">Manage your personal account details.</p>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
        {/* Photo */}
        <div>
          <div className="text-sm font-medium text-[#0F172A] mb-3">Profile photo</div>
          <div className="flex flex-col items-start gap-2">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white text-lg font-semibold flex items-center justify-center">
              HR
            </div>
            <button className="text-xs text-[#2563EB] hover:underline">Upload photo</button>
          </div>
        </div>

        {/* Name */}
        <div className="mt-6">
          <label className="text-sm font-medium text-[#0F172A] block mb-1.5">Name</label>
          <input
            type="text"
            defaultValue="Hariharan R"
            className="px-3 py-2.5 border border-[#E2E8F0] rounded-xl w-full text-sm outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-sm font-medium text-[#0F172A] block mb-1.5">Email</label>
          <input
            type="email"
            defaultValue="hariharan.creates@gmail.com"
            disabled
            className="px-3 py-2.5 border border-[#E2E8F0] rounded-xl w-full text-sm outline-none bg-[#F8FAFC] text-[#64748B]"
          />
          <p className="text-xs text-[#94A3B8] mt-1.5">Your email is used to sign in to Gather.</p>
        </div>

        {/* Signed in with */}
        <div className="mt-6 flex items-center gap-2 text-sm text-[#64748B]">
          <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#4285F4]">
            G
          </div>
          Signed in with Google
        </div>

        {/* Save */}
        <button className="mt-6 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors">
          Save changes
        </button>
      </div>
    </div>
  );
}

function BillingSection({
  plan,
  submissionUsage,
  onUpgrade,
}: {
  plan: Plan;
  submissionUsage: number;
  onUpgrade: () => void;
}) {
  const isFree = plan === "free";
  const submissionLimit = isFree ? 10 : 1000;
  const submissionPercent = Math.min((submissionUsage / submissionLimit) * 100, 100);
  const submissionBarColor =
    submissionPercent >= 100
      ? "bg-red-400"
      : submissionPercent >= 80
      ? "bg-[#F59E0B]"
      : "bg-[#2563EB]";

  const appUsage = isFree ? 1 : 3;
  const appLimit = isFree ? 1 : null;
  const appPercent = appLimit ? Math.min((appUsage / appLimit) * 100, 100) : 0;

  const features = [
    "Unlimited applications",
    "1,000 submissions/month",
    "Remove Gather branding",
    "Custom branding",
    "File uploads",
    "Analytics",
    "CSV export",
    "QR codes",
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">Billing &amp; usage</h1>
      <p className="text-sm text-[#64748B] mt-1 mb-8">
        Manage your plan and keep track of your Gather usage.
      </p>

      {/* Current plan card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              isFree
                ? "bg-[#F1F5F9] text-[#64748B]"
                : "bg-[#EFF6FF] text-[#2563EB]"
            }`}
          >
            {isFree ? "Free" : "Pro"}
          </span>
          <span className="text-xs text-[#94A3B8]">Current plan</span>
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#0F172A]">{isFree ? "$0" : "$12"}</span>
          <span className="text-sm text-[#64748B]">/month</span>
        </div>

        <p className="text-sm text-[#64748B] mt-1">
          {isFree
            ? "10 submissions per month · 1 published application"
            : "1,000 submissions per month · Unlimited applications"}
        </p>

        {!isFree && (
          <p className="text-xs text-[#94A3B8] mt-1">Next billing date: Aug 29, 2026</p>
        )}

        {isFree ? (
          <button
            onClick={onUpgrade}
            className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors"
          >
            Upgrade to Pro
          </button>
        ) : (
          <div className="flex items-center gap-3 mt-4">
            <button className="px-4 py-2 border border-[#E2E8F0] text-[#0F172A] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] transition-colors">
              Manage subscription
            </button>
            <button className="px-4 py-2 text-red-500 text-sm font-medium hover:text-red-600 transition-colors">
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {/* Usage card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-4">
        <div className="text-sm font-semibold text-[#0F172A] mb-4">Usage this month</div>

        {/* Submissions */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#0F172A] font-medium">Submissions</span>
            <span className="text-sm text-[#64748B]">
              {submissionUsage} of {isFree ? "10" : "1,000"} used
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mt-2 mb-1">
            <div
              className={`h-full rounded-full ${submissionBarColor}`}
              style={{ width: `${submissionPercent}%` }}
            />
          </div>
          <p className="text-xs text-[#94A3B8]">
            {submissionLimit - submissionUsage > 0
              ? `${isFree ? submissionLimit - submissionUsage : (submissionLimit - submissionUsage).toLocaleString()} submissions remaining this month`
              : "No submissions remaining this month"}
          </p>
        </div>

        {/* Published applications */}
        <div className="border-t border-[#F1F5F9] pt-5 mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#0F172A] font-medium">Published applications</span>
            <span className="text-sm text-[#64748B]">
              {isFree ? "1 of 1 used" : "3 of unlimited"}
            </span>
          </div>
          {isFree && (
            <>
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mt-2 mb-1">
                <div
                  className={`h-full rounded-full ${appPercent >= 100 ? "bg-red-400" : appPercent >= 80 ? "bg-[#F59E0B]" : "bg-[#2563EB]"}`}
                  style={{ width: `${appPercent}%` }}
                />
              </div>
              <p className="text-xs text-[#94A3B8]">Free includes 1 published application.</p>
            </>
          )}
        </div>
      </div>

      {/* Pro upsell card (free only) */}
      {isFree && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0F172A]">Gather Pro</span>
            <span className="text-sm text-[#64748B]">$12/month</span>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-sm text-[#0F172A]">
                <span className="text-[#2563EB] font-bold">✓</span>
                {f}
              </div>
            ))}
          </div>
          <button
            onClick={onUpgrade}
            className="mt-4 w-full px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}

function WhatsNewSection() {
  const updates = [
    {
      date: "Aug 28, 2026",
      title: "AI application generation",
      desc: "Create complete, structured applications from a short description. Gather handles sections, questions, and answer types automatically.",
      tag: "New",
    },
    {
      date: "Aug 22, 2026",
      title: "Rich text question editing",
      desc: "Bold, italic, underline, and link formatting now available in question and description fields.",
      tag: "Improved",
    },
    {
      date: "Aug 15, 2026",
      title: "Submissions dashboard",
      desc: "View, search, and export your application submissions from a single clean interface.",
      tag: "New",
    },
    {
      date: "Aug 8, 2026",
      title: "Application templates",
      desc: "Start faster with ready-made templates for jobs, scholarships, events, volunteers, and more.",
      tag: "New",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">What&apos;s new</h1>
      <p className="text-sm text-[#64748B] mt-1 mb-8">
        See what&apos;s new and improved in Gather.
      </p>

      {updates.map((u) => (
        <div key={u.title} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8]">{u.date}</span>
            <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              {u.tag}
            </span>
          </div>
          <div className="text-sm font-semibold text-[#0F172A] mt-1">{u.title}</div>
          <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{u.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ContactSection() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#0F172A]">How can we help?</h1>
      <p className="text-sm text-[#64748B] mt-1 mb-8">
        Have a question or something not working? We&apos;re here to help.
      </p>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div className="w-12 h-12 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <p className="text-sm font-medium text-[#0F172A] text-center">Chat with us</p>
        <p className="text-sm text-[#64748B] text-center mt-1">
          We typically reply in a few minutes.
        </p>

        <button className="mt-5 w-full px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium rounded-xl transition-colors">
          Start a conversation
        </button>

        <a
          href="#"
          className="text-sm text-[#2563EB] hover:underline text-center block mt-3"
        >
          View help center
        </a>

        <p className="text-xs text-[#94A3B8] text-center mt-6">
          Support is powered by Crisp. Clicking &quot;Start a conversation&quot; opens the Crisp
          chat widget.
        </p>
      </div>
    </div>
  );
}
