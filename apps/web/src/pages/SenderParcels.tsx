import { useState } from "react";

// Define PackageStatus enum locally
enum PackageStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING', 
  MATCHED = 'MATCHED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}
import {
  Package,
  Search,
  MapPin,
  Clock,
  Plus,
  Eye,
  Calendar,
  ArrowRight,
  User,
  Star,
  Truck,
  CheckCircle,
  X,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { ParcelRequest } from "@shared/schema";

type StatusFilter =
  | "all"
  | "waiting"
  | "matched"
  | "in-transit"
  | "delivered"
  | "cancelled";
type SortOption = "newest" | "deadline" | "status";

// Extended type for sender view with traveler info
type SenderParcelRequest = ParcelRequest & {
  travelerName?: string;
  travelerRating?: number;
  tripRoute?: string;
  tripDate?: string;
};

export default function SenderParcels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Mock data for sender parcels (in real app, this would be a different API endpoint)
  const senderParcels: SenderParcelRequest[] = [
    {
      id: "1",
      senderId: "1",
      tripId: "1",
      description: "Important Documents",
      pickupAddress: "123 Broadway, New York, NY",
      deliveryAddress: "456 Market St, San Francisco, CA",
      weight: "0.5",
      rewardAmount: "50.00",
      status: PackageStatus.MATCHED,
      deadline: "2024-02-15T00:00:00Z",
      createdAt: "2024-01-15T10:00:00Z",
      specialInstructions: "Handle with care",
      travelerName: "Sarah Johnson",
      travelerRating: 4.8,
      tripRoute: "New York → San Francisco",
      tripDate: "2024-02-10",
    },
    {
      id: "2",
      senderId: "1",
      tripId: null,
      description: "Electronics Package",
      pickupAddress: "789 Pine St, Seattle, WA",
      deliveryAddress: "321 Oak Ave, Portland, OR",
      weight: "2.0",
      rewardAmount: "75.00",
      status: PackageStatus.PENDING,
      deadline: "2024-02-20T00:00:00Z",
      createdAt: "2024-01-18T14:30:00Z",
      specialInstructions: "Fragile - contains laptop",
    },
    {
      id: "3",
      senderId: "1",
      tripId: "2",
      description: "Gift Package",
      pickupAddress: "555 Main St, Chicago, IL",
      deliveryAddress: "777 Elm St, Detroit, MI",
      weight: "1.2",
      rewardAmount: "40.00",
      status: PackageStatus.DELIVERED,
      deadline: "2024-01-25T00:00:00Z",
      createdAt: "2024-01-10T09:15:00Z",
      specialInstructions: "Birthday gift - please deliver by evening",
      travelerName: "Mike Chen",
      travelerRating: 4.9,
      tripRoute: "Chicago → Detroit",
      tripDate: "2024-01-20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "matched":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return <Clock className="h-4 w-4" />;
      case "matched":
        return <User className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredParcels = senderParcels.filter(parcel => {
    const matchesSearch =
      parcel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || parcel.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">My Parcels</h1>
            <p className="text-body text-gray-600 mt-1">
              Track your parcel delivery requests and manage shipments
            </p>
          </div>
          <Link href="/send-package">
            <AnimatedButton className="bg-airbar-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Send New Parcel
            </AnimatedButton>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "All", count: senderParcels.length, status: "all" },
            {
              label: "Waiting",
              count: senderParcels.filter(p => p.status === PackageStatus.PENDING).length,
              status: PackageStatus.PENDING,
            },
            {
              label: "Matched",
              count: senderParcels.filter(p => p.status === PackageStatus.MATCHED).length,
              status: PackageStatus.MATCHED,
            },
            {
              label: "In Transit",
              count: senderParcels.filter(p => p.status === PackageStatus.IN_TRANSIT)
                .length,
              status: "in-transit",
            },
            {
              label: "Delivered",
              count: senderParcels.filter(p => p.status === PackageStatus.DELIVERED).length,
              status: PackageStatus.DELIVERED,
            },
          ].map(stat => (
            <Card
              key={stat.status}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                statusFilter === stat.status ? "ring-2 ring-airbar-blue" : ""
              }`}
              onClick={() => setStatusFilter(stat.status as StatusFilter)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-h2 font-bold text-airbar-black">
                  {stat.count}
                </div>
                <div className="text-small text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by description or location..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parcels List */}
        {filteredParcels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-h3 font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No matching parcels"
                  : "No parcels sent yet"}
              </h3>
              <p className="text-body text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start sending parcels with trusted travelers to destinations worldwide"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/send-package">
                  <AnimatedButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Send Your First Parcel
                  </AnimatedButton>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredParcels.map(parcel => (
              <Card
                key={parcel.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left side - Main content */}
                    <div className="flex-1 space-y-4">
                      {/* Header with status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                            {getStatusIcon(parcel.status)}
                          </div>
                          <div>
                            <h3 className="text-h4 font-semibold text-airbar-black">
                              {parcel.description}
                            </h3>
                            <p className="text-small text-gray-600">
                              Parcel ID: #{parcel.id}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(parcel.status)}>
                          {parcel.status}
                        </Badge>
                      </div>

                      {/* Route */}
                      <div className="flex items-center space-x-2 text-body text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {parcel.pickupAddress}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {parcel.deliveryAddress}
                        </span>
                      </div>

                      {/* Traveler Info (if matched) */}
                      {parcel.travelerName && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {parcel.travelerName
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-small font-medium text-airbar-black">
                                {parcel.travelerName}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">
                                  {parcel.travelerRating}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              {parcel.tripRoute} • {parcel.tripDate}
                            </p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-small">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Weight: {parcel.weight}kg
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Deadline: {formatDate(parcel.deadline)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Created: {formatDate(parcel.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reward: </span>
                          <span className="font-semibold text-green-600">
                            ${parcel.rewardAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Link href={`/parcel-request/${parcel.id}`}>
                        <AnimatedButton variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </AnimatedButton>
                      </Link>

                      {(parcel.status === PackageStatus.MATCHED ||
                        parcel.status === PackageStatus.IN_TRANSIT) && (
                        <AnimatedButton
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Track Delivery
                        </AnimatedButton>
                      )}

                      {parcel.status === PackageStatus.PENDING && (
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </AnimatedButton>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
