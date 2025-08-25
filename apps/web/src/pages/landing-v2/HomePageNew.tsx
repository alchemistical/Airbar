import React, { useState } from "react";
import { TooltipProvider } from "../../components/ui/tooltip";
import { Header } from "../../components/landing/Header";
import { Hero } from "../../components/landing/Hero";
import { TrustRow } from "../../components/landing/TrustRow";
import { MetricsStrip } from "../../components/landing/MetricsStrip";
import { StepsHowItWorks } from "../../components/landing/StepsHowItWorks";
import { RoutesCarousel } from "../../components/landing/RoutesCarousel";
import { SafetyList } from "../../components/landing/SafetyList";
import { FAQAccordion } from "../../components/landing/FAQAccordion";
import { FinalCTA } from "../../components/landing/FinalCTA";

const HomePage: React.FC = () => {
  const [role, setRole] = useState<"sender" | "traveler">("sender");

  const handleQuoteSubmit = (form: {
    origin: string;
    destination: string;
    itemValue: number;
    size: string;
  }) => {
    // Track quote submission
    if (typeof window !== "undefined" && window.gtag) {
      const valueBucket =
        form.itemValue < 100
          ? "under-100"
          : form.itemValue < 500
            ? "100-500"
            : "over-500";
      window.gtag("event", "quote_submitted", {
        origin: form.origin,
        destination: form.destination,
        size: form.size,
        valueBucket,
      });
    }

    // Handle quote logic here
    console.log("Quote submitted:", form);
  };

  // Mock data - replace with real data
  const trustBadges = [
    { icon: "shield", label: "Escrow-Protected" },
    { icon: "check-circle", label: "KYC Verified Travelers" },
    { icon: "map-pin", label: "Live Tracking" },
    { icon: "refresh", label: "Money-Back on No-Show" },
  ];

  const howItWorksSteps = [
    { title: "Post", description: "List your trip or package", icon: "post" },
    { title: "Match", description: "Get matched automatically", icon: "match" },
    { title: "Pay", description: "Escrow holds funds safely", icon: "pay" },
    {
      title: "Deliver & Release",
      description: "Complete and get paid",
      icon: "deliver",
    },
  ];

  const popularRoutes = [
    {
      from: "Tehran",
      to: "Toronto",
      avgPrice: 45,
      courierPrice: 150,
      nextDates: ["Jan 15", "Jan 18", "Jan 22", "Jan 25"],
    },
    {
      from: "Dubai",
      to: "London",
      avgPrice: 65,
      courierPrice: 200,
      nextDates: ["Jan 14", "Jan 16", "Jan 20"],
    },
    {
      from: "Istanbul",
      to: "Berlin",
      avgPrice: 35,
      courierPrice: 120,
      nextDates: ["Jan 17", "Jan 19", "Jan 23", "Jan 26", "Jan 28"],
    },
  ];

  const safetyItems = [
    {
      title: "KYC on every traveler",
      description: "Government ID and background verification required",
      icon: "id",
    },
    {
      title: "Escrow until delivery",
      description: "Payments held securely until successful completion",
      icon: "lock",
    },
    {
      title: "Dispute support within 24h",
      description: "Dedicated support team for quick resolution",
      icon: "support",
    },
    {
      title: "ID-verified users only",
      description: "Every user verified with government identification",
      icon: "shield",
    },
  ];

  const faqSections = [
    {
      tab: "Sender" as const,
      items: [
        {
          q: "How does escrow work?",
          a: "Funds are held securely until delivery is confirmed by both parties. Money is only released when you confirm receipt of your package.",
        },
        {
          q: "What's required for KYC?",
          a: "Government ID verification and phone number confirmation. This typically takes 2-3 minutes to complete.",
        },
        {
          q: "What can't I ship?",
          a: "Prohibited items include liquids, electronics with lithium batteries, fragile items, and any restricted goods by airlines.",
        },
        {
          q: "How are prices set?",
          a: "Travelers set their own rates, typically 30-70% less than traditional courier services due to lower overhead.",
        },
        {
          q: "What if something goes wrong?",
          a: "Our 24/7 dispute resolution team provides full refund protection and investigates any delivery issues.",
        },
      ],
    },
    {
      tab: "Traveler" as const,
      items: [
        {
          q: "How much can I earn?",
          a: "Earnings vary by route and package size. Most travelers earn $20-100 per package, with popular routes earning more.",
        },
        {
          q: "What verification do I need?",
          a: "Government ID, phone verification, and flight confirmation. The process takes about 5 minutes.",
        },
        {
          q: "Am I insured if something happens?",
          a: "Yes, all packages are covered up to their declared value through our partner insurance providers.",
        },
        {
          q: "Can I choose which packages to carry?",
          a: "Absolutely. You have full control over package selection, size limits, and pickup/delivery preferences.",
        },
        {
          q: "How do I get paid?",
          a: "Payment is released to your account within 24 hours of confirmed delivery via your preferred payment method.",
        },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Track page view */}
        {typeof window !== "undefined" && window.gtag && (
          <script
            dangerouslySetInnerHTML={{
              __html: `gtag('event', 'view_home_hero', { role: '${role}' });`,
            }}
          />
        )}

        <Header role={role} onRoleChange={setRole} />

        <main>
          <Hero role={role} onQuoteSubmit={handleQuoteSubmit} />

          <TrustRow items={trustBadges} />

          <MetricsStrip users={12500} deliveries={8900} activeRoutes={450} />

          <div id="how-it-works">
            <StepsHowItWorks steps={howItWorksSteps} />
          </div>

          <div
            onMouseEnter={() => {
              if (typeof window !== "undefined" && window.gtag) {
                window.gtag("event", "view_routes_section");
              }
            }}
          >
            <RoutesCarousel routes={popularRoutes} />
          </div>

          <SafetyList items={safetyItems} />

          <FAQAccordion sections={faqSections} />

          <FinalCTA
            primaryCta={role === "sender" ? "Start Shipping" : "Post Your Trip"}
            secondaryCta="Learn More"
            bullets={["No signup fees", "Money-back guarantee", "24/7 support"]}
          />
        </main>

        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded inline-block mb-4">
                  Airbar
                </div>
                <p className="text-sm text-gray-400">
                  Secure P2P cross-border shipping marketplace connecting
                  senders with verified travelers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Prohibited Items
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Dispute Resolution
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 Airbar. All rights reserved.
              </p>
              <p className="text-sm text-gray-400">
                🔒 2.1M+ packages delivered safely
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default HomePage;
