import HeaderV2 from "../../components/landing/HeaderV2";
import HeroInteractive from "../../components/landing/HeroInteractive";
import TrustBand from "../../components/landing/TrustBand";
import HowItWorks from "../../components/landing/HowItWorks";
import StatsStrip from "../../components/landing/StatsStrip";
import ReviewCarousel from "../../components/landing/ReviewCarousel";
import PopularRoutes from "../../components/landing/PopularRoutes";
import FAQ from "../../components/landing/FAQ";
import CTASection from "../../components/landing/CTASection";
import FooterV2 from "../../components/landing/FooterV2";
import StickyCTA from "../../components/landing/StickyCTA";

export default function LandingV2() {
  // Landing page with interactive hero
  return (
    <>
      <HeaderV2 />
      <main>
        <div id="hero-section">
          <HeroInteractive />
        </div>
        <TrustBand />
        <HowItWorks />
        <StatsStrip />
        <ReviewCarousel />
        <PopularRoutes />
        <FAQ />
        <CTASection />
      </main>
      <FooterV2 />
      <StickyCTA />
    </>
  );
}
