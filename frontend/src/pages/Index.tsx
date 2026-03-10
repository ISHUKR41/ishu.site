/**
 * Index.tsx - Home Page
 * 
 * This is the landing page of ISHU — Indian StudentHub University.
 * It combines multiple sections to showcase all features:
 * 
 * Sections (in order):
 * 1. HeroSection - Main banner with animated text, particles, 3D scene
 * 2. TrustedBySection - Logos/names of organizations that trust us
 * 3. StatsSection - Key numbers (users, tools, states covered)
 * 4. FeaturesSection - Main platform features with icons
 * 5. ExamCategoriesSection - Grid of exam categories (UPSC, SSC, etc.)
 * 6. ResultsPreview - Preview of latest government exam results
 * 7. StatesMapSection - Interactive India map showing state coverage
 * 8. ToolsPreview - Showcase of popular PDF tools
 * 9. NewsPreview - Latest news articles preview
 * 10. WhyChooseUs - Reasons to use the platform
 * 11. WhatsAppCTA - Call-to-action for WhatsApp notifications
 * 12. BlogPreview - Latest blog posts preview
 * 13. TestimonialsSection - User reviews and testimonials
 * 14. FAQSection - Frequently asked questions with accordion
 * 
 * SEO: Includes WebsiteSchema and OrganizationSchema for Google
 */

import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import PlatformOverview from "@/components/home/PlatformOverview";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ExamCategoriesSection from "@/components/home/ExamCategoriesSection";
import ResultsPreview from "@/components/home/ResultsPreview";
import StatesMapSection from "@/components/home/StatesMapSection";
import ToolsPreview from "@/components/home/ToolsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import BlogPreview from "@/components/home/BlogPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TrustedBySection from "@/components/home/TrustedBySection";
import FAQSection from "@/components/home/FAQSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import TechStackSection from "@/components/home/TechStackSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import ImmersiveExperienceSection from "@/components/home/ImmersiveExperienceSection";
import InnovationMatrixSection from "@/components/home/InnovationMatrixSection";
import LivePulseSection from "@/components/home/LivePulseSection";
import { WebsiteSchema, OrganizationSchema } from "@/components/seo/JsonLd";

const Index = () => {
  return (
    <Layout>
      {/* SEO Schemas - invisible structured data for search engines */}
      <WebsiteSchema />
      <OrganizationSchema />
      
      {/* All home page sections rendered in order */}
      <HeroSection />
      <TrustedBySection />
      <StatsSection />
      <PlatformOverview />
      <HowItWorksSection />
      <ImmersiveExperienceSection />
      <InnovationMatrixSection />
      <FeaturesSection />
      <ExamCategoriesSection />
      <ResultsPreview />
      <StatesMapSection />
      <ToolsPreview />
      <NewsPreview />
      <WhyChooseUs />
      <TechStackSection />
      <WhatsAppCTA />
      <BlogPreview />
      <TestimonialsSection />
      <AchievementsSection />
      <LivePulseSection />
      <CallToActionSection />
      <FAQSection />
    </Layout>
  );
};

export default Index;
