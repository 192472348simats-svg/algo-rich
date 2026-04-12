import type React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import LearningPathSection from "./components/LearningPathSection";
import SocialProofSection from "./components/SocialProofSection";
import CTAFooterSection from "./components/CTAFooterSection";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden" style={{ background: "#0B0F1A" }}>
      {/* Ambient depth blobs */}
      <div className="ambient-blob" style={{ width: 380, height: 380, background: "radial-gradient(circle at 30% 30%, rgba(79,157,255,0.28), transparent 55%)", top: -60, right: -60, filter: "blur(18px)" }} />
      <div className="ambient-blob" style={{ width: 420, height: 420, background: "radial-gradient(circle at 40% 40%, rgba(245,184,65,0.24), transparent 60%)", bottom: -120, left: -80, filter: "blur(24px)", "--drift-duration": "32s" } as React.CSSProperties} />
      <div className="ambient-blob" style={{ width: 260, height: 260, background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 70%)", top: 220, left: "40%", filter: "blur(26px)", "--drift-duration": "28s" } as React.CSSProperties} />

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
