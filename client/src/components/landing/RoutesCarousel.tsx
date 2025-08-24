import React from "react";

interface Route {
  from: string;
  to: string;
  avgPrice: number;
  courierPrice: number;
  nextDates: string[];
}

interface RoutesCarouselProps {
  routes: Route[];
}

export const RoutesCarousel: React.FC<RoutesCarouselProps> = ({ routes }) => {
  const calculateSavings = (avgPrice: number, courierPrice: number): number => {
    return Math.round(((courierPrice - avgPrice) / courierPrice) * 100);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          High-demand corridors—updated daily
        </h2>
        <p className="text-center text-gray-600 mb-12">
          See pricing and availability for popular routes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                // Track route click
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "click_route_card", {
                    from: route.from,
                    to: route.to,
                  });
                }
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {route.from} → {route.to}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${route.avgPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${route.courierPrice}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {calculateSavings(route.avgPrice, route.courierPrice)}% off
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-2">Next travelers:</p>
                <div className="space-y-1">
                  {route.nextDates.slice(0, 3).map((date, dateIndex) => (
                    <div key={dateIndex} className="text-sm text-gray-900">
                      {date}
                    </div>
                  ))}
                  {route.nextDates.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{route.nextDates.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
