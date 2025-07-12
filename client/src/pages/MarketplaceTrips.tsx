import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, MapPin, Package, DollarSign, User, Shield, Star, Filter, Search, X } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";

type Trip = {
  id: number;
  userId: number;
  travelerName: string;
  travelerRating: number;
  travelerVerified: boolean;
  fromCity: string;
  toCity: string;
  departureDate: string;
  arrivalDate: string;
  maxWeight: number;
  pricePerKg: number;
  availableSpace: number;
  status: string;
  tripType: "one-way" | "round-trip";
  totalRequests: number;
};

export default function MarketplaceTrips() {
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [weightRange, setWeightRange] = useState([0, 20]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Mock data for demonstration
  const mockTrips: Trip[] = [
    {
      id: 1,
      userId: 2,
      travelerName: "Sarah Chen",
      travelerRating: 4.9,
      travelerVerified: true,
      fromCity: "New York",
      toCity: "London",
      departureDate: "2025-01-20",
      arrivalDate: "2025-01-21",
      maxWeight: 15,
      pricePerKg: 8,
      availableSpace: 12,
      status: "active",
      tripType: "one-way",
      totalRequests: 3
    },
    {
      id: 2,
      userId: 3,
      travelerName: "Marcus Johnson",
      travelerRating: 4.7,
      travelerVerified: true,
      fromCity: "Los Angeles",
      toCity: "Tokyo",
      departureDate: "2025-01-25",
      arrivalDate: "2025-01-26",
      maxWeight: 20,
      pricePerKg: 12,
      availableSpace: 18,
      status: "active",
      tripType: "round-trip",
      totalRequests: 1
    },
    {
      id: 3,
      userId: 4,
      travelerName: "Emma Wilson",
      travelerRating: 4.5,
      travelerVerified: false,
      fromCity: "Chicago",
      toCity: "Paris",
      departureDate: "2025-01-18",
      arrivalDate: "2025-01-19",
      maxWeight: 10,
      pricePerKg: 6,
      availableSpace: 10,
      status: "active",
      tripType: "one-way",
      totalRequests: 0
    }
  ];

  const { data: trips = mockTrips, isLoading } = useQuery<Trip[]>({
    queryKey: ["/api/marketplace/trips", { fromCity, toCity, dateRange, priceRange, weightRange, verifiedOnly }],
    enabled: false, // Using mock data for now
  });

  const filteredTrips = trips.filter(trip => {
    if (searchQuery && !trip.fromCity.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !trip.toCity.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (fromCity && !trip.fromCity.toLowerCase().includes(fromCity.toLowerCase())) return false;
    if (toCity && !trip.toCity.toLowerCase().includes(toCity.toLowerCase())) return false;
    if (verifiedOnly && !trip.travelerVerified) return false;
    if (trip.pricePerKg < priceRange[0] || trip.pricePerKg > priceRange[1]) return false;
    if (trip.maxWeight < weightRange[0] || trip.maxWeight > weightRange[1]) return false;
    return true;
  });

  const clearFilters = () => {
    setFromCity("");
    setToCity("");
    setDateRange({ from: undefined, to: undefined });
    setPriceRange([0, 50]);
    setWeightRange([0, 20]);
    setVerifiedOnly(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-airbar-black">Browse Trips</h1>
            <p className="text-gray-600 mt-1">Find travelers heading to your destination</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Route Filters */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="from">From City</Label>
                      <Input
                        id="from"
                        placeholder="Departure city"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to">To City</Label>
                      <Input
                        id="to"
                        placeholder="Destination city"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Date Range */}
                  <div>
                    <Label>Travel Dates</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} -{" "}
                                {format(dateRange.to, "LLL dd")}
                              </>
                            ) : (
                              format(dateRange.from, "PPP")
                            )
                          ) : (
                            <span>Pick dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Price per kg: ${priceRange[0]} - ${priceRange[1]}</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Weight Range */}
                  <div className="space-y-3">
                    <Label>Max Weight: {weightRange[0]}kg - {weightRange[1]}kg</Label>
                    <Slider
                      value={weightRange}
                      onValueChange={setWeightRange}
                      min={0}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  {/* Verified Only */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="verified"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="verified" className="font-normal">
                      Verified travelers only
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trip Listings */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Found {filteredTrips.length} trips
              </p>
              <Select defaultValue="departure">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Sort by departure</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Traveler rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue mx-auto mb-4"></div>
                <p className="text-gray-500">Loading trips...</p>
              </div>
            ) : filteredTrips.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No trips found matching your criteria</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredTrips.map((trip) => (
                  <Link key={trip.id} href={`/marketplace/trips/${trip.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Route Info */}
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold">{trip.fromCity}</span>
                              <span className="text-gray-400">→</span>
                              <span className="font-semibold">{trip.toCity}</span>
                              {trip.tripType === "round-trip" && (
                                <Badge variant="secondary" className="ml-2">Round Trip</Badge>
                              )}
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Departs: {format(new Date(trip.departureDate), "MMM d")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Arrives: {format(new Date(trip.arrivalDate), "MMM d")}</span>
                              </div>
                            </div>

                            {/* Traveler Info */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">{trip.travelerName}</span>
                                {trip.travelerVerified && (
                                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">{trip.travelerRating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Space Info */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-airbar-blue">
                              ${trip.pricePerKg}/kg
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {trip.availableSpace}kg available
                            </div>
                            {trip.totalRequests > 0 && (
                              <div className="text-xs text-orange-600 mt-1">
                                {trip.totalRequests} pending requests
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}