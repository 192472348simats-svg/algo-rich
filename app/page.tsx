import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SocialProofSection from "./components/SocialProofSection";
import LiveDemoSection from "./components/LiveDemoSection";
import FeaturesSection from "./components/FeaturesSection";
import LearningPathSection from "./components/LearningPathSection";
import HowItWorksSection from "./components/HowItWorksSection";
import EmailCaptureSection from "./components/EmailCaptureSection";
import CTAFooterSection from "./components/CTAFooterSection";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden" style={{ background: "#0a0f24" }}>
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <LiveDemoSection />
      <FeaturesSection />
      <LearningPathSection />
      <HowItWorksSection />
      <EmailCaptureSection />
      <CTAFooterSection />
    </main>
  );
}
