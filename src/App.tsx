import { useEffect } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useAuth, useUIState, useCurrentApplication, useApplications } from "./app/AppProvider";

import AppRoutes from "./app/routes";

// Modal imports
import AuthModal from "./components/modals/AuthModal";
import SearchModal from "./components/modals/SearchModal";
import PublishModal from "./components/modals/PublishModal";
import UpgradeModal from "./components/modals/UpgradeModal";
import DraftSavedModal from "./components/modals/DraftSavedModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import FormSettingsModal from "./components/modals/FormSettingsModal";
import Snackbar from "./components/common/Snackbar";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function GlobalModals() {
  const { showAuth, setShowAuth, pendingCreatePrompt, setPendingCreatePrompt, setIsSignedIn } = useAuth();
  const {
    showSearch,
    setShowSearch,
    showPublish,
    setShowPublish,
    upgradeModal,
    setUpgradeModal,
    showDraftSavedModal,
    setShowDraftSavedModal,
    showDeleteConfirmModal,
    setShowDeleteConfirmModal,
    showFormSettingsModal,
    setShowFormSettingsModal,
    setGeneratePrompt,
    toasts,
    removeToast,
  } = useUIState();
  const { currentApp, setCurrentApp } = useCurrentApplication();
  const navigate = useNavigate();

  function handleAuthSuccess() {
    setIsSignedIn(true);
    setShowAuth(false);
    if (pendingCreatePrompt !== null) {
      setGeneratePrompt(pendingCreatePrompt);
      setPendingCreatePrompt(null);
      navigate("/app/applications/generating");
    }
  }

  const { applications, updateApp, publishApp, unpublishApp, deleteApp } = useApplications();

  async function handlePublished() {
    if (!currentApp) return;
    await publishApp(currentApp.id);
  }

  async function handleUnpublished() {
    if (!currentApp) return;
    await unpublishApp(currentApp.id);
  }

  function handleSettingsSave(updates: Partial<Application>) {
    if (!currentApp) return;
    const updated = { ...currentApp, ...updates };
    updateApp(updated);
    setCurrentApp(updated);
    setShowFormSettingsModal(false);
  }

  function handleDeleteConfirm() {
    if (!currentApp) return;
    deleteApp(currentApp.id);
    setCurrentApp(null);
    setShowDeleteConfirmModal(false);
    navigate("/applications");
  }

  const activePublishApp = currentApp
    ? applications.find((a) => a.id === currentApp.id) || currentApp
    : null;

  return (
    <>
      {showAuth && (
        <AuthModal
          onClose={() => {
            setShowAuth(false);
            setPendingCreatePrompt(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showSearch && (
        <SearchModal
          applications={applications}
          onClose={() => setShowSearch(false)}
          onOpenApp={(app) => {
            setCurrentApp(app);
            navigate(`/applications/${app.id}`);
          }}
        />
      )}

      {showPublish && activePublishApp && (
        <PublishModal
          app={activePublishApp}
          onClose={() => setShowPublish(false)}
          onPublished={handlePublished}
          onUnpublished={handleUnpublished}
        />
      )}

      {upgradeModal !== null && (
        <UpgradeModal
          trigger={upgradeModal}
          onUpgrade={() => {
            setUpgradeModal(null);
            navigate("/pricing");
          }}
          onClose={() => setUpgradeModal(null)}
        />
      )}

      {showDraftSavedModal && (
        <DraftSavedModal onClose={() => setShowDraftSavedModal(false)} />
      )}

      {showDeleteConfirmModal && currentApp && (
        <DeleteConfirmModal
          appName={currentApp.name}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showFormSettingsModal && currentApp && (
        <FormSettingsModal
          app={currentApp}
          onClose={() => setShowFormSettingsModal(false)}
          onSave={handleSettingsSave}
        />
      )}

      <Snackbar
        toasts={toasts}
        onRemove={removeToast}
      />
    </>
  );
}

function MainLayout() {
  const location = useLocation();
  const isPublicForm = location.pathname.startsWith("/form/") || location.pathname.startsWith("/apply/");
  const isMarketing =
    location.pathname === "/" ||
    location.pathname.startsWith("/blog") ||
    location.pathname.startsWith("/whats-new") ||
    location.pathname === "/terms" ||
    location.pathname === "/legal" ||
    location.pathname === "/privacy" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  if (isPublicForm || isMarketing) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 flex flex-col min-h-0">
          <AppRoutes />
        </main>
        <GlobalModals />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <AppRoutes />
        </main>
      </div>

      <GlobalModals />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <MainLayout />
      </Router>
    </AppProvider>
  );
}
