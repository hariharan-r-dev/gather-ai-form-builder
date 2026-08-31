import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, useAuth, usePlan, useUIState } from "../app/AppProvider";
import Header from "../components/Header";
import Responses from "../components/Responses";

export default function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();
  const { currentApp, setCurrentApp, setCurrentSubmission } = useCurrentApplication();
  const { isSignedIn } = useAuth();
  const { plan, submissionUsage } = usePlan();
  const { setShowSearch, setShowPublish, setUpgradeModal } = useUIState();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id);

  useEffect(() => {
    if (app) {
      setCurrentApp(app);
    }
  }, [id, app, setCurrentApp]);

  if (!app) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading submissions...</div>;
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
        onBilling={() => navigate("/pricing")}
        onUpgrade={() => navigate("/pricing")}
        onSettings={() => navigate("/settings")}
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
