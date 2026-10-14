import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, useAuth, usePlan, useUIState } from "../app/AppProvider";
import Header from "../components/Header";
import Responses from "../components/Responses";
import { Application } from "../types";
import { applicationService } from "../services/applications/applicationService";

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();
  const { currentApp, setCurrentApp, setCurrentSubmission } = useCurrentApplication();
  const { isSignedIn } = useAuth();
  const { plan, submissionUsage } = usePlan();
  const { setShowSearch, setShowPublish, setUpgradeModal } = useUIState();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  const [fetchedApp, setFetchedApp] = useState<Application | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const app =
    applications.find((a) => a.id === id || a.publicId === id) ||
    (currentApp?.id === id || currentApp?.publicId === id ? currentApp : null) ||
    fetchedApp;

  useEffect(() => {
    let isMounted = true;
    async function loadApp() {
      if (!id || app) return;
      setIsFetching(true);
      try {
        const fetched = await applicationService.getApplication(id);
        if (isMounted && fetched) {
          setFetchedApp(fetched);
          setCurrentApp(fetched);
        }
      } catch (err) {
        console.warn("Failed to fetch application in ResponsesPage:", err);
      } finally {
        if (isMounted) setIsFetching(false);
      }
    }

    loadApp();
    return () => {
      isMounted = false;
    };
  }, [id, app, setCurrentApp]);

  useEffect(() => {
    if (app) {
      setCurrentApp(app);
    }
  }, [id, app, setCurrentApp]);

  if (!app && isFetching) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading submissions...</div>;
  }

  if (!app) {
    return (
      <div className="p-8 text-center text-sm text-[#64748B]">
        <p className="mb-4">Application not found.</p>
        <button
          type="button"
          onClick={() => navigate("/applications")}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-medium cursor-pointer"
        >
          Back to applications
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Header
        view="responses"
        activeNav="applications"
        onNavChange={(nav) => {
          if (nav === "applications") {
            navigate(`/applications/${id}`);
          }
        }}
        onLogoClick={() => navigate("/applications")}
        onSignIn={() => navigate("/settings")}
        isSignedIn={isSignedIn}
        appName={app.name}
        onBackToApps={() => navigate("/applications")}
        onPreview={() => navigate(`/applications/${id}/preview`)}
        onPublish={() => setShowPublish(true)}
        onMoreMenu={() => {}}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        plan={plan}
        onBilling={() => navigate("/pricing", { state: { from: `/applications/${id}/responses` } })}
        onUpgrade={() => navigate("/pricing", { state: { from: `/applications/${id}/responses` } })}
        onSettings={() => navigate("/settings", { state: { from: `/applications/${id}/responses` } })}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Responses
          app={app}
          onSelectApplicant={(sub) => {
            setCurrentSubmission(sub);
            navigate(`/applications/${id}/responses/${sub.id}`);
          }}
          plan={plan}
          usageCount={submissionUsage}
          onUpgrade={() => setUpgradeModal("submission-limit")}
          onPublish={() => setShowPublish(true)}
        />
      </main>
    </div>
  );
}
