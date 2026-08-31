import { useNavigate } from "react-router-dom";
import PaymentSuccessPage from "../components/PaymentSuccessPage";

export default function PaymentSuccessPageContainer() {
  const navigate = useNavigate();

  return <PaymentSuccessPage onBackToApps={() => navigate("/applications")} />;
}
