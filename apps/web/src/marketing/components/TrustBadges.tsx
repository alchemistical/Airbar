import { Link } from "wouter";
import { ShieldCheck, Lock, MapPin, Camera, Star } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      label: "KYC Verified",
      description: "All travelers verified",
      href: "/dashboard/profile?section=kyc",
      publicHref: "/safety#kyc",
    },
    {
      icon: Lock,
      label: "Escrow Payments",
      description: "Funds held securely",
      href: "/dashboard/wallet?tab=escrow",
      publicHref: "/safety#escrow",
    },
    {
      icon: MapPin,
      label: "Live Tracking",
      description: "Real-time updates",
      href: "/dashboard/tracking",
      publicHref: "/safety#tracking",
    },
    {
      icon: Camera,
      label: "Photo Proof",
      description: "Pickup & delivery",
      href: "/dashboard/support?tab=disputes",
      publicHref: "/safety#photo-proof",
    },
    {
      icon: Star,
      label: "Community Reviews",
      description: "4.8/5 avg rating",
      href: "/dashboard/profile?section=reviews",
      publicHref: "/safety#reviews",
    },
  ];

  const handleBadgeClick = (badge: typeof badges[0]) => {
    // Check if user is authenticated (simple check for user data in localStorage)
    const isAuthenticated = localStorage.getItem('userId') || localStorage.getItem('token');
    
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('hp_trust_badge_click', {
        badge: badge.label,
        destination: isAuthenticated ? 'dashboard' : 'public'
      });
    }
    
    return isAuthenticated ? badge.href : badge.publicHref;
  };

  return (
    <section className="py-8 md:py-12 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <Link key={index} href={handleBadgeClick(badge)}>
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <div className="mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <badge.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{badge.label}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}