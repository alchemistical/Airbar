import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Calendar as CalendarIcon, 
  MapPin, 
  Weight, 
  DollarSign,
  User,
  Star,
  Shield,
  Clock,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { MatchRequestModal } from "@/components/MatchRequestModal";

interface Trip {
  id: number;
  userId: number;
  userName: string;
  userRating: number;
  userVerified: boolean;
  from: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  availableWeight: number;
  pricePerKg: number;
  status: string;
  matchCount: number;
  description?: string;
}

export default function MarketplaceTrips() {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const [weightFilter, setWeightFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Mock data - would come from API
  const trips: Trip[] = [
    {
      id: 1,
      userId: 2,
      userName: "Sarah Chen",
      userRating: 4.9,
      userVerified: true,
      from: "New York, NY",
      to: "Miami, FL",
      departureDate: "2025-01-20",
      arrivalDate: "2025-01-20",
      availableWeight: 15,
      pricePerKg: 8,
      status: "active",
      matchCount: 3,
      description: "Flying Delta, can pick up from Manhattan or JFK area"
    },
    {
      id: 2,
      userId: 3,
      userName: "Mike Johnson",
      userRating: 4.7,
      userVerified: true,
      from: "Los Angeles, CA",
      to: "Chicago, IL",
      departureDate: "2025-01-25",
      arrivalDate: "2025-01-25",
      availableWeight: 20,
      pricePerKg: 10,
      status: "active",
      matchCount: 1,
      description: "United flight, flexible with pickup locations"
    },
    {
      id: 3,
      userId: 4,
      userName: "Emma Davis",
      userRating: 5.0,
      userVerified: false,
      from: "Boston, MA",
      to: "Seattle, WA",
      departureDate: "2025-01-28",
      arrivalDate: "2025-01-29",
      availableWeight: 10,
      pricePerKg: 12,
      status: "active",
      matchCount: 0,
      description: "Business trip, can handle fragile items with care"
    }
  ];



  const filteredTrips = trips.filter(trip => {
    if (searchFrom && !trip.from.toLowerCase().includes(searchFrom.toLowerCase())) return false;
    if (searchTo && !trip.to.toLowerCase().includes(searchTo.toLowerCase())) return false;
    if (weightFilter !== "all") {
      if (weightFilter === "light" && trip.availableWeight > 5) return false;
      if (weightFilter === "medium" && (trip.availableWeight <= 5 || trip.availableWeight > 15)) return false;
      if (weightFilter === "heavy" && trip.availableWeight <= 15) return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-h1">Find Travelers</h1>
          <p className="text-secondary mt-2">Browse available trips and send match requests</p>
        </div>

        {/* Search Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="from">From</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="from"
                  placeholder="Departure city"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="to">To</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="to"
                  placeholder="Destination city"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Weight Range</Label>
              <Select value={weightFilter} onValueChange={setWeightFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All weights</SelectItem>
                  <SelectItem value="light">Light (0-5kg)</SelectItem>
                  <SelectItem value="medium">Medium (5-15kg)</SelectItem>
                  <SelectItem value="heavy">Heavy (15kg+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Price Range</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All prices</SelectItem>
                  <SelectItem value="budget">Budget ($0-10/kg)</SelectItem>
                  <SelectItem value="standard">Standard ($10-20/kg)</SelectItem>
                  <SelectItem value="premium">Premium ($20+/kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-secondary">Found {filteredTrips.length} available trips</p>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Save Search
          </Button>
        </div>

        {/* Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover-lift cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{trip.userName}</p>
                        {trip.userVerified && (
                          <Shield className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{trip.userRating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-secondary">
                    {trip.matchCount} matches
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Route</span>
                    <span className="font-medium">{trip.from} → {trip.to}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Date</span>
                    <span>{format(new Date(trip.departureDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Available</span>
                    <span className="font-medium">{trip.availableWeight}kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Price</span>
                    <span className="font-medium text-primary">${trip.pricePerKg}/kg</span>
                  </div>
                </div>
                
                {trip.description && (
                  <p className="text-sm text-secondary">{trip.description}</p>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTrip(trip);
                    setShowMatchModal(true);
                  }}
                >
                  Send Match Request
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <Card className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips found</h3>
            <p className="text-secondary mb-4">Try adjusting your search filters</p>
            <Button variant="outline" onClick={() => {
              setSearchFrom("");
              setSearchTo("");
              setWeightFilter("all");
              setPriceFilter("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {selectedTrip && (
        <MatchRequestModal
          open={showMatchModal}
          onOpenChange={setShowMatchModal}
          trip={{
            id: selectedTrip.id,
            userId: selectedTrip.userId,
            fromCity: selectedTrip.from,
            toCity: selectedTrip.to,
            departureDate: selectedTrip.departureDate,
            arrivalDate: selectedTrip.arrivalDate,
            maxWeight: selectedTrip.availableWeight.toString(),
            pricePerKg: selectedTrip.pricePerKg.toString(),
            travelerName: selectedTrip.userName,
            travelerRating: selectedTrip.userRating.toString(),
            travelerVerified: selectedTrip.userVerified,
          }}
        />
      )}
    </DashboardLayout>
  );
}