import { useState } from "react";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMatchDiscovery } from "@/hooks/useMatching";
import { MatchCard } from "./MatchCard";
import type { MatchDiscoveryParams } from "@/types/matching";

interface MatchDiscoveryProps {
  userType: "sender" | "traveler";
  currentUserId?: number;
}

export function MatchDiscovery({
  userType,
  currentUserId = 1,
}: MatchDiscoveryProps) {
  const [searchParams, setSearchParams] = useState<MatchDiscoveryParams | null>(
    null
  );
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    maxPrice: "",
    minPrice: "",
    minTrustScore: "",
    verifiedOnly: false,
  });

  const {
    data: discoveryResult,
    isLoading,
    error,
  } = useMatchDiscovery(searchParams);

  const handleSearch = () => {
    if (!formData.origin.trim() || !formData.destination.trim()) {
      return;
    }

    const params: MatchDiscoveryParams = {
      userType,
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
    };

    // Add date range if provided
    if (formData.startDate && formData.endDate) {
      params.dateRange = {
        start: formData.startDate,
        end: formData.endDate,
      };
    }

    // Add filters if provided
    const filters: any = {};
    if (formData.maxPrice) filters.maxPrice = Number(formData.maxPrice);
    if (formData.minPrice) filters.minPrice = Number(formData.minPrice);
    if (formData.minTrustScore)
      filters.minTrustScore = Number(formData.minTrustScore);
    if (formData.verifiedOnly) filters.verifiedOnly = true;

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchParams(null);
    setFormData({
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      maxPrice: "",
      minPrice: "",
      minTrustScore: "",
      verifiedOnly: false,
    });
  };

  const getPlaceholderText = () => {
    if (userType === "sender") {
      return {
        title: "Find Travelers",
        description: "Search for travelers who can carry your package",
        originLabel: "Pickup Location",
        destinationLabel: "Delivery Location",
      };
    } else {
      return {
        title: "Find Packages",
        description: "Search for packages to carry on your trip",
        originLabel: "Your Departure",
        destinationLabel: "Your Destination",
      };
    }
  };

  const placeholders = getPlaceholderText();

  return (
    <div className="w-full space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>{placeholders.title}</span>
          </CardTitle>
          <p className="text-sm text-gray-600">{placeholders.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">{placeholders.originLabel}</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="origin"
                  placeholder="City, State or Airport"
                  value={formData.origin}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, origin: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">
                {placeholders.destinationLabel}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="City, State or Airport"
                  value={formData.destination}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      destination: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, endDate: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.origin.trim() || !formData.destination.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Matches
            </Button>

            {searchParams && (
              <Button variant="outline" onClick={clearSearch}>
                Clear Search
              </Button>
            )}

            {/* Advanced Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search with additional criteria
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice">Minimum Price ($)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={formData.minPrice}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          minPrice: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Maximum Price ($)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="999"
                      value={formData.maxPrice}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          maxPrice: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minTrustScore">Minimum Trust Score</Label>
                    <Select
                      value={formData.minTrustScore}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, minTrustScore: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any rating</SelectItem>
                        <SelectItem value="3.0">3.0+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verifiedOnly"
                      checked={formData.verifiedOnly}
                      onCheckedChange={checked =>
                        setFormData(prev => ({
                          ...prev,
                          verifiedOnly: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="verifiedOnly">Verified users only</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchParams && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Search Results</h3>
              {discoveryResult && (
                <p className="text-sm text-gray-600">
                  Found {discoveryResult.matches.length} matches for{" "}
                  <Badge variant="outline">{searchParams.origin}</Badge>
                  {" → "}
                  <Badge variant="outline">{searchParams.destination}</Badge>
                </p>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="w-full">
                  <CardHeader>
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-6">
              <div className="text-center">
                <p className="text-red-600">
                  Failed to load matches. Please try again.
                </p>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            </Card>
          )}

          {/* Results */}
          {discoveryResult && !isLoading && (
            <>
              {discoveryResult.matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {discoveryResult.matches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      currentUserId={currentUserId}
                      userType={userType}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8">
                  <div className="text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No matches found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or check back later for
                      new {userType === "sender" ? "travelers" : "packages"}.
                    </p>
                    <Button variant="outline" onClick={clearSearch}>
                      New Search
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
