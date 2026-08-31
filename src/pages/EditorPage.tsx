import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, useAuth, useUIState } from "../app/AppProvider";
import Header from "../components/Header";
import Editor from "../components/Editor";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, updateApp, duplicateApp } = useApplications();
  const { currentApp, setCurrentApp } = useCurrentApplication();
  const { isSignedIn } = useAuth();
  const {
    plan,
    setShowSearch,
    setShowPublish,
    setShowFormSettingsModal,
    setShowDraftSavedModal,
    setShowDeleteConfirmModal,
    setFormSettingsName,
    setFormSettingsDesc,
  } = useUIState();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id) || (currentApp?.id === id ? currentApp : null);

  useEffect(() => {
    if (app && (!currentApp || currentApp.id !== app.id)) {
      setCurrentApp(app);
    }
  }, [id, app, currentApp, setCurrentApp]);

  if (!app) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading application...</div>;
  }

  function handleMoreMenu(action: string) {
    if (action === "settings") {
      setFormSettingsName(app?.name ?? "");
      setFormSettingsDesc(app?.description ?? "");
      setShowFormSettingsModal(true);
    }
    if (action === "save draft") setShowDraftSavedModal(true);
    if (action === "delete") setShowDeleteConfirmModal(true);
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <Header
        view="editor"
        activeNav="applications"
        onNavChange={(nav) => {
          if (nav === "responses") {
            navigate(`/applications/${id}/responses`);
          }
        }}
        onLogoClick={() => navigate("/applications")}
        onSignIn={() => navigate("/settings")}
        isSignedIn={isSignedIn}
        appName={app.name}
        onBackToApps={() => navigate("/applications")}
        onPreview={() => navigate(`/applications/${id}/preview`)}
        onPublish={() => setShowPublish(true)}
        onMoreMenu={handleMoreMenu}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        plan={plan}
        onBilling={() => navigate("/pricing")}
        onUpgrade={() => navigate("/pricing")}
        onSettings={() => navigate("/settings")}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Editor app={app} onUpdateApp={updateApp} />
      </main>
    </div>
  );
}
