import { useNavigate } from "react-router-dom";
import { useApplications, useAuth, useUIState, useCurrentApplication, usePlan } from "../app/AppProvider";
import Header from "../components/Header";
import FreeBanner from "../components/FreeBanner";
import CreatedForms from "../components/dashboard/CreatedForms";

export default function ApplicationsPage() {
  const { applications, duplicateApp, deleteApp } = useApplications();
  const { isSignedIn, setShowAuth } = useAuth();
  const { plan, setShowSearch } = useUIState();
  const { setCurrentApp } = useCurrentApplication();
  const { submissionUsage, bannerDismissed, setBannerDismissed } = usePlan();
  const navigate = useNavigate();

  const showBanner = plan === "free" && !bannerDismissed;

  function handleOpenApp(app: any) {
    setCurrentApp(app);
    navigate(`/app/applications/${app.id}`);
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* 1. Top Navigation / Header */}
      <Header
        view="applications-list"
        activeNav="applications"
        onNavChange={(nav) => {
          if (nav === "templates") {
            navigate("/app/templates");
          }
        }}
        onLogoClick={() => navigate("/app")}
        onSignIn={() => setShowAuth(true)}
        isSignedIn={isSignedIn}
        onBackToApps={() => navigate("/app/applications")}
        plan={plan}
        onBilling={() => navigate("/app/pricing", { state: { from: "/app/applications" } })}
        onUpgrade={() => navigate("/app/pricing", { state: { from: "/app/applications" } })}
        onSettings={() => navigate("/app/settings", { state: { from: "/app/applications" } })}
        onSearchClick={() => setShowSearch(true)}
      />

      {/* 2. Free Submissions Banner */}
      {showBanner && (
        <FreeBanner
          usageCount={submissionUsage}
          limit={10}
          onUpgrade={() => navigate("/app/pricing")}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* 3. Applications Page Content */}
      <main className="flex-1 overflow-y-auto">
        <CreatedForms
          applications={applications}
          onOpenApp={handleOpenApp}
          onCreateClick={() => navigate("/app")}
          onDuplicateApp={duplicateApp}
          onDeleteApp={deleteApp}
        />
      </main>
    </div>
  );
}
