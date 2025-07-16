import { Link } from "wouter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import StatsStrip from "../components/StatsStrip";
import AudienceCards from "../components/AudienceCards";
import HowItWorksTabs from "../components/HowItWorksTabs";
import PricingEstimator from "../components/PricingEstimator";
import SafetyPillars from "../components/SafetyPillars";
import RoutesCarousel from "../components/RoutesCarousel";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Credibility Stats */}
        <StatsStrip />
        
        {/* Audience Split Cards */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <AudienceCards />
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
            <HowItWorksTabs />
          </div>
        </section>
        
        {/* Pricing & Savings */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Save on International Shipping</h2>
            <PricingEstimator />
          </div>
        </section>
        
        {/* Safety & Trust */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Your Safety is Our Priority</h2>
            <SafetyPillars />
          </div>
        </section>
        
        {/* Featured Routes */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Popular Routes</h2>
            <RoutesCarousel />
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Community Says</h2>
            <Testimonials />
          </div>
        </section>
        
        {/* Business CTA */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-primary to-primary-hover text-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">High Volume or Recurring Shipments?</h2>
            <p className="text-lg mb-8 opacity-90">Get a tailored solution for your business needs</p>
            <Link href="/business">
              <a className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-150">
                Talk to Sales
              </a>
            </Link>
          </div>
        </section>
        
        {/* Final CTA */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}