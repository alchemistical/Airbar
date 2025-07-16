import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroIntent from "./components/HeroIntent";
import TrustStrip from "./components/TrustStrip";
import PersonaTabs from "./components/PersonaTabs";
import HowItWorksV2 from "./components/HowItWorksV2";
import EstimatorV2 from "./components/EstimatorV2";
import SafetyGridV2 from "./components/SafetyGridV2";
import RoutesGridV2 from "./components/RoutesGridV2";
import TestimonialsV2 from "./components/TestimonialsV2";
import BusinessCTAV2 from "./components/BusinessCTAV2";
import EndConversionV2 from "./components/EndConversionV2";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="w-full">
        <HeroIntent />
        <TrustStrip />
        <PersonaTabs />
        <HowItWorksV2 />
        <EstimatorV2 />
        <SafetyGridV2 />
        <RoutesGridV2 />
        <TestimonialsV2 />
        <BusinessCTAV2 />
        <EndConversionV2 />
      </main>
      <Footer />
    </div>
  );
}