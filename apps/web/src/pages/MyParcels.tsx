import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import {
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Truck,
} from "lucide-react";
import { Link } from "wouter";
import { useUserRole } from "@/hooks/useUserRole";

interface ParcelRequest {
  id: number;
  from: string;
  to: string;
  status: "pending" | "matched" | "in_transit" | "delivered";
  date: string;
  weight: string;
  type: string;
  price: number;
  travelerName?: string;
  trackingId?: string;
}

export default function MyParcels() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const { role } = useUserRole();

  // Mock data - would come from API
  const parcelRequests: ParcelRequest[] = [
    {
      id: 1,
      from: "New York",
      to: "London",
      status: "pending",
      date: "2025-01-25",
      weight: "2.5 kg",
      type: "Electronics",
      price: 85,
    },
    {
      id: 2,
      from: "Los Angeles",
      to: "Tokyo",
      status: "matched",
      date: "2025-01-28",
      weight: "1.8 kg",
      type: "Documents",
      price: 65,
      travelerName: "Sarah Chen",
    },
    {
      id: 3,
      from: "Miami",
      to: "Paris",
      status: "in_transit",
      date: "2025-01-20",
      weight: "3.2 kg",
      type: "Cosmetics",
      price: 120,
      travelerName: "John Smith",
      trackingId: "TRK-2025-0003",
    },
    {
      id: 4,
      from: "Chicago",
      to: "Berlin",
      status: "delivered",
      date: "2025-01-15",
      weight: "1.5 kg",
      type: "Gifts",
      price: 75,
      travelerName: "Emma Wilson",
      trackingId: "TRK-2025-0004",
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      pending: {
        label: "Pending",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
      },
      matched: {
        label: "Matched",
        variant: "secondary" as const,
        className: "bg-blue-100 text-blue-800",
      },
      in_transit: {
        label: "In Transit",
        variant: "secondary" as const,
        className: "bg-purple-100 text-purple-800",
      },
      delivered: {
        label: "Delivered",
        variant: "secondary" as const,
        className: "bg-green-100 text-green-800",
      },
    };

    const { label, variant, className } =
      config[status as keyof typeof config] || config.pending;
    return (
      <Badge variant={variant} className={className}>
        {label}
      </Badge>
    );
  };

  const filteredParcels = parcelRequests.filter(parcel => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        parcel.from.toLowerCase().includes(search) ||
        parcel.to.toLowerCase().includes(search) ||
        parcel.type.toLowerCase().includes(search) ||
        parcel.trackingId?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const getTabParcels = (tabType: string) => {
    switch (tabType) {
      case "requests":
        return filteredParcels.filter(p => p.status === "pending");
      case "matches":
        return filteredParcels.filter(p => p.status === "matched");
      case "tracking":
        return filteredParcels.filter(
          p => p.status === "in_transit" || p.status === "delivered"
        );
      default:
        return filteredParcels;
    }
  };

  const renderParcelCard = (parcel: ParcelRequest) => (
    <Card key={parcel.id} className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {parcel.from} → {parcel.to}
                </h3>
                {getStatusBadge(parcel.status)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {parcel.type} • {parcel.weight} • ${parcel.price}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date(parcel.date).toLocaleDateString()}
            </p>
            {parcel.trackingId && (
              <p className="text-xs text-gray-400 mt-1">{parcel.trackingId}</p>
            )}
          </div>
        </div>

        {parcel.travelerName && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Traveler: {parcel.travelerName}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {parcel.status === "pending" && (
            <>
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-1" />
                View Offers
              </AnimatedButton>
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                Edit Request
              </AnimatedButton>
            </>
          )}

          {parcel.status === "matched" && (
            <>
              <AnimatedButton size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </AnimatedButton>
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </AnimatedButton>
            </>
          )}

          {(parcel.status === "in_transit" ||
            parcel.status === "delivered") && (
            <Link
              href={`/dashboard/tracking/${parcel.trackingId}`}
              className="flex-1"
            >
              <AnimatedButton size="sm" className="w-full">
                <MapPin className="h-4 w-4 mr-1" />
                Track Package
              </AnimatedButton>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Parcels</h1>
          <p className="text-gray-600 mt-1">
            {role === "sender"
              ? "Manage your package requests and track deliveries"
              : "View and manage parcels you're carrying"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by location, type, or tracking ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <AnimatedButton variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </AnimatedButton>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" className="relative">
              <Clock className="h-4 w-4 mr-2" />
              Requests
              {getTabParcels("requests").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {getTabParcels("requests").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="matches" className="relative">
              <CheckCircle className="h-4 w-4 mr-2" />
              Matches
              {getTabParcels("matches").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {getTabParcels("matches").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tracking" className="relative">
              <Truck className="h-4 w-4 mr-2" />
              Tracking
              {getTabParcels("tracking").length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 text-xs" variant="secondary">
                  {getTabParcels("tracking").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {getTabParcels("requests").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No pending requests
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You don't have any active parcel requests
                  </p>
                  <Link href="/send-package">
                    <AnimatedButton>
                      <Package className="h-4 w-4 mr-2" />
                      Send a Package
                    </AnimatedButton>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              getTabParcels("requests").map(renderParcelCard)
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            {getTabParcels("matches").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No matches yet</h3>
                  <p className="text-gray-500">
                    Your parcels will appear here once matched with travelers
                  </p>
                </CardContent>
              </Card>
            ) : (
              getTabParcels("matches").map(renderParcelCard)
            )}
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            {getTabParcels("tracking").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No packages in transit
                  </h3>
                  <p className="text-gray-500">
                    Packages in transit and delivered will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              getTabParcels("tracking").map(renderParcelCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
