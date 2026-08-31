import { useNavigate } from "react-router-dom";
import { usePlan } from "../app/AppProvider";
import Settings from "../components/Settings";

export default function SettingsPage() {
  const { plan, submissionUsage } = usePlan();
  const navigate = useNavigate();

  return (
    <Settings
      plan={plan}
      submissionUsage={submissionUsage}
      onUpgrade={() => navigate("/pricing")}
      onBack={() => navigate("/applications")}
    />
  );
}
