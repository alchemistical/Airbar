import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { track } from "@/lib/analytics";
import { getStoredIntent } from "@/lib/intent";

interface Route {
  id: string;
  from: string;
  fromCountry: string;
  to: string;
  toCountry: string;
  availableTrips: number;
  avgRewardPerKg: number;
  trending?: boolean;
}

const mockRoutes: Route[] = [
  {
    id: "nyc-lon",
    from: "New York",
    fromCountry: "US",
    to: "London",
    toCountry: "GB",
    availableTrips: 24,
    avgRewardPerKg: 18,
    trending: true
  },
  {
    id: "lax-tok",
    from: "Los Angeles",
    fromCountry: "US",
    to: "Tokyo",
    toCountry: "JP",
    availableTrips: 15,
    avgRewardPerKg: 22
  },
  {
    id: "par-dub",
    from: "Paris",
    fromCountry: "FR",
    to: "Dubai",
    toCountry: "AE",
    availableTrips: 19,
    avgRewardPerKg: 20
  },
  {
    id: "sin-syd",
    from: "Singapore",
    fromCountry: "SG",
    to: "Sydney",
    toCountry: "AU",
    availableTrips: 12,
    avgRewardPerKg: 16
  },
  {
    id: "mia-mex",
    from: "Miami",
    fromCountry: "US",
    to: "Mexico City",
    toCountry: "MX",
    availableTrips: 31,
    avgRewardPerKg: 14,
    trending: true
  },
  {
    id: "lon-bcn",
    from: "London",
    fromCountry: "GB",
    to: "Barcelona",
    toCountry: "ES",
    availableTrips: 28,
    avgRewardPerKg: 12
  }
];

export default function RoutesGridV2() {
  const [, navigate] = useLocation();
  const [intent, setIntent] = useState<"send" | "travel" | null>(null);

  useEffect(() => {
    const storedIntent = getStoredIntent();
    if (storedIntent === "send" || storedIntent === "travel") {
      setIntent(storedIntent);
    }
  }, []);

  const handleRouteClick = (route: Route) => {
    track("hp_route_card_click", {
      route: route.id,
      intent: intent || "unknown"
    });

    if (intent === "send") {
      navigate(`/browse-trips?from=${route.from}&to=${route.to}`);
    } else if (intent === "travel") {
      navigate(`/dashboard/traveler/trips/addtrip?from=${route.from}&to=${route.to}`);
    } else {
      // Show persona modal if no intent set
      navigate(`/browse-trips?from=${route.from}&to=${route.to}`);
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Routes
          </h2>
          <p className="text-xl text-gray-600">
            High-demand routes with travelers ready to carry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRoutes.map((route) => (
            <Card
              key={route.id}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleRouteClick(route)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCountryFlag(route.fromCountry)}</span>
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-2xl">{getCountryFlag(route.toCountry)}</span>
                </div>
                {route.trending && (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">Trending</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {route.from} → {route.to}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Available trips
                  </span>
                  <span className="font-semibold text-gray-900">
                    {route.availableTrips} in next 7 days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg reward/kg</span>
                  <span className="font-semibold text-green-600">
                    ${route.avgRewardPerKg}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
              >
                {intent === "send" ? "View Travelers" : intent === "travel" ? "List Trip" : "Explore Route"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}