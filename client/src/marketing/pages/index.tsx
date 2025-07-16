import { Link } from "wouter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import TrustBadges from "../components/TrustBadges";
import StatsStrip from "../components/StatsStrip";
import AudienceCards from "../components/AudienceCards";
import HowItWorksTabs from "../components/HowItWorksTabs";
import PricingEstimator from "../components/PricingEstimator";
import SafetyPillars from "../components/SafetyPillars";
import RoutesCarousel from "../components/RoutesCarousel";
import Testimonials from "../components/Testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

export default function HomePage() {
  const handleBusinessLeadSubmit = () => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('hp_business_lead_submit');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Full Background */}
        <Hero />
        
        {/* Trust Badges Strip - Immediately below hero */}
        <TrustBadges />
        
        {/* Stats Strip - Platform metrics */}
        <StatsStrip />
        
        {/* Persona Switch Cards - Collapsed with tabs */}
        <section className="py-24 md:py-32 bg-gray-100">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <AudienceCards />
          </div>
        </section>
        
        {/* How It Works - 3 illustrated steps */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <HowItWorksTabs />
          </div>
        </section>
        
        {/* Quick Price Estimate - Moved up */}
        <section className="py-24 md:py-32 bg-gray-100">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Quick Price Estimate</h2>
            <PricingEstimator />
          </div>
        </section>
        
        {/* Safety & Trust Grid - Full-width cards */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Safety & Trust</h2>
            <SafetyPillars />
          </div>
        </section>
        
        {/* Popular Routes */}
        <section className="py-24 md:py-32 bg-gray-100">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Routes</h2>
            <RoutesCarousel />
          </div>
        </section>
        
        {/* Testimonials with enhanced social proof */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Community Says</h2>
            <Testimonials />
          </div>
        </section>
        
        {/* Business CTA Band */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-green-600 text-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <Briefcase className="h-8 w-8" />
                  <h2 className="text-2xl md:text-3xl font-bold">For Businesses</h2>
                </div>
                <p className="text-lg opacity-90">High volume shipping? Recurring packages? Get custom rates.</p>
              </div>
              <Link href="/business">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={handleBusinessLeadSubmit}
                >
                  Talk to Sales <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-24 md:py-32 bg-gray-100">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-[800px] text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Save on Shipping?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands who are already saving up to 70% on international deliveries
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/send-package?intent=send&src=homepage_final_cta">
                <Button 
                  size="lg" 
                  className="min-w-[200px]"
                  onClick={() => {
                    localStorage.setItem('userIntent', 'send');
                    localStorage.setItem('intentSource', 'homepage_final_cta');
                  }}
                >
                  Send a Package
                </Button>
              </Link>
              <Link href="/dashboard/traveler/trips/addtrip?intent=travel&src=homepage_final_cta">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="min-w-[200px]"
                  onClick={() => {
                    localStorage.setItem('userIntent', 'travel');
                    localStorage.setItem('intentSource', 'homepage_final_cta');
                  }}
                >
                  List Your Trip
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}