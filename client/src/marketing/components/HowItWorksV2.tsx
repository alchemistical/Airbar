import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { getStoredIntent } from "@/lib/intent";
import { Package, CreditCard, CheckCircle } from "lucide-react";

const steps = {
  send: [
    {
      icon: Package,
      title: "Post Your Package",
      description: "Enter pickup and delivery details with your package info"
    },
    {
      icon: CreditCard,
      title: "Match & Pay Securely",
      description: "Choose a verified traveler and pay into escrow"
    },
    {
      icon: CheckCircle,
      title: "Track & Confirm",
      description: "Get updates and release payment after delivery"
    }
  ],
  travel: [
    {
      icon: Package,
      title: "List Your Trip",
      description: "Add your travel dates and available luggage space"
    },
    {
      icon: CreditCard,
      title: "Accept Matches",
      description: "Review package requests and accept those that fit"
    },
    {
      icon: CheckCircle,
      title: "Deliver & Get Paid",
      description: "Complete delivery and receive payment from escrow"
    }
  ]
};

export default function HowItWorksV2() {
  const [, navigate] = useLocation();
  const [activeIntent, setActiveIntent] = useState<"send" | "travel">("send");

  useEffect(() => {
    const storedIntent = getStoredIntent();
    if (storedIntent === "send" || storedIntent === "travel") {
      setActiveIntent(storedIntent);
    }
  }, []);

  const handleCTA = () => {
    track("hp_hiw_cta_click", { intent: activeIntent });
    const route = activeIntent === "send" 
      ? "/send-package?intent=send" 
      : "/dashboard/traveler/trips/addtrip?intent=travel";
    navigate(route);
  };

  const activeSteps = steps[activeIntent];
  const statChip = activeIntent === "send" 
    ? "Average delivery savings: 65%" 
    : "Average earnings: $125/trip";

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {statChip}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {activeSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < activeSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-300">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-300 rotate-45" />
                  </div>
                )}

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-md mb-4 relative">
                    <Icon className="h-10 w-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleCTA}>
            {activeIntent === "send" ? "Start Sending" : "Start Earning"}
          </Button>
        </div>
      </div>
    </section>
  );
}