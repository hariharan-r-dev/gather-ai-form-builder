import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Application } from "../types";
import { applicationService } from "../services/applications/applicationService";
import PublicForm from "../components/PublicForm";

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApp() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const found = await applicationService.getApplicationBySlug(slug);
        setApp(found);
      } catch (err) {
        console.error("Failed to load application:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-full py-16 flex flex-col items-center justify-center p-6 text-[#64748B]">
        <div className="flex items-center gap-2.5 text-xs font-medium">
          <svg className="animate-spin w-4 h-4 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
          <span>Loading form...</span>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="w-full min-h-full py-16 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#0F172A] mb-2">Application not found</h1>
        <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
          The form you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-xl transition-colors"
        >
          Go to Gather Home
        </Link>
      </div>
    );
  }

  if (app.status !== "published") {
    return (
      <div className="w-full min-h-full py-16 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[#0F172A] mb-2">This application isn't published yet</h1>
        <p className="text-xs text-[#64748B] max-w-sm mb-6 leading-relaxed">
          The owner has not made this form publicly available. Please check back later or contact the organization.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-medium rounded-xl transition-colors"
        >
          Go to Gather Home
        </Link>
      </div>
    );
  }

  return <PublicForm app={app} />;
}
