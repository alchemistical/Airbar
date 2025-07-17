import { z } from "zod";

// Types
export type Country = {
  code: string;
  name: string;
  flagEmoji: string;
  currency: string;
  weightUnit?: "kg" | "lb";
};

export type City = {
  id: string;
  name: string;
  admin?: string;
  countryCode: string;
  lat: number;
  lng: number;
  tz?: string;
  airports?: string[];
};

export type Airport = {
  code: string;
  name: string;
  cityId: string;
  countryCode: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
};

export type LocationResult = {
  kind: "city" | "airport" | "country";
  id: string;
  primaryLabel: string;
  secondaryLabel?: string;
  code?: string;
  countryCode: string;
  lat: number;
  lng: number;
};

export type LocationScope = "city_airport" | "airport_only" | "country_city";

// Seed data for development
const seedCountries: Country[] = [
  { code: "US", name: "United States", flagEmoji: "🇺🇸", currency: "USD", weightUnit: "lb" },
  { code: "GB", name: "United Kingdom", flagEmoji: "🇬🇧", currency: "GBP", weightUnit: "kg" },
  { code: "FR", name: "France", flagEmoji: "🇫🇷", currency: "EUR", weightUnit: "kg" },
  { code: "JP", name: "Japan", flagEmoji: "🇯🇵", currency: "JPY", weightUnit: "kg" },
  { code: "AE", name: "United Arab Emirates", flagEmoji: "🇦🇪", currency: "AED", weightUnit: "kg" },
  { code: "CA", name: "Canada", flagEmoji: "🇨🇦", currency: "CAD", weightUnit: "kg" },
  { code: "DE", name: "Germany", flagEmoji: "🇩🇪", currency: "EUR", weightUnit: "kg" },
  { code: "AU", name: "Australia", flagEmoji: "🇦🇺", currency: "AUD", weightUnit: "kg" },
  { code: "CN", name: "China", flagEmoji: "🇨🇳", currency: "CNY", weightUnit: "kg" },
  { code: "IN", name: "India", flagEmoji: "🇮🇳", currency: "INR", weightUnit: "kg" }
];

const seedCities: City[] = [
  { id: "nyc-us", name: "New York", admin: "NY", countryCode: "US", lat: 40.7128, lng: -74.0060, airports: ["JFK", "LGA", "EWR"] },
  { id: "lax-us", name: "Los Angeles", admin: "CA", countryCode: "US", lat: 34.0522, lng: -118.2437, airports: ["LAX"] },
  { id: "chi-us", name: "Chicago", admin: "IL", countryCode: "US", lat: 41.8781, lng: -87.6298, airports: ["ORD", "MDW"] },
  { id: "hou-us", name: "Houston", admin: "TX", countryCode: "US", lat: 29.7604, lng: -95.3698, airports: ["IAH", "HOU"] },
  { id: "lon-gb", name: "London", countryCode: "GB", lat: 51.5074, lng: -0.1278, airports: ["LHR", "LGW", "LCY", "STN", "LTN"] },
  { id: "par-fr", name: "Paris", countryCode: "FR", lat: 48.8566, lng: 2.3522, airports: ["CDG", "ORY"] },
  { id: "tyo-jp", name: "Tokyo", countryCode: "JP", lat: 35.6762, lng: 139.6503, airports: ["HND", "NRT"] },
  { id: "dxb-ae", name: "Dubai", countryCode: "AE", lat: 25.2048, lng: 55.2708, airports: ["DXB", "DWC"] },
  { id: "tor-ca", name: "Toronto", admin: "ON", countryCode: "CA", lat: 43.6532, lng: -79.3832, airports: ["YYZ", "YTZ"] },
  { id: "syd-au", name: "Sydney", admin: "NSW", countryCode: "AU", lat: -33.8688, lng: 151.2093, airports: ["SYD"] }
];

