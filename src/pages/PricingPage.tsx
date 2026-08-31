import { useNavigate } from "react-router-dom";
import { usePlan } from "../app/AppProvider";
import PricingPage from "../components/PricingPage";

export default function PricingPageContainer() {
  const { plan } = usePlan();
  const navigate = useNavigate();

  return (
    <PricingPage
      plan={plan}
      onUpgrade={() => navigate("/checkout")}
      onBack={() => navigate("/applications")}
    />
  );
}
