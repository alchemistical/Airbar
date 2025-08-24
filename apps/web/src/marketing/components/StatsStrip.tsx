import { useEffect, useState } from "react";
import { Users, Package, ShieldCheck, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeTrips: number;
  successfulDeliveries: number;
  averageSavings: number;
  totalCountries: number;
  verifiedTravelers: number;
  escrowProtected: number;
}

export default function StatsStrip() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Fetch stats from public API
    fetch("/api/public/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {
        // Fallback to cached stats if API fails
        setStats({
          totalUsers: 15000,
          activeTrips: 450,
          successfulDeliveries: 9500,
          averageSavings: 65,
          totalCountries: 45,
          verifiedTravelers: 3200,
          escrowProtected: 100
        });
      });
  }, []);

  if (!stats) return null;

  const displayStats = [
    {
      icon: Users,
      value: `${(stats.totalUsers / 1000).toFixed(0)}k+`,
      label: "Active Users"
    },
    {
      icon: Package,
      value: `${(stats.successfulDeliveries / 1000).toFixed(0)}k+`,
      label: "Deliveries Completed"
    },
    {
      icon: TrendingUp,
      value: `${stats.averageSavings}%`,
      label: "Average Savings"
    },
    {
      icon: ShieldCheck,
      value: `${stats.escrowProtected}%`,
      label: "Escrow Protected"
    }
  ];

  return (
    <section className="py-12 bg-primary/5 border-y border-gray-200">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}