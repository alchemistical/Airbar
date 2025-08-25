import { useState } from "react";
import { Link } from "wouter";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ArrowRight, Package, Plane, Lock, ShieldCheck, Camera, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [activeIntent, setActiveIntent] = useState<"send" | "earn">("send");

  const handleCTAClick = (type: "send" | "earn") => {
    // Store intent in localStorage
    localStorage.setItem('userIntent', type === "earn" ? "travel" : "send");
    localStorage.setItem('intentSource', 'homepage_hero');
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(`hp_${type}_cta_click`, {
        source: 'homepage_hero',
        intent: type === "earn" ? "travel" : "send"
      });
    }
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop"
          alt="Global travel and shipping"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30"></div>
      </div>

      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl relative z-10">
        <div className="max-w-3xl">
          {/* Intent Toggle Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveIntent("send")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                activeIntent === "send" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              I need to send
            </button>
            <button
              onClick={() => setActiveIntent("earn")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                activeIntent === "earn" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              I want to earn
            </button>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Send Globally.
            <br />
            <span className="text-primary">Earn While You Travel.</span>
          </h1>

          {/* Dynamic Subheadline with bullets */}
          <div className="mb-8">
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Verified travelers. Escrow protected. {activeIntent === "send" ? "Save up to 70% vs couriers." : "Earn up to $300 per trip."}
            </p>
            
            {/* Intent-specific bullets */}
            <ul className="space-y-2 text-gray-600">
              {activeIntent === "send" ? (
                <>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Funds held in escrow until delivery confirmed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    <span>Photo proof at pickup & delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Real-time tracking throughout journey</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span>Turn empty luggage space into cash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span>Get paid securely through our platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>Build your reputation with every delivery</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Dual CTAs with clear separation */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link href="/send-package?intent=send&src=homepage_hero" onClick={() => handleCTAClick("send")}>
              <AnimatedButton size="lg" className="w-full sm:w-auto group text-base">
                <Package className="h-5 w-5 mr-2" />
                Send a Package
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </AnimatedButton>
            </Link>
            <Link href="/add-trip?intent=travel&src=homepage_hero" onClick={() => handleCTAClick("earn")}>
              <AnimatedButton size="lg" variant="outline" className="w-full sm:w-auto group text-base">
                <Plane className="h-5 w-5 mr-2" />
                I'm Traveling
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </AnimatedButton>
            </Link>
          </div>

          {/* Inline safety link */}
          <div className="text-sm text-gray-600">
            <Link href="/safety#prohibited-items" className="hover:text-primary underline">
              What can I send?
            </Link>
            {" · "}
            <Link href="/how-it-works" className="hover:text-primary underline">
              How does it work?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}