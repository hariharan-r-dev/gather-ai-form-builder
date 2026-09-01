import { useNavigate } from "react-router-dom";
import { useApplications, useAuth, useUIState, useCurrentApplication } from "../app/AppProvider";
import Header from "../components/Header";
import CreatedForms from "../components/dashboard/CreatedForms";

export default function ApplicationsPage() {
  const { applications, duplicateApp, deleteApp } = useApplications();
  const { isSignedIn, setShowAuth } = useAuth();
  const { plan, setShowSearch } = useUIState();
  const { setCurrentApp } = useCurrentApplication();
  const navigate = useNavigate();

  function handleOpenApp(app: any) {
    setCurrentApp(app);
    navigate(`/applications/${app.id}`);
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Header
        view="applications-list"
        activeNav="applications"
        onNavChange={(nav) => {
          if (nav === "templates") {
            navigate("/templates");
          }
        }}
        onLogoClick={() => navigate("/")}
        onSignIn={() => setShowAuth(true)}
        isSignedIn={isSignedIn}
        onBackToApps={() => navigate("/")}
        plan={plan}
        onBilling={() => navigate("/pricing")}
        onUpgrade={() => navigate("/pricing")}
        onSettings={() => navigate("/settings")}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <CreatedForms
          applications={applications}
          onOpenApp={handleOpenApp}
          onCreateClick={() => navigate("/")}
          onDuplicateApp={duplicateApp}
          onDeleteApp={deleteApp}
        />
      </main>
    </div>
  );
}
