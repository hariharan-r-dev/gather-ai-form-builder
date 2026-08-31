import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentApplication, useAuth, useUIState, usePlan, useApplications } from "../app/AppProvider";
import Header from "../components/Header";
import ApplicantDetail from "../components/ApplicantDetail";
import { submissionService } from "../services/submissions/submissionService";
import { Submission } from "../types";

export default function ApplicantDetailPage() {
  const { id, submissionId } = useParams<{ id: string; submissionId: string }>();
  const { applications } = useApplications();
  const { currentApp, setCurrentApp, currentSubmission, setCurrentSubmission } = useCurrentApplication();
  const { isSignedIn } = useAuth();
  const { plan } = usePlan();
  const { setShowSearch, setShowPublish } = useUIState();
  const [applicant, setApplicant] = useState<Submission | null>(currentSubmission);
  const [loading, setLoading] = useState(!currentSubmission);
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id) || currentApp;

  useEffect(() => {
    if (app && (!currentApp || currentApp.id !== app.id)) {
      setCurrentApp(app);
    }
  }, [app, currentApp, setCurrentApp]);

  useEffect(() => {
    async function load() {
      if (submissionId) {
        setLoading(true);
        try {
          const found = await submissionService.getSubmission(submissionId);
          if (found) {
            setApplicant(found);
            setCurrentSubmission(found);
          }
        } catch (err) {
          console.error("Failed to load submission:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    if (!currentSubmission || currentSubmission.id !== submissionId) {
      load();
    } else {
      setApplicant(currentSubmission);
      setLoading(false);
    }
  }, [submissionId, currentSubmission, setCurrentSubmission]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#64748B]">
        Loading applicant details...
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-base font-semibold text-[#0F172A] mb-1">Submission not found</h2>
        <p className="text-xs text-[#64748B] mb-4">This submission may have been deleted.</p>
        <button
          onClick={() => navigate(`/applications/${id}/responses`)}
          className="px-4 py-2 bg-[#2563EB] text-white text-xs font-medium rounded-xl hover:bg-[#1D4ED8] transition-colors"
        >
          Back to submissions
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Header
        view="applicant-detail"
        activeNav="applications"
        onNavChange={(nav) => {
          if (nav === "applications") {
            navigate(`/applications/${id}`);
          } else if (nav === "responses") {
            navigate(`/applications/${id}/responses`);
          }
        }}
        onLogoClick={() => navigate("/applications")}
        onSignIn={() => navigate("/settings")}
        isSignedIn={isSignedIn}
        appName={app?.name}
        onBackToApps={() => navigate(`/applications/${id}/responses`)}
        onPreview={() => navigate(`/applications/${id}/preview`)}
        onPublish={() => setShowPublish(true)}
        onMoreMenu={() => {}}
        showMoreMenu={false}
        setShowMoreMenu={() => {}}
        plan={plan}
        onBilling={() => navigate("/pricing")}
        onUpgrade={() => navigate("/pricing")}
        onSettings={() => navigate("/settings")}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <ApplicantDetail
          applicant={applicant}
          onBack={() => navigate(`/applications/${id}/responses`)}
        />
      </main>
    </div>
  );
}
