import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import LearningPathSection from "./components/LearningPathSection";
import HowItWorksSection from "./components/HowItWorksSection";
import CTAFooterSection from "./components/CTAFooterSection";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <LearningPathSection />
      <HowItWorksSection />
      <CTAFooterSection />
    </main>
  );
}
