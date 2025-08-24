import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Package, Globe, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

interface Stats {
  totalUsers: number;
  successfulDeliveries: number;
  totalCountries: number;
  averageSavings: number;
}

const defaultStats: Stats = {
  totalUsers: 25000,
  successfulDeliveries: 150000,
  totalCountries: 45,
  averageSavings: 68,
};

export default function StatsStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    successfulDeliveries: 0,
    totalCountries: 0,
    averageSavings: 0,
  });

  // Fetch stats from API
  const { data: stats = defaultStats } = useQuery<Stats>({
    queryKey: ["/api/public/stats"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (!isInView) return;

    // Animate numbers when in view
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalUsers: Math.floor(stats.totalUsers * progress),
        successfulDeliveries: Math.floor(stats.successfulDeliveries * progress),
        totalCountries: Math.floor(stats.totalCountries * progress),
        averageSavings: Math.floor(stats.averageSavings * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, stats]);

  const statItems = [
    {
      icon: Users,
      value: animatedStats.totalUsers.toLocaleString(),
      label: "Active Users",
      color: "text-blue-600",
    },
    {
      icon: Package,
      value: animatedStats.successfulDeliveries.toLocaleString(),
      label: "Packages Delivered",
      color: "text-green-600",
    },
    {
      icon: Globe,
      value: animatedStats.totalCountries,
      label: "Countries Served",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      value: `${animatedStats.averageSavings}%`,
      label: "Average Savings",
      color: "text-orange-600",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-blue-600 py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-white/80" />
                <div className="text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/80">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
