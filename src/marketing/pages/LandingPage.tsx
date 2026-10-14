import MarketingNavbar from "../components/MarketingNavbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import ProductExperience from "../components/ProductExperience";
import ApplicationTypes from "../components/ApplicationTypes";
import Submissions from "../components/Submissions";
import UpcomingFeatures from "../components/UpcomingFeatures";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import MarketingFooter from "../components/MarketingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col overflow-x-hidden selection:bg-[#BFDBFE] selection:text-[#1E40AF]">
      {/* Fixed / Glassmorphic Navigation */}
      <MarketingNavbar />

      {/* Main Continuous Scrolling Landing Page Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. How It Works Section */}
        <HowItWorks />

        {/* 3. Features Section */}
        <Features />

        {/* 4. Product Experience Interactive Showcase */}
        <ProductExperience />

        {/* 5. Application Types Archetypes */}
        <ApplicationTypes />

        {/* 6. Submissions Management & Document Preview */}
        <Submissions />

        {/* 7. Upcoming Features & Roadmap */}
        <UpcomingFeatures />

        {/* 8. Pricing & Comparison Table */}
        <PricingSection />

        {/* 9. FAQ Section */}
        <FAQSection />

        {/* 10. Contact Us Section */}
        <ContactSection />
      </main>

      {/* 11. Footer */}
      <MarketingFooter />
    </div>
  );
}
