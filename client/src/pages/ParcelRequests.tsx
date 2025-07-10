import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  Filter, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  X,
  Eye,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import type { ParcelRequestWithSender } from "@shared/schema";

type StatusFilter = "all" | "pending" | "accepted" | "declined" | "completed";
type SortOption = "newest" | "deadline" | "distance";

export default function ParcelRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // For demo purposes, using userId 1
  const { data: parcelRequests = [], isLoading } = useQuery<ParcelRequestWithSender[]>({
    queryKey: ["/api/dashboard/parcel-requests/1"],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "declined": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredRequests = parcelRequests.filter(request => {
    const matchesSearch = request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-airbar-black">Parcel Requests</h1>
          <p className="text-body text-gray-600 mt-1">
            Manage incoming delivery requests for your trips
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredRequests.length} requests
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by description, pickup, or delivery location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="deadline">By Deadline</SelectItem>
                <SelectItem value="distance">By Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parcel Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-h3 font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "No matching requests" : "No parcel requests yet"}
            </h3>
            <p className="text-body text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Parcel requests will appear here when senders want to use your trips for deliveries"
              }
            </p>
            {(!searchTerm && statusFilter === "all") && (
              <Link href="/dashboard/traveler/trips">
                <Button>
                  <MapPin className="h-4 w-4 mr-2" />
                  View My Trips
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left side - Main content */}
                  <div className="flex-1 space-y-4">
                    {/* Header with status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-h4 font-semibold text-airbar-black">
                            {request.description}
                          </h3>
                          <p className="text-small text-gray-600">
                            From: {request.senderName}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>

                    {/* Route */}
                    <div className="flex items-center space-x-2 text-body text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{request.pickupAddress}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{request.deliveryAddress}</span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-small">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Weight: {request.weight}kg</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Deadline: {formatDate(request.deadline)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Created: {formatDate(request.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reward: </span>
                        <span className="font-semibold text-green-600">${request.rewardAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link href={`/parcel-request/${request.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>

                    {request.status.toLowerCase() === "pending" && (
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}