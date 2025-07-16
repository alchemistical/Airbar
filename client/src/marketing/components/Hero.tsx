import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Plane } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ship Globally.
              <br />
              <span className="text-primary">Earn While You Travel.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with verified travelers to deliver packages safely and affordably. Save up to 70% on international shipping or earn up to $300 per trip.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/send-package">
                <a>
                  <Button size="lg" className="w-full sm:w-auto group">
                    <Package className="h-5 w-5 mr-2" />
                    Send a Package
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </Link>
              <Link href="/dashboard/traveler/trips/addtrip">
                <a>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                    <Plane className="h-5 w-5 mr-2" />
                    I'm Traveling
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>KYC Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop"
                alt="Traveler at airport with luggage"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-600">Deliveries Completed</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-sm text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}