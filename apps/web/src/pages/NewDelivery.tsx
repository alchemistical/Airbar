import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Package,
  Plane,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Shield,
  ArrowRight,
  Clock,
  Star,
  Filter,
} from "lucide-react";
import { Link } from "wouter";
import { useUserRole } from "@/hooks/useUserRole";

interface Trip {
  id: number;
  travelerName: string;
  from: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  availableSpace: string;
  pricePerKg: number;
  rating: number;
  completedTrips: number;
  verified: boolean;
}

export default function NewDelivery() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const { role } = useUserRole();

  // Mock available trips
  const availableTrips: Trip[] = [
    {
      id: 1,
      travelerName: "Sarah Chen",
      from: "New York",
      to: "London",
      departureDate: "2025-01-25",
      arrivalDate: "2025-01-26",
      availableSpace: "5.5 kg",
      pricePerKg: 15,
      rating: 4.8,
      completedTrips: 23,
      verified: true,
    },
    {
      id: 2,
      travelerName: "John Smith",
      from: "Los Angeles",
      to: "Tokyo",
      departureDate: "2025-01-28",
      arrivalDate: "2025-01-29",
      availableSpace: "8 kg",
      pricePerKg: 18,
      rating: 4.9,
      completedTrips: 45,
      verified: true,
    },
    {
      id: 3,
      travelerName: "Emma Wilson",
      from: "Miami",
      to: "Paris",
      departureDate: "2025-01-30",
      arrivalDate: "2025-01-31",
      availableSpace: "3 kg",
      pricePerKg: 20,
      rating: 4.7,
      completedTrips: 12,
      verified: false,
    },
  ];

  const filteredTrips = availableTrips.filter(trip => {
    const matchFrom =
      !searchFrom || trip.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo =
      !searchTo || trip.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchDate = !searchDate || trip.departureDate >= searchDate;
    return matchFrom && matchTo && matchDate;
  });

  const renderTripCard = (trip: Trip) => (
    <Card key={trip.id} className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{trip.travelerName}</h3>
                {trip.verified && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 text-xs"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {trip.rating}
                </span>
                <span>{trip.completedTrips} trips</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ${trip.pricePerKg}/kg
            </p>
            <p className="text-sm text-gray-500">
              {trip.availableSpace} available
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {trip.from} → {trip.to}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm">
                Departs: {new Date(trip.departureDate).toLocaleDateString()} •
                Arrives: {new Date(trip.arrivalDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <AnimatedButton className="flex-1">View Details</AnimatedButton>
          <AnimatedButton variant="outline" className="flex-1">
            Send Request
          </AnimatedButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">New Delivery</h1>
          <p className="text-gray-600 mt-1">
            Find travelers for your packages or send a new parcel request
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">
              <Plane className="h-4 w-4 mr-2" />
              Browse Travelers
            </TabsTrigger>
            <TabsTrigger value="send">
              <Package className="h-4 w-4 mr-2" />
              Send Package
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Find a Traveler</CardTitle>
                <CardDescription>
                  Search for travelers heading to your destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="from">From</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="from"
                        placeholder="Departure city"
                        value={searchFrom}
                        onChange={e => setSearchFrom(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="to">To</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="to"
                        placeholder="Destination city"
                        value={searchTo}
                        onChange={e => setSearchTo(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="date">Departure Date</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        value={searchDate}
                        onChange={e => setSearchDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <AnimatedButton className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Search Travelers
                  </AnimatedButton>
                  <AnimatedButton variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>

            {/* Trip Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Available Travelers</h2>
                <p className="text-sm text-gray-500">
                  {filteredTrips.length} results
                </p>
              </div>

              {filteredTrips.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No travelers found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTrips.map(renderTripCard)
              )}
            </div>
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send a Package</CardTitle>
                <CardDescription>
                  Create a new parcel request to find travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Quick Send
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Fill out your package details and we'll match you with
                      verified travelers
                    </p>
                    <Link href="/send-package">
                      <AnimatedButton className="w-full">
                        <Package className="h-4 w-4 mr-2" />
                        Start Send Package Flow
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </AnimatedButton>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-medium mb-1">Save up to 70%</h4>
                      <p className="text-sm text-gray-500">
                        Compared to traditional shipping
                      </p>
                    </div>

                    <div className="text-center p-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium mb-1">Secure Escrow</h4>
                      <p className="text-sm text-gray-500">
                        Payment protected until delivery
                      </p>
                    </div>

                    <div className="text-center p-4">
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium mb-1">Fast Delivery</h4>
                      <p className="text-sm text-gray-500">
                        Direct flights, no warehouses
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
