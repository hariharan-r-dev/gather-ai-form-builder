import { useNavigate } from "react-router-dom";
import { useAuth, useUIState } from "../app/AppProvider";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";

export default function TemplatesPage() {
  const { isSignedIn, setShowAuth, setPendingCreatePrompt } = useAuth();
  const { setGeneratePrompt, plan, setShowSearch } = useUIState();
  const navigate = useNavigate();

  function handleCreateApp(prompt: string) {
    setGeneratePrompt(prompt);
    navigate("/applications/generating");
  }

  function handleRequireAuth() {
    setPendingCreatePrompt("Create a new application");
    setShowAuth(true);
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Header
        view="dashboard"
        activeNav="templates"
        onNavChange={(nav) => {
          if (nav === "applications") {
            navigate("/app/applications");
          }
        }}
        onLogoClick={() => navigate("/app")}
        onSignIn={() => setShowAuth(true)}
        isSignedIn={isSignedIn}
        onBackToApps={() => navigate("/app/applications")}
        plan={plan}
        onBilling={() => navigate("/app/pricing", { state: { from: "/app/templates" } })}
        onUpgrade={() => navigate("/app/pricing", { state: { from: "/app/templates" } })}
        onSettings={() => navigate("/app/settings", { state: { from: "/app/templates" } })}
        onSearchClick={() => setShowSearch(true)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Dashboard
          onCreateApp={handleCreateApp}
          onRequireAuth={handleRequireAuth}
          isSignedIn={isSignedIn}
        />
      </main>
    </div>
  );
}
