import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplications, useCurrentApplication, usePlan, useUIState } from "../app/AppProvider";
import Preview from "../components/Preview";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { applications } = useApplications();
  const { currentApp, setCurrentApp } = useCurrentApplication();
  const { plan } = usePlan();
  const { setShowPublish } = useUIState();
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === id);

  useEffect(() => {
    if (app) {
      setCurrentApp(app);
    }
  }, [id, app, setCurrentApp]);

  if (!app) {
    return <div className="p-8 text-center text-sm text-[#64748B]">Loading preview...</div>;
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
