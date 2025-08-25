import React from "react";
import { useLocation } from "wouter";
import { InstantQuoteMini } from "./InstantQuoteMini";

interface HeroProps {
  role: "sender" | "traveler";
  onQuoteSubmit: (form: {
    origin: string;
    destination: string;
    itemValue: number;
    size: string;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ role, onQuoteSubmit }) => {
  const [, navigate] = useLocation();
  const content = {
    sender: {
      headline: "Ship anywhere, with verified travelers.",
      subhead:
        "Secure, fast, and up to 70% cheaper than couriers. Funds held in escrow until delivery.",
      primaryCta: "Start Shipping",
      secondaryCta: "Compare Prices Instantly",
    },
    traveler: {
      headline: "Earn from your extra luggage space.",
      subhead:
        "Secure, fast, and up to 70% cheaper than couriers. Funds held in escrow until delivery.",
      primaryCta: "Post Your Trip",
      secondaryCta: "Compare Prices Instantly",
    },
  };

  const currentContent = content[role];

  return (
    <section className="bg-white py-16 lg:py-24" id="hero-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {currentContent.headline}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {currentContent.subhead}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "click_cta_primary", {
                      role,
                      location: "hero",
                    });
                  }
                  // Navigate based on role
                  if (role === "sender") {
                    navigate("/send-package");
                  } else {
                    navigate("/add-trip");
                  }
                }}
              >
                {currentContent.primaryCta}
              </button>
              <button
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "click_cta_secondary", {
                      role,
                      location: "hero",
                    });
                  }
                  // Navigate to quote/pricing page
                  navigate("/dashboard");
                }}
              >
                {currentContent.secondaryCta}
              </button>
            </div>
          </div>

          {/* Right Column - Quote Widget */}
          <div className="lg:pl-8">
            <InstantQuoteMini onSubmit={onQuoteSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
};
