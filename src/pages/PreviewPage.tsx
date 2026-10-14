import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, usePlan, useUIState } from "../app/AppProvider";
import { Application } from "../types";
import { applicationService } from "../services/applications";
import Preview from "../components/Preview";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();
  const { currentApp, setCurrentApp } = useCurrentApplication();
  const { plan } = usePlan();
  const { setShowPublish } = useUIState();
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
        console.warn("Failed to fetch application in PreviewPage:", err);
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
    if (app) {
      setCurrentApp(app);
    }
  }, [id, app, setCurrentApp]);

  if (!app && isFetching) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading preview...</div>;
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

  return (
    <Preview
      app={app}
      onBack={() => navigate(`/applications/${id}`)}
      onPublish={() => setShowPublish(true)}
      plan={plan}
      onUpgrade={() => navigate("/pricing")}
    />
  );
}
