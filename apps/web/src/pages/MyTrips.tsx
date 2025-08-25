import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Weight,
} from "lucide-react";
import { Link } from "wouter";
import { useUserRole } from "@/hooks/useUserRole";

interface Trip {
  id: number;
  from: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  availableSpace: string;
  pricePerKg: number;
  status: "upcoming" | "active" | "completed";
  matchedParcels: number;
  earnings?: number;
}

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { role } = useUserRole();

  // Mock trips data
  const trips: Trip[] = [
    {
      id: 1,
      from: "New York",
      to: "London",
      departureDate: "2025-01-25",
      arrivalDate: "2025-01-26",
      availableSpace: "5.5 kg",
      pricePerKg: 15,
      status: "upcoming",
      matchedParcels: 2,
    },
    {
      id: 2,
      from: "Los Angeles",
      to: "Tokyo",
      departureDate: "2025-01-22",
      arrivalDate: "2025-01-23",
      availableSpace: "3 kg",
      pricePerKg: 18,
      status: "active",
      matchedParcels: 1,
    },
    {
      id: 3,
      from: "Miami",
      to: "Paris",
      departureDate: "2025-01-10",
      arrivalDate: "2025-01-11",
      availableSpace: "0 kg",
      pricePerKg: 20,
      status: "completed",
      matchedParcels: 3,
      earnings: 240,
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      upcoming: {
        label: "Upcoming",
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
      },
      active: {
        label: "In Progress",
        variant: "secondary" as const,
        className: "bg-purple-100 text-purple-800",
      },
      completed: {
        label: "Completed",
        variant: "secondary" as const,
        className: "bg-green-100 text-green-800",
      },
    };

    const { label, variant, className } =
      config[status as keyof typeof config] || config.upcoming;
    return (
      <Badge variant={variant} className={className}>
        {label}
      </Badge>
    );
  };

  const filteredTrips = (status: string) =>
    trips.filter(trip => trip.status === status);

  const renderTripCard = (trip: Trip) => (
    <Card key={trip.id} className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">
                {trip.from} → {trip.to}
              </h3>
              {getStatusBadge(trip.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(trip.departureDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Weight className="h-3 w-3" />
                {trip.availableSpace} available
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />${trip.pricePerKg}/kg
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              <span>{trip.matchedParcels} parcels</span>
            </div>
            {trip.earnings && (
              <p className="text-lg font-semibold text-green-600 mt-1">
                +${trip.earnings}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {trip.status === "upcoming" && (
            <>
              <Link href={`/match-requests?trip=${trip.id}`} className="flex-1">
                <AnimatedButton size="sm" variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-1" />
                  View Requests
                </AnimatedButton>
              </Link>
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit Trip
              </AnimatedButton>
              <AnimatedButton
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </AnimatedButton>
            </>
          )}

          {trip.status === "active" && (
            <>
              <Link
                href={`/dashboard/my-parcels?trip=${trip.id}`}
                className="flex-1"
              >
                <AnimatedButton size="sm" className="w-full">
                  <Package className="h-4 w-4 mr-1" />
                  Manage Parcels
                </AnimatedButton>
              </Link>
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                Trip Details
              </AnimatedButton>
            </>
          )}

          {trip.status === "completed" && (
            <AnimatedButton size="sm" variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Summary
            </AnimatedButton>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Show message if user is not a traveler
  if (role !== "traveler") {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Traveler Mode Required
              </h3>
              <p className="text-gray-500 mb-4">
                Switch to traveler mode to manage your trips
              </p>
              <AnimatedButton onClick={() => window.location.reload()}>
                Switch to Traveler Mode
              </AnimatedButton>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">
              Manage your travel plans and parcel deliveries
            </p>
          </div>

          <Link href="/add-trip">
            <AnimatedButton>
              <Plus className="h-4 w-4 mr-2" />
              Add New Trip
            </AnimatedButton>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Trips</p>
                  <p className="text-2xl font-bold">{trips.length}</p>
                </div>
                <Plane className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Parcels</p>
                  <p className="text-2xl font-bold">
                    {trips.reduce((sum, trip) => sum + trip.matchedParcels, 0)}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Space</p>
                  <p className="text-2xl font-bold">8.5 kg</p>
                </div>
                <Weight className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">$1,240</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              <Clock className="h-4 w-4 mr-2" />
              Upcoming
              {filteredTrips("upcoming").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {filteredTrips("upcoming").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              <Plane className="h-4 w-4 mr-2" />
              Active
              {filteredTrips("active").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {filteredTrips("active").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
              {filteredTrips("completed").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {filteredTrips("completed").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredTrips("upcoming").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No upcoming trips
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add a new trip to start earning
                  </p>
                  <Link href="/add-trip">
                    <AnimatedButton>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trip
                    </AnimatedButton>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredTrips("upcoming").map(renderTripCard)
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filteredTrips("active").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active trips</h3>
                  <p className="text-gray-500">
                    Your active trips will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTrips("active").map(renderTripCard)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredTrips("completed").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No completed trips
                  </h3>
                  <p className="text-gray-500">
                    Your completed trips will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTrips("completed").map(renderTripCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
