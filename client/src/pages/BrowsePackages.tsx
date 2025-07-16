import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Package, MapPin, Weight, DollarSign, User, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderRating: string;
  senderVerified: boolean;
  fromCity: string;
  toCity: string;
  weight: string;
  description: string;
  collectionDate: string;
  deliveryDate: string;
  status: string;
  offerAmount: string;
  createdAt: string;
  urgency: "standard" | "express" | "urgent";
  packageType: string;
}

export default function BrowsePackages() {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 50]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [verifiedSendersOnly, setVerifiedSendersOnly] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  // Fetch available packages
  const { data: packages = [], isLoading } = useQuery<PackageRequest[]>({
    queryKey: ["/api/packages/browse", { 
      from: searchFrom, 
      to: searchTo,
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString(),
      verifiedOnly: verifiedSendersOnly,
      urgency: urgencyFilter
    }],
  });

  const filteredPackages = packages.filter(pkg => {
    const weight = parseFloat(pkg.weight);
    const price = parseFloat(pkg.offerAmount);
    
    return (
      (!searchFrom || pkg.fromCity.toLowerCase().includes(searchFrom.toLowerCase())) &&
      (!searchTo || pkg.toCity.toLowerCase().includes(searchTo.toLowerCase())) &&
      weight >= weightRange[0] && weight <= weightRange[1] &&
      price >= priceRange[0] && price <= priceRange[1] &&
      (!fromDate || new Date(pkg.collectionDate) >= fromDate) &&
      (!toDate || new Date(pkg.deliveryDate) <= toDate) &&
      (!verifiedSendersOnly || pkg.senderVerified) &&
      (urgencyFilter === "all" || pkg.urgency === urgencyFilter)
    );
  });

  const hasActiveFilters = searchFrom || searchTo || fromDate || toDate || 
    verifiedSendersOnly || urgencyFilter !== "all" ||
    weightRange[0] !== 0 || weightRange[1] !== 50 ||
    priceRange[0] !== 0 || priceRange[1] !== 1000;

  const clearFilters = () => {
    setSearchFrom("");
    setSearchTo("");
    setWeightRange([0, 50]);
    setPriceRange([0, 1000]);
    setFromDate(undefined);
    setToDate(undefined);
    setVerifiedSendersOnly(false);
    setUrgencyFilter("all");
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent": return "bg-red-100 text-red-800";
      case "express": return "bg-orange-100 text-orange-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Packages</h1>
        <p className="text-gray-600">Find packages that need delivery and earn money on your trips</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Search Filters</CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">From Location</label>
              <Input
                placeholder="Enter pickup city"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">To Location</label>
              <Input
                placeholder="Enter delivery city"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Collection From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    disabled={(date) => toDate ? date > toDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Delivery By</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    disabled={(date) => fromDate ? date < fromDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Weight and Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Weight Range: {weightRange[0]} - {weightRange[1]} kg
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={weightRange[0]}
                  onChange={(e) => setWeightRange([+e.target.value, weightRange[1]])}
                  className="w-20"
                  min="0"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={weightRange[1]}
                  onChange={(e) => setWeightRange([weightRange[0], +e.target.value])}
                  className="w-20"
                  min={weightRange[0]}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-24"
                  min="0"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-24"
                  min={priceRange[0]}
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Urgency</label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All urgencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgencies</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox 
                id="verified" 
                checked={verifiedSendersOnly}
                onCheckedChange={(checked) => setVerifiedSendersOnly(checked as boolean)}
              />
              <label
                htmlFor="verified"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Verified senders only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPackages.length} available package{filteredPackages.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Package Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Link key={pkg.id} href={`/package/${pkg.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Header with urgency and price */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={cn("text-xs", getUrgencyColor(pkg.urgency))}>
                      {pkg.urgency.charAt(0).toUpperCase() + pkg.urgency.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${pkg.offerAmount}</p>
                      <p className="text-xs text-gray-500">offer</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{pkg.fromCity}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{pkg.toCity}</span>
                    </div>
                  </div>

                  {/* Package details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Weight className="h-4 w-4 mr-1" />
                        Weight
                      </span>
                      <span className="font-medium">{pkg.weight} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Collection
                      </span>
                      <span className="font-medium">
                        {format(new Date(pkg.collectionDate), "MMM d")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Delivery
                      </span>
                      <span className="font-medium">
                        {format(new Date(pkg.deliveryDate), "MMM d")}
                      </span>
                    </div>
                  </div>

                  {/* Sender info */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{pkg.senderName}</span>
                        {pkg.senderVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">⭐ {pkg.senderRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {pkg.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}