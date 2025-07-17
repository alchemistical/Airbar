import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MapPin, Plane, Globe, Star, Clock, X } from "lucide-react";
import { locationService, type LocationResult, type LocationScope } from "@/lib/locationService";
import { useDebounce } from "@/hooks/use-debounce";

interface LocationSelectProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  intent?: "send" | "travel";
  scope?: LocationScope;
  value?: LocationResult | null;
  onChange: (location: LocationResult | null) => void;
  recent?: LocationResult[];
  favorites?: LocationResult[];
  error?: string;
  className?: string;
}

export function LocationSelect({
  label,
  required = false,
  placeholder = "Search for a location...",
  intent = "send",
  scope = "city_airport",
  value,
  onChange,
  error,
  className
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [recentLocations, setRecentLocations] = useState<LocationResult[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Load recent and favorite locations
  useEffect(() => {
    const role = intent === "send" ? "sender" : "traveler";
    setRecentLocations(locationService.getRecentLocations(role));
    setFavoriteLocations(locationService.getFavoriteLocations());
  }, [intent]);

  // Search when query changes
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      setIsSearching(true);
      locationService.search(debouncedSearch, scope).then(results => {
        setSearchResults(results);
        setIsSearching(false);
      });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch, scope]);

  const handleSelect = useCallback((location: LocationResult) => {
    onChange(location);
    setSearchQuery("");
    setOpen(false);
    setShowManualEntry(false);
    
    // Save to recent
    const role = intent === "send" ? "sender" : "traveler";
    locationService.saveRecentLocation(role, location);
  }, [onChange, intent]);

  const handleToggleFavorite = useCallback((location: LocationResult, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFavorite = locationService.toggleFavoriteLocation(location);
    setFavoriteLocations(locationService.getFavoriteLocations());
    
    // Update recent locations to reflect favorite status
    setRecentLocations(prev => [...prev]);
  }, []);

  const handleManualEntry = useCallback(() => {
    if (manualAddress.trim()) {
      const manualLocation: LocationResult = {
        kind: "city",
        id: `manual-${Date.now()}`,
        primaryLabel: manualAddress,
        secondaryLabel: "Manual entry",
        countryCode: "XX",
        lat: 0,
        lng: 0
      };
      handleSelect(manualLocation);
      setManualAddress("");
    }
  }, [manualAddress, handleSelect]);

  const getLocationIcon = (kind: string) => {
    switch (kind) {
      case "airport": return <Plane className="h-4 w-4" />;
      case "country": return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const renderLocationItem = (location: LocationResult, section: string) => {
    const isFavorite = locationService.isFavorite(location.id);
    const flag = locationService.getCountryFlag(location.countryCode);
    
    return (
      <div
        key={`${section}-${location.id}`}
        className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md cursor-pointer"
        onClick={() => handleSelect(location)}
      >
        <div className="flex items-center gap-2 flex-1">
          {getLocationIcon(location.kind)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {flag && <span className="text-base">{flag}</span>}
              <span className="font-medium text-sm">{location.primaryLabel}</span>
            </div>
            {location.secondaryLabel && (
              <div className="text-xs text-muted-foreground">{location.secondaryLabel}</div>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={(e) => handleToggleFavorite(location, e)}
        >
          <Star className={cn("h-3 w-3", isFavorite && "fill-yellow-500 text-yellow-500")} />
        </Button>
      </div>
    );
  };

  const displayValue = value ? locationService.formatLocationLabel(value) : "";

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`location-${label}`}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`location-${label}`}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {value && getLocationIcon(value.kind)}
              {displayValue || placeholder}
            </span>
            {value && (
              <X
                className="h-4 w-4 ml-2 shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <Input
              ref={inputRef}
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {/* Favorites Section */}
              {favoriteLocations.length > 0 && !searchQuery && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" /> Favorites
                  </div>
                  {favoriteLocations.map(loc => renderLocationItem(loc, "favorite"))}
                </div>
              )}
              
              {/* Recent Section */}
              {recentLocations.length > 0 && !searchQuery && (
                <div className="mb-4">
                  <div className="px-3 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Recent
                  </div>
                  {recentLocations.slice(0, 5).map(loc => renderLocationItem(loc, "recent"))}
                </div>
              )}
              
              {/* Search Results */}
              {searchQuery && (
                <div>
                  {isSearching ? (
                    <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                        Search Results
                      </div>
                      {searchResults.map(loc => renderLocationItem(loc, "search"))}
                    </>
                  ) : (
                    <div className="px-3 py-8 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No locations found
                      </p>
                      {!showManualEntry && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowManualEntry(true)}
                        >
                          Enter address manually
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Manual Entry */}
              {showManualEntry && (
                <div className="p-3 border-t">
                  <Label htmlFor="manual-address" className="text-sm">
                    Enter address manually
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="manual-address"
                      placeholder="123 Main St, City, Country"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleManualEntry();
                      }}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleManualEntry}>
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}