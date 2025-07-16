import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, MapPin, Calendar, DollarSign } from "lucide-react";

export default function RoutesCarousel() {
  const [routes, setRoutes] = useState([
    {
      from: "New York",
      to: "London",
      avgReward: 85,
      nextTrip: "Jan 20",
      travelers: 12,
    },
    {
      from: "Los Angeles",
      to: "Tokyo",
      avgReward: 120,
      nextTrip: "Jan 22",
      travelers: 8,
    },
    {
      from: "Miami",
      to: "Paris",
      avgReward: 95,
      nextTrip: "Jan 19",
      travelers: 15,
    },
    {
      from: "San Francisco",
      to: "Singapore",
      avgReward: 140,
      nextTrip: "Jan 25",
      travelers: 6,
    },
    {
      from: "Chicago",
      to: "Dubai",
      avgReward: 110,
      nextTrip: "Jan 21",
      travelers: 9,
    },
    {
      from: "Boston",
      to: "Berlin",
      avgReward: 90,
      nextTrip: "Jan 23",
      travelers: 11,
    },
  ]);

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-150 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span>{route.from}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span>{route.to}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{route.travelers} travelers available</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Avg. Reward
                  </span>
                  <span className="font-semibold text-primary">${route.avgReward}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Next Trip
                  </span>
                  <span className="font-medium">{route.nextTrip}</span>
                </div>
              </div>
              
              <Link 
                href={`/marketplace/trips?from=${route.from}&to=${route.to}`}
                onClick={() => {
                  const intent = localStorage.getItem('userIntent');
                  if (!intent) {
                    // Show modal to choose persona if no intent set
                    localStorage.setItem('showPersonaModal', 'true');
                    localStorage.setItem('pendingRoute', JSON.stringify({ from: route.from, to: route.to }));
                  }
                }}
              >
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  View Trips
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/marketplace/trips">
          <Button size="lg">
            Browse All Routes
          </Button>
        </Link>
      </div>
    </div>
  );
}