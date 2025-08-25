import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Package, Plane, Check } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { getStoredIntent, setStoredIntent, type UserIntent } from "@/lib/intent";

const personaData = {
  send: {
    icon: Package,
    title: "For Senders",
    benefits: [
      "Save up to 70% vs traditional couriers",
      "Full escrow protection until delivery",
      "Real-time tracking with photo proof"
    ],
    cta: "Send Your First Package",
    route: "/send-package?intent=send"
  },
  travel: {
    icon: Plane,
    title: "For Travelers",
    benefits: [
      "Earn $50-300 per trip from unused space",
      "Quick KYC verification process",
      "Choose packages that fit your route"
    ],
    cta: "Start Earning",
    route: "/add-trip?intent=travel"
  }
};

export default function PersonaTabs() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"send" | "travel">("send");

  useEffect(() => {
    const storedIntent = getStoredIntent();
    if (storedIntent === "send" || storedIntent === "travel") {
      setActiveTab(storedIntent);
    }
  }, []);

  const handleTabChange = (tab: "send" | "travel") => {
    setActiveTab(tab);
    setStoredIntent(tab);
  };

  const handleCTA = () => {
    track("hp_persona_cta_click", { intent: activeTab });
    navigate(personaData[activeTab].route);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="max-w-3xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            {(["send", "travel"] as const).map((tab) => {
              const Icon = personaData[tab].icon;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 px-6 py-4 border-b-2 transition-all duration-200",
                    activeTab === tab
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  )}
                  aria-selected={activeTab === tab}
                  role="tab"
                >
                  <Icon className="h-5 w-5" />
                  {personaData[tab].title}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="space-y-4 mb-8">
              {personaData[activeTab].benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>

            <AnimatedButton
              size="lg"
              onClick={handleCTA}
              className="w-full sm:w-auto"
            >
              {personaData[activeTab].cta}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  );
}