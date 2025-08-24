import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plane,
  Calendar,
  Package,
} from "lucide-react";
import type { TripWithRequests } from "@shared/schema";

export default function TravelerTrips() {
  const userId = 1; // Demo user ID
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: trips, isLoading } = useQuery<TripWithRequests[]>({
    queryKey: [`/api/dashboard/trips/${userId}`],
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (
    departure: string | Date,
    arrival?: string | Date
  ) => {
    if (!arrival) return formatDate(departure);
    return `${formatDate(departure)} - ${formatDate(arrival)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-airbar-green text-white">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-airbar-red text-white">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-400 text-white">{status}</Badge>;
    }
  };

  const filteredTrips = trips?.filter(trip => {
    const matchesSearch =
      trip.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.toCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 text-airbar-black">My Trips</h1>
            <p className="text-body text-airbar-dark-gray mt-1">
              Manage your travel plans and delivery opportunities
            </p>
          </div>
          <Link href="/dashboard/traveler/trips/addtrip">
            <Button className="bg-airbar-blue text-white hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Trip
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-airbar-dark-gray" />
                  <Input
                    placeholder="Search by destination..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips Grid */}
        <div className="grid gap-6">
          {filteredTrips?.map(trip => (
            <Card key={trip.id} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Trip Route */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-5 w-5 text-airbar-blue" />
                        <span className="text-h3 text-airbar-black">
                          {trip.fromCity} → {trip.toCity}
                        </span>
                      </div>
                      {getStatusBadge(trip.status)}
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-airbar-dark-gray" />
                        <span className="text-body text-airbar-dark-gray">
                          {formatDateRange(
                            trip.departureDate,
                            trip.arrivalDate
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-airbar-dark-gray" />
                        <span className="text-body text-airbar-dark-gray">
                          Space: {trip.maxWeight || "Not specified"}kg
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            trip.requestCount > 0 ? "default" : "secondary"
                          }
                          className={
                            trip.requestCount > 0
                              ? "bg-airbar-orange text-white"
                              : ""
                          }
                        >
                          {trip.requestCount} Request
                          {trip.requestCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>

                    {/* Price Info */}
                    {trip.pricePerKg && (
                      <div className="text-small text-airbar-dark-gray">
                        Rate: ${trip.pricePerKg}/kg
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Trip
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate Trip
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-airbar-red">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Trip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!filteredTrips || filteredTrips.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Plane className="mx-auto h-12 w-12 text-airbar-dark-gray mb-4" />
                <h3 className="text-h3 text-airbar-black mb-2">
                  No trips found
                </h3>
                <p className="text-body text-airbar-dark-gray mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first trip"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link href="/dashboard/traveler/trips/addtrip">
                    <Button className="bg-airbar-blue text-white hover:bg-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Trip
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
