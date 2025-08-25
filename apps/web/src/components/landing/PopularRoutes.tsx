import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const popularRoutes = [
  {
    from: "New York",
    to: "London",
    flag1: "🇺🇸",
    flag2: "🇬🇧",
    packages: 1250,
    avgSavings: "$145",
    trending: true,
  },
  {
    from: "Los Angeles",
    to: "Tokyo",
    flag1: "🇺🇸",
    flag2: "🇯🇵",
    packages: 890,
    avgSavings: "$210",
    trending: false,
  },
  {
    from: "Miami",
    to: "Barcelona",
    flag1: "🇺🇸",
    flag2: "🇪🇸",
    packages: 670,
    avgSavings: "$125",
    trending: true,
  },
  {
    from: "San Francisco",
    to: "Paris",
    flag1: "🇺🇸",
    flag2: "🇫🇷",
    packages: 580,
    avgSavings: "$160",
    trending: false,
  },
  {
    from: "Toronto",
    to: "Dubai",
    flag1: "🇨🇦",
    flag2: "🇦🇪",
    packages: 450,
    avgSavings: "$190",
    trending: true,
  },
  {
    from: "London",
    to: "New York",
    flag1: "🇬🇧",
    flag2: "🇺🇸",
    packages: 1100,
    avgSavings: "$140",
    trending: false,
  },
];

export default function PopularRoutes() {
  const handleRouteClick = (route: (typeof popularRoutes)[0]) => {
    // Check if user has intent set
    const intent = localStorage.getItem("airbar-user-role");
    const query = new URLSearchParams({
      from: route.from,
      to: route.to,
    });

    if (intent === "sender") {
      window.location.href = `/send-package?${query}`;
    } else if (intent === "traveler") {
      window.location.href = `/add-trip?${query}`;
    } else {
      // Show persona modal if intent not set
      window.location.href = `/?showPersonaModal=true&${query}`;
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Popular Routes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            High-demand routes with frequent travelers
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleRouteClick(route)}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              {route.trending && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  <TrendingUp size={12} />
                  Trending
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{route.flag1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{route.from}</p>
                    <p className="text-xs text-gray-500">From</p>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{route.to}</p>
                    <p className="text-xs text-gray-500">To</p>
                  </div>
                  <span className="text-2xl">{route.flag2}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {route.packages.toLocaleString()}
                    </span>{" "}
                    packages
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Avg savings</p>
                  <p className="font-semibold text-green-600">
                    {route.avgSavings}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/browse-trips"
            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            View all routes
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
