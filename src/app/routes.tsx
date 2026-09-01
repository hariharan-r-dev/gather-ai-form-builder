import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import TemplatesPage from "../pages/TemplatesPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import GeneratingPage from "../pages/GeneratingPage";
import EditorPage from "../pages/EditorPage";
import PreviewPage from "../pages/PreviewPage";
import ResponsesPage from "../pages/ResponsesPage";
import ApplicantDetailPage from "../pages/ApplicantDetailPage";
import PublicFormPage from "../pages/PublicFormPage";
import SettingsPage from "../pages/SettingsPage";
import PricingPage from "../pages/PricingPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/applications/new" element={<Navigate to="/" replace />} />
      <Route path="/applications/generating" element={<GeneratingPage />} />
      <Route path="/applications/:id" element={<EditorPage />} />
      <Route path="/applications/:id/preview" element={<PreviewPage />} />
      <Route path="/applications/:id/responses" element={<ResponsesPage />} />
      <Route path="/applications/:id/responses/:submissionId" element={<ApplicantDetailPage />} />
      <Route path="/form/:slug" element={<PublicFormPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
