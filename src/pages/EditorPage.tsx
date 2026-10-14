import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, useAuth, useUIState } from "../app/AppProvider";
import { Application } from "../types";
import { applicationService } from "../services/applications";
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
        console.warn("Failed to fetch application in EditorPage:", err);
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
    if (app && (!currentApp || currentApp.id !== app.id)) {
      setCurrentApp(app);
    }
  }, [id, app, currentApp, setCurrentApp]);

  if (!app && isFetching) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading application...</div>;
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
        onPublish={() => {
          if (app) setCurrentApp(app);
          setShowPublish(true);
        }}
        onMoreMenu={handleMoreMenu}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        plan={plan}
        onBilling={() => navigate("/pricing", { state: { from: `/applications/${id}` } })}
        onUpgrade={() => navigate("/pricing", { state: { from: `/applications/${id}` } })}
        onSettings={() => navigate("/settings", { state: { from: `/applications/${id}` } })}
        onSearchClick={() => setShowSearch(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Editor app={app} onUpdateApp={updateApp} />
      </main>
    </div>
  );
}
