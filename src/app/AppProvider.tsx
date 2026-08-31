import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Application, Submission, Plan, Section } from "../types";
import { UpgradeModalTrigger } from "../components/UpgradeModal";
import { applicationService } from "../services/applications/applicationService";
import { ToastItem } from "../components/common/Snackbar";

// --- Auth Context ---
interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  showAuth: boolean;
  setShowAuth: (val: boolean) => void;
  pendingCreatePrompt: string | null;
  setPendingCreatePrompt: (val: string | null) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Applications Context ---
interface ApplicationsContextType {
  applications: Application[];
  loading: boolean;
  refreshApplications: () => Promise<void>;
  createApp: (name: string, description?: string, sections?: Section[], creationPrompt?: string) => Promise<Application>;
  updateApp: (app: Application) => Promise<Application>;
  deleteApp: (id: string) => Promise<void>;
  duplicateApp: (app: Application) => Promise<Application>;
}
const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

// --- Current Application Context ---
interface CurrentAppContextType {
  currentApp: Application | null;
  setCurrentApp: (app: Application | null) => void;
  currentSubmission: Submission | null;
  setCurrentSubmission: (sub: Submission | null) => void;
}
const CurrentAppContext = createContext<CurrentAppContextType | undefined>(undefined);

// --- Plan/Billing Context ---
interface PlanContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  submissionUsage: number;
  setSubmissionUsage: (usage: number) => void;
  bannerDismissed: boolean;
  setBannerDismissed: (dismissed: boolean) => void;
}
const PlanContext = createContext<PlanContextType | undefined>(undefined);

// --- UI / Modal Context ---
interface UIStateContextType {
  activeNav: "applications" | "templates";
  setActiveNav: (nav: "applications" | "templates") => void;
  createPrompt: string;
  setCreatePrompt: (prompt: string) => void;
  generatePrompt: string;
  setGeneratePrompt: (prompt: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showPublish: boolean;
  setShowPublish: (show: boolean) => void;
  upgradeModal: UpgradeModalTrigger | null;
  setUpgradeModal: (modal: UpgradeModalTrigger | null) => void;
  showDraftSavedModal: boolean;
  setShowDraftSavedModal: (show: boolean) => void;
  showDeleteConfirmModal: boolean;
  setShowDeleteConfirmModal: (show: boolean) => void;
  showFormSettingsModal: boolean;
  setShowFormSettingsModal: (show: boolean) => void;
  formSettingsSection: "general" | "submission" | "confirmation" | "privacy";
  setFormSettingsSection: (sec: "general" | "submission" | "confirmation" | "privacy") => void;
  formSettingsName: string;
  setFormSettingsName: (name: string) => void;
  formSettingsDesc: string;
  setFormSettingsDesc: (desc: string) => void;
  formSettingsAllowSubmissions: boolean;
  setFormSettingsAllowSubmissions: (allow: boolean) => void;
  formSettingsConfirmMsg: string;
  setFormSettingsConfirmMsg: (msg: string) => void;
  toasts: ToastItem[];
  showToast: (msg: string) => void;
  removeToast: (id: string) => void;
}
const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingCreatePrompt, setPendingCreatePrompt] = useState<string | null>(null);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Current App/Submission state
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);

  // Plan state
  const [plan, setPlan] = useState<Plan>("free");
  const [submissionUsage, setSubmissionUsage] = useState(4);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // UI / Modal state
  const [activeNav, setActiveNav] = useState<"applications" | "templates">("applications");
  const [createPrompt, setCreatePrompt] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState<UpgradeModalTrigger | null>(null);
  const [showDraftSavedModal, setShowDraftSavedModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showFormSettingsModal, setShowFormSettingsModal] = useState(false);
  const [formSettingsSection, setFormSettingsSection] = useState<"general" | "submission" | "confirmation" | "privacy">("general");
  const [formSettingsName, setFormSettingsName] = useState("");
  const [formSettingsDesc, setFormSettingsDesc] = useState("");
  const [formSettingsAllowSubmissions, setFormSettingsAllowSubmissions] = useState(true);
  const [formSettingsConfirmMsg, setFormSettingsConfirmMsg] = useState("Thank you for your submission! We'll be in touch soon.");
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function showToast(msg: string) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message: msg }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Fetch applications on mount
  const refreshApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshApplications();
  }, []);

  const createApp = async (name: string, description?: string, sections?: Section[], creationPrompt?: string) => {
    const newApp = await applicationService.createApplication(name, description, sections, creationPrompt);
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApp = async (app: Application) => {
    const updated = await applicationService.updateApplication(app);
    setApplications((prev) => prev.map((a) => (a.id === app.id ? updated : a)));
    if (currentApp && currentApp.id === app.id) {
      setCurrentApp(updated);
    }
    return updated;
  };

  const deleteApp = async (id: string) => {
    await applicationService.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (currentApp && currentApp.id === id) {
      setCurrentApp(null);
    }
  };

  const duplicateApp = async (app: Application) => {
    const dup = await applicationService.duplicateApplication(app);
    setApplications((prev) => [dup, ...prev]);
    return dup;
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSignedIn,
        showAuth,
        setShowAuth,
        pendingCreatePrompt,
        setPendingCreatePrompt,
      }}
    >
      <ApplicationsContext.Provider
        value={{
          applications,
          loading,
          refreshApplications,
          createApp,
          updateApp,
          deleteApp,
          duplicateApp,
        }}
      >
        <CurrentAppContext.Provider
          value={{
            currentApp,
            setCurrentApp,
            currentSubmission,
            setCurrentSubmission,
          }}
        >
          <PlanContext.Provider
            value={{
              plan,
              setPlan,
              submissionUsage,
              setSubmissionUsage,
              bannerDismissed,
              setBannerDismissed,
            }}
          >
            <UIStateContext.Provider
              value={{
                activeNav,
                setActiveNav,
                createPrompt,
                setCreatePrompt,
                generatePrompt,
                setGeneratePrompt,
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
                formSettingsSection,
                setFormSettingsSection,
                formSettingsName,
                setFormSettingsName,
                formSettingsDesc,
                setFormSettingsDesc,
                formSettingsAllowSubmissions,
                setFormSettingsAllowSubmissions,
                formSettingsConfirmMsg,
                setFormSettingsConfirmMsg,
                toasts,
                showToast,
                removeToast,
              }}
            >
              {children}
            </UIStateContext.Provider>
          </PlanContext.Provider>
        </CurrentAppContext.Provider>
      </ApplicationsContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AppProvider");
  return context;
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error("useApplications must be used within AppProvider");
  return context;
}

export function useCurrentApplication() {
  const context = useContext(CurrentAppContext);
  if (!context) throw new Error("useCurrentApplication must be used within AppProvider");
  return context;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used within AppProvider");
  return context;
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) throw new Error("useUIState must be used within AppProvider");
  return context;
}
