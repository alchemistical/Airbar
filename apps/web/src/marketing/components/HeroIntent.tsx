import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Play } from "lucide-react";
import { AnimatedAnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { getStoredIntent, setStoredIntent, type UserIntent } from "@/lib/intent";
import tokens from "../../../content/tokens.json";

export default function HeroIntent() {
  const [, navigate] = useLocation();
  const [intent, setIntent] = useState<UserIntent>(null);
  const [miniEstimatorOpen, setMiniEstimatorOpen] = useState(false);
  const [miniEstimatorData, setMiniEstimatorData] = useState({
    from: "",
    to: "",
    weight: ""
  });

  useEffect(() => {
    const storedIntent = getStoredIntent();
    if (storedIntent) {
      setIntent(storedIntent);
    }
  }, []);

  const handleIntentChange = (newIntent: UserIntent) => {
    setIntent(newIntent);
    setStoredIntent(newIntent);
    track("hp_intent_change", { intent: newIntent || "none" });
  };

  const handlePrimaryCTA = () => {
    if (intent === "send") {
      track("hp_hero_send_click");
      navigate("/send-package?intent=send");
    } else if (intent === "travel") {
      track("hp_hero_travel_click");
      navigate("/add-trip?intent=travel");
    }
  };

  const handleMiniEstimatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track("hp_hero_estimator_submit", {
      from: miniEstimatorData.from,
      to: miniEstimatorData.to,
      weight: miniEstimatorData.weight ? parseFloat(miniEstimatorData.weight) : undefined
    });
    // Navigate to estimator section with prefilled data
    const params = new URLSearchParams(miniEstimatorData);
    window.location.hash = `#estimator?${params.toString()}`;
  };

  const subtext = intent === "send" 
    ? tokens.hero.sub_send 
    : intent === "travel" 
    ? tokens.hero.sub_travel 
    : "Choose your path: Send packages affordably or earn money while traveling.";

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="container mx-auto px-4 max-w-[1280px] relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Intent Toggle */}
          <div className="inline-flex bg-white rounded-full shadow-sm border border-gray-200 p-1 mb-8">
            <button
              onClick={() => handleIntentChange("send")}
              className={cn(
                "px-8 py-3 rounded-full font-medium transition-all duration-200",
                intent === "send"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-pressed={intent === "send"}
            >
              I want to send a package
            </button>
            <button
              onClick={() => handleIntentChange("travel")}
              className={cn(
                "px-8 py-3 rounded-full font-medium transition-all duration-200",
                intent === "travel"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
              aria-pressed={intent === "travel"}
            >
              I'm traveling & want to earn
            </button>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {tokens.hero.headline}
          </h1>

          {/* Dynamic Subtext */}
          <p className="text-xl text-gray-600 mb-10 transition-all duration-300">
            {subtext}
          </p>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {intent && (
              <AnimatedButton
                size="lg"
                onClick={handlePrimaryCTA}
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {intent === "send" ? tokens.cta.send : tokens.cta.travel}
              </AnimatedButton>
            )}
            
            <button
              className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center gap-2 transition-colors"
              onClick={() => track("hp_hero_watch_demo")}
            >
              <Play className="h-5 w-5" />
              {tokens.cta.watch_demo}
            </button>
          </div>

          {/* Mini Estimator */}
          {intent === "send" && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setMiniEstimatorOpen(!miniEstimatorOpen)}
                className={cn(
                  "w-full bg-white border border-gray-200 rounded-lg px-6 py-4 text-left hover:border-gray-300 transition-all duration-200",
                  miniEstimatorOpen && "ring-2 ring-primary ring-opacity-20"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    {miniEstimatorData.from || miniEstimatorData.to || miniEstimatorData.weight
                      ? `${miniEstimatorData.from || "From"} → ${miniEstimatorData.to || "To"} • ${miniEstimatorData.weight || "Weight"}`
                      : "Quick estimate: From → To • Weight"}
                  </span>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-200",
                    miniEstimatorOpen && "rotate-180"
                  )} />
                </div>
              </button>

              {miniEstimatorOpen && (
                <form onSubmit={handleMiniEstimatorSubmit} className="mt-4 bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      placeholder="From city"
                      value={miniEstimatorData.from}
                      onChange={(e) => setMiniEstimatorData(prev => ({ ...prev, from: e.target.value }))}
                    />
                    <Input
                      placeholder="To city"
                      value={miniEstimatorData.to}
                      onChange={(e) => setMiniEstimatorData(prev => ({ ...prev, to: e.target.value }))}
                    />
                    <Input
                      placeholder="Weight (kg)"
                      value={miniEstimatorData.weight}
                      onChange={(e) => setMiniEstimatorData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <AnimatedButton type="submit" className="w-full mt-4">
                    Get Estimate
                  </AnimatedButton>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}