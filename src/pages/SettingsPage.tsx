import { useNavigate, useLocation } from "react-router-dom";
import { usePlan } from "../app/AppProvider";
import Settings from "../components/Settings";

export default function SettingsPage() {
  const { plan, submissionUsage } = usePlan();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = (location.state as any)?.from;

  let backLabel = "Back to Home";
  let backPath = "/";

  if (fromPath === "/applications") {
    backLabel = "Back to Applications";
    backPath = "/applications";
  } else if (fromPath === "/") {
    backLabel = "Back to Home";
    backPath = "/";
  } else if (fromPath?.startsWith("/applications/")) {
    backLabel = "Back to Form Editor";
    backPath = fromPath;
  } else if (fromPath) {
    backLabel = "Back";
    backPath = fromPath;
  }

  return (
    <Settings
      plan={plan}
      submissionUsage={submissionUsage}
      onUpgrade={() => navigate("/pricing", { state: { from: fromPath || "/" } })}
      onBack={() => navigate(backPath)}
      backLabel={backLabel}
    />
  );
}