const seedAirports: Airport[] = [
  { code: "JFK", name: "John F. Kennedy Intl", cityId: "nyc-us", countryCode: "US", lat: 40.6413, lng: -73.7781, isPrimary: true },
  { code: "LGA", name: "LaGuardia", cityId: "nyc-us", countryCode: "US", lat: 40.7769, lng: -73.8740, isPrimary: false },
  { code: "EWR", name: "Newark Liberty Intl", cityId: "nyc-us", countryCode: "US", lat: 40.6895, lng: -74.1745, isPrimary: false },
  { code: "LAX", name: "Los Angeles Intl", cityId: "lax-us", countryCode: "US", lat: 33.9416, lng: -118.4085, isPrimary: true },
  { code: "ORD", name: "O'Hare Intl", cityId: "chi-us", countryCode: "US", lat: 41.9786, lng: -87.9048, isPrimary: true },
  { code: "LHR", name: "Heathrow", cityId: "lon-gb", countryCode: "GB", lat: 51.4700, lng: -0.4543, isPrimary: true },
  { code: "CDG", name: "Charles de Gaulle", cityId: "par-fr", countryCode: "FR", lat: 49.0097, lng: 2.5479, isPrimary: true },
  { code: "HND", name: "Haneda", cityId: "tyo-jp", countryCode: "JP", lat: 35.5493, lng: 139.7798, isPrimary: true },
  { code: "DXB", name: "Dubai Intl", cityId: "dxb-ae", countryCode: "AE", lat: 25.2532, lng: 55.3657, isPrimary: true },
  { code: "YYZ", name: "Toronto Pearson Intl", cityId: "tor-ca", countryCode: "CA", lat: 43.6777, lng: -79.6248, isPrimary: true }
];

// Local storage keys
const RECENT_LOCATIONS_KEY = "airbar_recent_locations";
const FAVORITE_LOCATIONS_KEY = "airbar_favorite_locations";
const WEIGHT_UNIT_PREF_KEY = "airbar_weight_unit";

class LocationService {
  private countries = new Map<string, Country>();
  private cities = new Map<string, City>();
  private airports = new Map<string, Airport>();
  private popularRoutes: Array<[string, string]> = [
    ["nyc-us", "lon-gb"],
    ["lax-us", "tyo-jp"],
    ["chi-us", "par-fr"],
    ["dxb-ae", "lon-gb"],
    ["tor-ca", "nyc-us"]
  ];

  constructor() {
    // Initialize with seed data
    seedCountries.forEach(c => this.countries.set(c.code, c));
    seedCities.forEach(c => this.cities.set(c.id, c));
    seedAirports.forEach(a => this.airports.set(a.code, a));
  }

  async search(query: string, scope: LocationScope = "city_airport"): Promise<LocationResult[]> {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const results: LocationResult[] = [];

    // Search airports
    if (scope === "airport_only" || scope === "city_airport") {
      this.airports.forEach(airport => {
        if (
          airport.code.toLowerCase().includes(q) ||
          airport.name.toLowerCase().includes(q)
        ) {
          const city = this.cities.get(airport.cityId);
          const country = this.countries.get(airport.countryCode);
          results.push({
            kind: "airport",
            id: airport.code,
            primaryLabel: `${airport.code} - ${airport.name}`,
            secondaryLabel: city ? `${city.name}, ${country?.name}` : country?.name,
            code: airport.code,
            countryCode: airport.countryCode,
            lat: airport.lat,
            lng: airport.lng
          });
        }
      });
    }

    // Search cities
    if (scope === "city_airport" || scope === "country_city") {
      this.cities.forEach(city => {
        if (city.name.toLowerCase().includes(q)) {
          const country = this.countries.get(city.countryCode);
          results.push({
            kind: "city",
            id: city.id,
            primaryLabel: city.admin ? `${city.name}, ${city.admin}` : city.name,
            secondaryLabel: country?.name,
            countryCode: city.countryCode,
            lat: city.lat,
            lng: city.lng
          });
        }
      });
    }

    // Search countries
    if (scope === "country_city") {
      this.countries.forEach(country => {
        if (country.name.toLowerCase().includes(q)) {
          results.push({
            kind: "country",
            id: country.code,
            primaryLabel: country.name,
            secondaryLabel: country.flagEmoji,
            countryCode: country.code,
            lat: 0, // Would need country center coords
            lng: 0
          });
        }
      });
    }

    return results.slice(0, 10); // Limit results
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries.get(code);
  }

