import { useMemo } from "react";
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

  // Show recently created forms, sorted newest first
  const recentApplications = useMemo(() => {
    return [...applications].reverse();
  }, [applications]);

  function handleCreate(prompt: string) {
    if (!prompt.trim()) return;
    if (!isSignedIn) {
      setPendingCreatePrompt(prompt);
      setShowAuth(true);
    } else {
      setGeneratePrompt(prompt);
      navigate("/app/applications/generating");
    }
  }

  function handleUseRecommendation(prompt: string) {
    if (!prompt.trim()) return;
    if (!isSignedIn) {
      setPendingCreatePrompt(prompt);
      setShowAuth(true);
    } else {
      setGeneratePrompt(prompt);
      navigate("/app/applications/generating");
    }
  }

  function handleOpenApp(app: any) {
    setCurrentApp(app);
    navigate(`/app/applications/${app.id}`);
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
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
        onBilling={() => navigate("/app/pricing", { state: { from: "/app" } })}
        onUpgrade={() => navigate("/app/pricing", { state: { from: "/app" } })}
        onSettings={() => navigate("/app/settings", { state: { from: "/app" } })}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Hero Create */}
        <HeroCreate onCreateApp={handleCreate} />

        {/* Start with an idea (recommendations) - only shown when applications list is empty */}
        {applications.length === 0 && (
          <PromptRecommendations onUseRecommendation={handleUseRecommendation} />
        )}

        {/* Recently created forms */}
        <CreatedForms
          title="Recently created"
          showControls={false}
          applications={recentApplications}
          onOpenApp={handleOpenApp}
          onCreateClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onDuplicateApp={duplicateApp}
          onDeleteApp={deleteApp}
        />
      </main>
    </div>
  );
}
