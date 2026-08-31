import { useNavigate } from "react-router-dom";
import { usePlan } from "../app/AppProvider";
import CheckoutPage from "../components/CheckoutPage";

export default function CheckoutPageContainer() {
  const { setPlan } = usePlan();
  const navigate = useNavigate();

  function handleSuccess() {
    setPlan("pro");
    navigate("/payment-success");
  }

  return (
    <CheckoutPage
      onSuccess={handleSuccess}
      onBack={() => navigate("/pricing")}
    />
  );
}
