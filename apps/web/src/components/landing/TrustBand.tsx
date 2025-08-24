import { Shield, Users, Award, Clock } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const trustItems = [
  {
    icon: Shield,
    title: "Secure Escrow",
    description: "Payments held safely until delivery is confirmed",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    link: "/safety",
  },
  {
    icon: Users,
    title: "Verified Users",
    description: "All users go through KYC verification",
    color: "text-green-600",
    bgColor: "bg-green-100",
    link: "/safety#verification",
  },
  {
    icon: Award,
    title: "4.8★ Rating",
    description: "Trusted by thousands of happy users",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    link: "/dashboard/support#reviews",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Get help whenever you need it",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    link: "/dashboard/support",
  },
];

export default function TrustBand() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative rounded-lg bg-white p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1">
                  {/* Icon with animated background */}
                  <motion.div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      isHovered ? item.bgColor : "bg-gray-100"
                    }`}
                    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <Icon className={`h-6 w-6 ${item.color}`} strokeWidth={2} />
                  </motion.div>

                  <h3 className="mb-1 font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  {/* Animated tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                    }
                    className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white pointer-events-none`}
                  >
                    {item.description}
                    <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </motion.div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
