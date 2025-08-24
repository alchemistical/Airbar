import React from "react";
import { useLocation } from "wouter";

interface FinalCTAProps {
  primaryCta: string;
  secondaryCta: string;
  bullets: string[];
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  primaryCta,
  secondaryCta,
  bullets,
}) => {
  const [, navigate] = useLocation();

  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to start shipping smarter?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands who trust Airbar for secure, affordable shipping
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "click_cta_primary", {
                  location: "final",
                });
              }
              // Navigate based on CTA text
              if (primaryCta.includes("Start Shipping")) {
                navigate("/send-package");
              } else if (primaryCta.includes("Post Your Trip")) {
                navigate("/dashboard/traveler/trips/addtrip");
              } else {
                navigate("/dashboard");
              }
            }}
          >
            {primaryCta}
          </button>
          <button
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200"
            onClick={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "click_cta_secondary", {
                  location: "final",
                });
              }
              navigate("/dashboard");
            }}
          >
            {secondaryCta}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-100">
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="flex items-center justify-center space-x-2"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
