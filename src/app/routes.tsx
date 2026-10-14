import { Routes, Route, Navigate } from "react-router-dom";

// Marketing pages
import LandingPage from "../marketing/pages/LandingPage";
import BlogPage from "../marketing/pages/BlogPage";
import WhatsNewPage from "../marketing/pages/WhatsNewPage";
import WhatsNewArticlePage from "../marketing/pages/WhatsNewArticlePage";
import TermsPage from "../marketing/pages/TermsPage";
import LegalPage from "../marketing/pages/LegalPage";
import LoginPage from "../marketing/pages/LoginPage";
import SignupPage from "../marketing/pages/SignupPage";

// Existing SaaS application pages
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
      {/* 1. Marketing Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/whats-new" element={<WhatsNewPage />} />
      <Route path="/whats-new/:slug" element={<WhatsNewArticlePage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/privacy" element={<Navigate to="/legal" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 2. SaaS Application Routes (/app/...) */}
      <Route path="/app" element={<DashboardPage />} />
      <Route path="/app/applications" element={<ApplicationsPage />} />
      <Route path="/app/applications/new" element={<Navigate to="/app" replace />} />
      <Route path="/app/applications/generating" element={<GeneratingPage />} />
      <Route path="/app/applications/:id" element={<EditorPage />} />
      <Route path="/app/applications/:id/preview" element={<PreviewPage />} />
      <Route path="/app/applications/:id/responses" element={<ResponsesPage />} />
      <Route path="/app/applications/:id/responses/:submissionId" element={<ApplicantDetailPage />} />
      <Route path="/app/templates" element={<TemplatesPage />} />
      <Route path="/app/settings" element={<SettingsPage />} />
      <Route path="/app/pricing" element={<PricingPage />} />
      <Route path="/app/checkout" element={<CheckoutPage />} />
      <Route path="/app/payment-success" element={<PaymentSuccessPage />} />

      {/* 3. Backward-Compatible SaaS Root Route Aliases */}
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/applications/new" element={<Navigate to="/app" replace />} />
      <Route path="/applications/generating" element={<GeneratingPage />} />
      <Route path="/applications/:id" element={<EditorPage />} />
      <Route path="/applications/:id/preview" element={<PreviewPage />} />
      <Route path="/applications/:id/responses" element={<ResponsesPage />} />
      <Route path="/applications/:id/responses/:submissionId" element={<ApplicantDetailPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />

      {/* 4. Public Form Routes */}
      <Route path="/apply/:slug" element={<PublicFormPage />} />
      <Route path="/form/:slug" element={<PublicFormPage />} />

      {/* 5. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