  getCityById(id: string): City | undefined {
    return this.cities.get(id);
  }

  getAirportByCode(code: string): Airport | undefined {
    return this.airports.get(code);
  }

  getPopularRoutes(intent: "send" | "travel"): Array<[LocationResult, LocationResult]> {
    return this.popularRoutes.slice(0, 5).map(([fromId, toId]) => {
      const fromCity = this.cities.get(fromId);
      const toCity = this.cities.get(toId);
      if (!fromCity || !toCity) return null;

      const fromCountry = this.countries.get(fromCity.countryCode);
      const toCountry = this.countries.get(toCity.countryCode);

      return [
        {
          kind: "city",
          id: fromCity.id,
          primaryLabel: fromCity.name,
          secondaryLabel: fromCountry?.name,
          countryCode: fromCity.countryCode,
          lat: fromCity.lat,
          lng: fromCity.lng
        },
        {
          kind: "city",
          id: toCity.id,
          primaryLabel: toCity.name,
          secondaryLabel: toCountry?.name,
          countryCode: toCity.countryCode,
          lat: toCity.lat,
          lng: toCity.lng
        }
      ];
    }).filter(Boolean) as Array<[LocationResult, LocationResult]>;
  }

  // Recent locations management
  getRecentLocations(role: "sender" | "traveler"): LocationResult[] {
    const key = `${RECENT_LOCATIONS_KEY}_${role}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  saveRecentLocation(role: "sender" | "traveler", location: LocationResult) {
    const key = `${RECENT_LOCATIONS_KEY}_${role}`;
    const recent = this.getRecentLocations(role);
    
    // Remove if already exists
    const filtered = recent.filter(l => l.id !== location.id);
    
    // Add to front
    filtered.unshift(location);
    
    // Keep only last 10
    const toStore = filtered.slice(0, 10);
    
    localStorage.setItem(key, JSON.stringify(toStore));
  }

  // Favorite locations management
  getFavoriteLocations(): LocationResult[] {
    const stored = localStorage.getItem(FAVORITE_LOCATIONS_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  toggleFavoriteLocation(location: LocationResult): boolean {
    const favorites = this.getFavoriteLocations();
    const index = favorites.findIndex(l => l.id === location.id);
    
    if (index >= 0) {
      favorites.splice(index, 1);
      localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(favorites));
      return false; // Removed
    } else {
      favorites.push(location);
      localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(favorites));
      return true; // Added
    }
  }

  isFavorite(locationId: string): boolean {
    const favorites = this.getFavoriteLocations();
    return favorites.some(l => l.id === locationId);
  }

  // Weight unit preference
  getWeightUnitPreference(): "kg" | "lb" {
    return (localStorage.getItem(WEIGHT_UNIT_PREF_KEY) as "kg" | "lb") || "kg";
  }

  setWeightUnitPreference(unit: "kg" | "lb") {
    localStorage.setItem(WEIGHT_UNIT_PREF_KEY, unit);
  }

  // Utility functions
  formatLocationLabel(location: LocationResult): string {
    if (location.kind === "airport") {
      return `${location.code} - ${location.primaryLabel}`;
    }
    return location.secondaryLabel 
      ? `${location.primaryLabel}, ${location.secondaryLabel}`
      : location.primaryLabel;
  }

  getCountryFlag(countryCode: string): string {
    return this.countries.get(countryCode)?.flagEmoji || "";
  }
}

export const locationService = new LocationService();