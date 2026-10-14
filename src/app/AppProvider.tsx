import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Application, Submission, Plan, Section } from "../types";
import { UpgradeModalTrigger } from "../components/UpgradeModal";
import { applicationService, resolveOrganizationAndUser } from "../services/applications";
import { ToastItem } from "../components/common/Snackbar";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  name: string;
  email: string;
  org: string;
}

// --- Auth Context ---
interface AuthContextType {
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  showAuth: boolean;
  setShowAuth: (val: boolean) => void;
  pendingCreatePrompt: string | null;
  setPendingCreatePrompt: (val: string | null) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Applications Context ---
interface ApplicationsContextType {
  applications: Application[];
  loading: boolean;
  refreshApplications: () => Promise<void>;
  createApp: (name: string, description?: string, sections?: Section[], creationPrompt?: string) => Promise<Application>;
  updateApp: (app: Application) => Promise<Application>;
  publishApp: (id: string) => Promise<Application>;
  unpublishApp: (id: string) => Promise<Application>;
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
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}
const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingCreatePrompt, setPendingCreatePrompt] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({
    name: "Hariharan R",
    email: "hariharan.creates@gmail.com",
    org: "Hariharan R's organization",
  });

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Current App/Submission state
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);

  // Plan state
  const [plan, setPlan] = useState<Plan>("free");
  const [submissionUsage, setSubmissionUsage] = useState(0);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debounce & Request ordering for autosave
  const saveTimeoutRef = useRef<any>(null);
  const lastSavePromiseRef = useRef<Promise<any>>(Promise.resolve());

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  function showToast(msg: string) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message: msg }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // Fetch applications directly from Supabase
  const refreshApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err: any) {
      console.error("[Gather AppProvider] Error refreshing applications:", err);
      showToast("Couldn't load applications. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Synchronize Supabase Auth Session
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          if (isMounted) {
            setIsSignedIn(true);
            const userEmail = session.user.email || "hariharan.creates@gmail.com";
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || "Hariharan R";
            setUser({
              name: userName,
              email: userEmail,
              org: `${userName}'s organization`,
            });
            await refreshApplications();
          }
        } else {
          if (isMounted) {
            setIsSignedIn(false);
            setApplications([]);
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn("[Gather Auth] Error during auth initialization:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
        const userEmail = session.user.email || "user@gather.app";
        const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || "Gather User";
        setUser({
          name: userName,
          email: userEmail,
          org: `${userName}'s organization`,
        });
        await refreshApplications();
      } else if (event === "SIGNED_OUT") {
        setIsSignedIn(false);
        setApplications([]);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const createApp = async (
    name: string,
    description?: string,
    sections?: Section[],
    creationPrompt?: string,
    initialHistory?: any
  ) => {
    try {
      const newApp = await applicationService.createApplication(
        name,
        description,
        sections,
        creationPrompt,
        initialHistory
      );
      setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
      return newApp;
    } catch (err: any) {
      console.error("[Gather AppProvider] Error creating application:", err);
      showToast("Couldn't create the application.");
      throw err;
    }
  };

  const updateApp = async (app: Application) => {
    // Update local state immediately for responsive UI
    setApplications((prev) => prev.map((a) => (a.id === app.id ? app : a)));
    if (currentApp && currentApp.id === app.id) {
      setCurrentApp(app);
    }

    // Debounced queue update to Supabase to prevent race conditions and network churn
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    return new Promise<Application>((resolve, reject) => {
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          lastSavePromiseRef.current = lastSavePromiseRef.current.then(() =>
            applicationService.updateApplication(app)
          );
          const savedApp = await lastSavePromiseRef.current;
          resolve(savedApp);
        } catch (err) {
          console.error("[Gather AppProvider] Error saving application updates:", err);
          showToast("Couldn't save your changes. Please try again.");
          reject(err);
        }
      }, 400);
    });
  };

  const publishApp = async (id: string) => {
    try {
      const updated = await applicationService.publishApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (currentApp && currentApp.id === id) {
        setCurrentApp(updated);
      }
      return updated;
    } catch (err: any) {
      console.error("[Gather AppProvider] Error publishing application:", err);
      showToast("Couldn't publish the application.");
      throw err;
    }
  };

  const unpublishApp = async (id: string) => {
    try {
      const updated = await applicationService.unpublishApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (currentApp && currentApp.id === id) {
        setCurrentApp(updated);
      }
      return updated;
    } catch (err: any) {
      console.error("[Gather AppProvider] Error unpublishing application:", err);
      showToast("Couldn't unpublish the application.");
      throw err;
    }
  };

  const deleteApp = async (id: string) => {
    try {
      await applicationService.deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (currentApp && currentApp.id === id) {
        setCurrentApp(null);
      }
    } catch (err: any) {
      console.error("[Gather AppProvider] Error deleting application:", err);
      showToast("Couldn't delete the application.");
      throw err;
    }
  };

  const duplicateApp = async (app: Application) => {
    try {
      const dup = await applicationService.duplicateApplication(app);
      setApplications((prev) => [dup, ...prev]);
      return dup;
    } catch (err: any) {
      console.error("[Gather AppProvider] Error duplicating application:", err);
      showToast("Couldn't duplicate the application.");
      throw err;
    }
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
        user,
        setUser,
      }}
    >
      <ApplicationsContext.Provider
        value={{
          applications,
          loading,
          refreshApplications,
          createApp,
          updateApp,
          publishApp,
          unpublishApp,
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
                isSidebarOpen,
                setIsSidebarOpen,
                toggleSidebar,
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
