import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import LearningPathSection from "./components/LearningPathSection";
import SocialProofSection from "./components/SocialProofSection";
import CTAFooterSection from "./components/CTAFooterSection";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden" style={{ background: "#0a0f24" }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LearningPathSection />
      <SocialProofSection />
      <CTAFooterSection />
    </main>
  );
}
