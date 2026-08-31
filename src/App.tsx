import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useAuth, useUIState, usePlan, useCurrentApplication, useApplications } from "./app/AppProvider";
import FreeBanner from "./components/FreeBanner";

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
    setCreatePrompt,
    toasts,
    removeToast,
  } = useUIState();
  const { currentApp, setCurrentApp } = useCurrentApplication();
  const { applications, updateApp, deleteApp } = useApplications();
  const navigate = useNavigate();

  function handleAuthSuccess() {
    setIsSignedIn(true);
    setShowAuth(false);
    if (pendingCreatePrompt !== null) {
      setCreatePrompt(pendingCreatePrompt);
      setPendingCreatePrompt(null);
      navigate("/applications/new");
    }
  }

  function handlePublished() {
    if (!currentApp) return;
    updateApp({ ...currentApp, status: "published" });
  }

  function handleUnpublished() {
    if (!currentApp) return;
    updateApp({ ...currentApp, status: "draft" });
  }

  function handleSettingsSave(name: string, description: string) {
    if (!currentApp) return;
    updateApp({ ...currentApp, name, description });
    setShowFormSettingsModal(false);
  }

  function handleDeleteConfirm() {
    if (!currentApp) return;
    deleteApp(currentApp.id);
    setCurrentApp(null);
    setShowDeleteConfirmModal(false);
    navigate("/applications");
  }

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

      {showPublish && currentApp && (
        <PublishModal
          app={currentApp}
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
  const { plan, submissionUsage, bannerDismissed, setBannerDismissed } = usePlan();
  const location = useLocation();
  const navigate = useNavigate();

  const isPublicForm = location.pathname.startsWith("/form/");

  const showBanner =
    plan === "free" &&
    !bannerDismissed &&
    (location.pathname === "/applications" || location.pathname === "/applications/new");

  return (
    <div className={`flex flex-col ${isPublicForm ? "min-h-screen" : "h-full"} bg-[#F8FAFC]`}>
      {showBanner && (
        <FreeBanner
          usageCount={submissionUsage}
          limit={10}
          onUpgrade={() => navigate("/pricing")}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      <main className={`flex-1 flex flex-col ${isPublicForm ? "overflow-y-auto min-h-0" : "overflow-hidden"}`}>
        <AppRoutes />
      </main>

      <GlobalModals />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
}
