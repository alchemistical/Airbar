import { Shield, UserCheck, MapPin, Camera, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import tokens from "../../../content/tokens.json";

const trustBadges = [
  {
    id: "escrow",
    icon: Shield,
    label: tokens.features.escrowShort,
    description: tokens.trust.escrow,
    color: "text-green-600"
  },
  {
    id: "kyc",
    icon: UserCheck,
    label: tokens.features.kycShort,
    description: tokens.trust.kyc,
    color: "text-blue-600"
  },
  {
    id: "tracking",
    icon: MapPin,
    label: tokens.features.trackingShort,
    description: tokens.trust.tracking,
    color: "text-purple-600"
  },
  {
    id: "photo",
    icon: Camera,
    label: tokens.features.photoProofShort,
    description: tokens.trust.photo,
    color: "text-orange-600"
  },
  {
    id: "reviews",
    icon: Star,
    label: tokens.labels.reviews,
    description: tokens.trust.reviews,
    color: "text-yellow-600"
  }
];

export default function TrustStrip() {
  const handleBadgeClick = (badgeId: string) => {
    track("hp_trust_badge_click", { badge: badgeId });
    // Scroll to safety section
    const safetySection = document.getElementById("safety-section");
    safetySection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge.id)}
                className="group flex flex-col items-center text-center p-4 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200",
                  badge.color
                )}>
                  <Icon className="h-6 w-6" />
                  <div className="absolute -top-1 -right-1">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{badge.label}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{badge.description}</p>
                <span className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}