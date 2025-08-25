import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Globe,
  Clock,
  Package,
  Plane,
  Sparkles,
} from "lucide-react";
import { AnimatedButton } from "../ui/animated-button";
import { AnimatedCard } from "../ui/animated-card";
import { Badge } from "../ui/badge";
import QuickQuoteWidget from "./QuickQuoteWidget";

type UserRole = "sender" | "traveler";

export default function HeroInteractive() {
  const [role, setRole] = useState<UserRole>(() => {
    // Get role from localStorage or default to sender
    const saved = localStorage.getItem("airbar-user-role");
    return (saved as UserRole) || "sender";
  });

  useEffect(() => {
    // Save role selection to localStorage
    localStorage.setItem("airbar-user-role", role);
  }, [role]);

  const content = {
    sender: {
      headline:
        "Ship Anywhere with Travelers. Save 70% on International Shipping.",
      subheadline:
        "Send or deliver packages globally with trusted travelers. Fast. Secure. Affordable.",
      cta: "Start Shipping",
      ctaLink: "/send-package",
      features: [
        { icon: Lock, text: "Escrow Protected" },
        { icon: ShieldCheck, text: "KYC Verified Travelers" },
        { icon: MapPin, text: "Live Tracking" },
      ],
    },
    traveler: {
      headline: "Earn Money on Trips You Already Take.",
      subheadline:
        "Turn your unused luggage space into extra income. Safe, simple, and rewarding.",
      cta: "Post Your Trip",
      ctaLink: "/add-trip",
      features: [
        { icon: TrendingUp, text: "Earn $25-150 per trip" },
        { icon: Globe, text: "Travel anywhere" },
        { icon: Clock, text: "Quick & easy process" },
      ],
    },
  };

  const currentContent = content[role];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:px-8">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <Badge variant="premium" className="text-sm px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 50K+ Global Users
          </Badge>
        </motion.div>

        {/* Enhanced Segmented Control */}
        <div className="mb-12 flex justify-center">
          <AnimatedCard
            variant="elevated"
            className="p-2 bg-white/90 backdrop-blur-sm border-2"
          >
            <div className="flex rounded-xl">
              <AnimatedButton
                onClick={() => setRole("sender")}
                variant={role === "sender" ? "premium" : "ghost"}
                className={`flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all duration-300 ${
                  role === "sender" ? "shadow-lg" : ""
                }`}
              >
                <Package className="h-5 w-5" />
                Send a Package
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setRole("traveler")}
                variant={role === "traveler" ? "success" : "ghost"}
                className={`flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all duration-300 ${
                  role === "traveler" ? "shadow-lg" : ""
                }`}
              >
                <Plane className="h-5 w-5" />
                Earn While Traveling
              </AnimatedButton>
            </div>
          </AnimatedCard>
        </div>

        {/* Premium Headline with animation */}
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1
            className="mb-6 text-5xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent sm:text-6xl md:text-7xl leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {currentContent.headline}
          </motion.h1>
          <motion.p
            className="mx-auto mb-12 max-w-3xl text-xl text-gray-700 sm:text-2xl font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {currentContent.subheadline}
          </motion.p>

          {/* Quick Quote Widget - Enhanced */}
          <motion.div
            className="mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <QuickQuoteWidget />
          </motion.div>
        </motion.div>

        {/* Premium Trust Band */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {currentContent.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group"
            >
              <AnimatedCard
                variant="interactive"
                className="px-6 py-4 bg-white/80 backdrop-blur-sm border-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      role === "sender"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                    } group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-gray-800 text-base">
                    {feature.text}
                  </span>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
