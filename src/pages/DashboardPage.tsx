import { useNavigate } from "react-router-dom";
import { useApplications, useAuth, useUIState, useCurrentApplication } from "../app/AppProvider";
import Header from "../components/Header";
import HeroCreate from "../components/dashboard/HeroCreate";
import PromptRecommendations from "../components/dashboard/PromptRecommendations";
import CreatedForms from "../components/dashboard/CreatedForms";

export default function DashboardPage() {
  const { applications, duplicateApp, deleteApp } = useApplications();
  const { isSignedIn, setShowAuth, setPendingCreatePrompt } = useAuth();
  const { setGeneratePrompt, plan, setShowSearch } = useUIState();
  const { setCurrentApp } = useCurrentApplication();
  const navigate = useNavigate();

  function handleCreate(prompt: string) {
    if (!prompt.trim()) return;
    if (!isSignedIn) {
      setPendingCreatePrompt(prompt);
      setShowAuth(true);
    } else {
      setGeneratePrompt(prompt);
      navigate("/applications/generating");
    }
  }

  function handleUseRecommendation(prompt: string) {
    if (!prompt.trim()) return;
    if (!isSignedIn) {
      setPendingCreatePrompt(prompt);
      setShowAuth(true);
    } else {
      setGeneratePrompt(prompt);
      navigate("/applications/generating");
    }
  }

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
        {/* Hero Create */}
        <HeroCreate onCreateApp={handleCreate} />

        {/* Start with an idea (recommendations) - only shown when applications list is empty */}
        {applications.length === 0 && (
          <PromptRecommendations onUseRecommendation={handleUseRecommendation} />
        )}

        {/* Created Forms */}
        <CreatedForms
          applications={applications}
          onOpenApp={handleOpenApp}
          onCreateClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onDuplicateApp={duplicateApp}
          onDeleteApp={deleteApp}
        />
      </main>
    </div>
  );
}
