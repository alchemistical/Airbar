import { useEffect, useRef, useState } from "react";
import { Shield, Globe, Package, Users } from "lucide-react";

export default function StatsStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Globe,
      value: "150+",
      label: "Countries",
      color: "text-primary",
    },
    {
      icon: Users,
      value: "2M+",
      label: "Users",
      color: "text-primary",
    },
    {
      icon: Package,
      value: "50K+",
      label: "Deliveries",
      color: "text-primary",
    },
    {
      icon: Shield,
      value: "Escrow",
      label: "Protected",
      color: "text-green-600",
    },
  ];

  return (
    <section ref={ref} className="py-12 bg-white border-y border-gray-200">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}