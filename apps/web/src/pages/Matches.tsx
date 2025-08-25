import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  Weight,
  Star,
  CheckCircle,
  MessageCircle,
  AlertTriangle,
  Search,
  ArrowRight,
  Upload,
  Truck,
  X,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type RoleFilter = "traveler" | "sender";
type StatusFilter =
  | "all"
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled";

type Match = {
  id: number;
  parcelId: number;
  tripId: number;
  // Parcel info
  parcelDescription: string;
  parcelWeight: number;
  parcelSize: string;
  rewardAmount: string;
  deliveryType: "one-way" | "round-trip";
  // Trip info
  fromCity: string;
  toCity: string;
  departureDate: string;
  arrivalDate: string;
  // Match status
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "confirmed";
  // User info
  otherUserName: string;
  otherUserRating: number;
  otherUserIsKyc: boolean;
  // Additional info
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
  lastUpdated: string;
};

export default function Matches() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("traveler");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [issueReason, setIssueReason] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  // Mock data - in real app, this would come from API
  const matches: Match[] = [
    {
      id: 1,
      parcelId: 1,
      tripId: 1,
      parcelDescription: "Important Business Documents",
      parcelWeight: 0.5,
      parcelSize: "Small",
      rewardAmount: "50.00",
      deliveryType: "one-way",
      fromCity: "New York",
      toCity: "San Francisco",
      departureDate: "2024-02-10",
      arrivalDate: "2024-02-10",
      status: "picked-up",
      otherUserName: "Sarah Johnson",
      otherUserRating: 4.8,
      otherUserIsKyc: true,
      pickupAddress: "123 Broadway, Suite 1001, New York, NY 10010",
      deliveryAddress: "456 Market Street, San Francisco, CA 94102",
      createdAt: "2024-01-15T10:00:00Z",
      lastUpdated: "2024-02-08T14:30:00Z",
    },
    {
      id: 2,
      parcelId: 2,
      tripId: 2,
      parcelDescription: "Electronics Package",
      parcelWeight: 2.0,
      parcelSize: "Medium",
      rewardAmount: "75.00",
      deliveryType: "one-way",
      fromCity: "Chicago",
      toCity: "Detroit",
      departureDate: "2024-02-15",
      arrivalDate: "2024-02-15",
      status: "delivered",
      otherUserName: "Mike Chen",
      otherUserRating: 4.9,
      otherUserIsKyc: true,
      pickupAddress: "789 Michigan Ave, Chicago, IL 60611",
      deliveryAddress: "321 Woodward Ave, Detroit, MI 48226",
      createdAt: "2024-01-20T09:15:00Z",
      lastUpdated: "2024-02-15T18:45:00Z",
    },
    {
      id: 3,
      parcelId: 3,
      tripId: 3,
      parcelDescription: "Gift Package",
      parcelWeight: 1.2,
      parcelSize: "Small",
      rewardAmount: "40.00",
      deliveryType: "one-way",
      fromCity: "Los Angeles",
      toCity: "San Diego",
      departureDate: "2024-02-20",
      arrivalDate: "2024-02-20",
      status: "pending",
      otherUserName: "Emma Wilson",
      otherUserRating: 4.7,
      otherUserIsKyc: false,
      pickupAddress: "555 Sunset Blvd, Los Angeles, CA 90028",
      deliveryAddress: "777 Harbor Dr, San Diego, CA 92101",
      createdAt: "2024-01-25T16:20:00Z",
      lastUpdated: "2024-01-25T16:20:00Z",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "picked-up":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-transit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "picked-up":
        return <Package className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatusAction = (status: string, role: RoleFilter) => {
    if (role === "traveler") {
      switch (status) {
        case "pending":
          return { text: "Mark as Picked Up", action: "pick-up" };
        case "picked-up":
          return { text: "Mark as In Transit", action: "in-transit" };
        case "in-transit":
          return { text: "Mark as Delivered", action: "delivered" };
        default:
          return null;
      }
    } else {
      switch (status) {
        case "delivered":
          return { text: "Confirm Delivery", action: "confirm" };
        default:
          return null;
      }
    }
  };

  const getProgressSteps = (status: string) => {
    const steps = [
      "Pending",
      "Picked Up",
      "In Transit",
      "Delivered",
      "Confirmed",
    ];
    const currentIndex = steps.findIndex(
      step => step.toLowerCase().replace(" ", "-") === status
    );
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch =
      match.parcelDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.toCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-progress" &&
        ["picked-up", "in-transit"].includes(match.status)) ||
      (statusFilter === "completed" &&
        ["delivered", "confirmed"].includes(match.status)) ||
      match.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (matchId: number, newStatus: string) => {
    // In real app, this would make an API call
    setShowDeliveryModal(false);
  };

  const handleReportIssue = (matchId: number) => {
    // In real app, this would make an API call
    setShowIssueModal(false);
    setIssueReason("");
    setIssueDescription("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Matches</h1>
            <p className="text-body text-gray-600 mt-1">
              Manage your confirmed deliveries and track progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/parcel-requests">
              <AnimatedButton variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Parcel Requests
              </AnimatedButton>
            </Link>
            <Link href="/send-package">
              <AnimatedButton className="bg-airbar-blue hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Send Package
              </AnimatedButton>
            </Link>
          </div>
        </div>

        {/* Role Toggle & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Toggle */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Label className="text-small font-medium">View as:</Label>
                <Select
                  value={roleFilter}
                  onValueChange={(value: RoleFilter) => setRoleFilter(value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traveler">Traveler</SelectItem>
                    <SelectItem value="sender">Sender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "All", count: matches.length, status: "all" },
              {
                label: "Pending",
                count: matches.filter(m => m.status === "pending").length,
                status: "pending",
              },
              {
                label: "In Progress",
                count: matches.filter(m =>
                  ["picked-up", "in-transit"].includes(m.status)
                ).length,
                status: "in-progress",
              },
              {
                label: "Completed",
                count: matches.filter(m =>
                  ["delivered", "confirmed"].includes(m.status)
                ).length,
                status: "completed",
              },
            ].map(stat => (
              <Card
                key={stat.status}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  statusFilter === stat.status ? "ring-2 ring-airbar-blue" : ""
                }`}
                onClick={() => setStatusFilter(stat.status as StatusFilter)}
              >
                <CardContent className="p-3 text-center">
                  <div className="text-h4 font-bold text-airbar-black">
                    {stat.count}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by parcel description, destination..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value: StatusFilter) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-h3 font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No matching deliveries"
                  : "No matches yet"}
              </h3>
              <p className="text-body text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Head to Parcel Requests or Send a Package to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="flex justify-center space-x-4">
                  <Link href="/dashboard/parcel-requests">
                    <AnimatedButton variant="outline">
                      <Package className="h-4 w-4 mr-2" />
                      Parcel Requests
                    </AnimatedButton>
                  </Link>
                  <Link href="/send-package">
                    <AnimatedButton>
                      <Plus className="h-4 w-4 mr-2" />
                      Send Package
                    </AnimatedButton>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map(match => (
              <Card
                key={match.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left side - Main content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                            {getStatusIcon(match.status)}
                          </div>
                          <div>
                            <h3 className="text-h4 font-semibold text-airbar-black">
                              {match.parcelDescription}
                            </h3>
                            <p className="text-small text-gray-600">
                              Match ID: #{match.id} • {match.parcelSize} •{" "}
                              {match.deliveryType}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(match.status)}>
                          {match.status.replace("-", " ")}
                        </Badge>
                      </div>

                      {/* Route & Trip Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-body text-gray-700">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{match.fromCity}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{match.toCity}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-small text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(match.departureDate)}</span>
                        </div>
                      </div>

                      {/* Other User Info */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {match.otherUserName
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-small font-medium text-airbar-black">
                              {match.otherUserName}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {match.otherUserRating}
                              </span>
                            </div>
                            {match.otherUserIsKyc && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {roleFilter === "traveler" ? "Sender" : "Traveler"}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          {getProgressSteps(match.status).map((step, index) => (
                            <span
                              key={index}
                              className={
                                step.completed
                                  ? "text-blue-600 font-medium"
                                  : ""
                              }
                            >
                              {step.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          {getProgressSteps(match.status).map((step, index) => (
                            <div
                              key={index}
                              className={`h-2 flex-1 rounded-full ${
                                step.completed ? "bg-blue-500" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-small">
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Weight: {match.parcelWeight}kg
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Updated: {formatDate(match.lastUpdated)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Size: {match.parcelSize}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reward: </span>
                          <span className="font-semibold text-green-600">
                            ${match.rewardAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowDetailModal(true);
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        View Details
                      </AnimatedButton>

                      {/* Status Action Button */}
                      {(() => {
                        const nextAction = getNextStatusAction(
                          match.status,
                          roleFilter
                        );
                        if (nextAction) {
                          return (
                            <AnimatedButton
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 w-full"
                              onClick={() => {
                                setSelectedMatch(match);
                                if (nextAction.action === "delivered") {
                                  setShowDeliveryModal(true);
                                } else {
                                  handleStatusUpdate(
                                    match.id,
                                    nextAction.action
                                  );
                                }
                              }}
                            >
                              {getStatusIcon(nextAction.action)}
                              <span className="ml-2">{nextAction.text}</span>
                            </AnimatedButton>
                          );
                        }
                        return null;
                      })()}

                      <AnimatedButton variant="outline" size="sm" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Chat
                      </AnimatedButton>

                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowIssueModal(true);
                        }}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Issue
                      </AnimatedButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Match Details</DialogTitle>
            </DialogHeader>
            {selectedMatch && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Parcel</Label>
                    <p className="text-sm text-gray-600">
                      {selectedMatch.parcelDescription}
                    </p>
                  </div>
                  <div>
                    <Label>Route</Label>
                    <p className="text-sm text-gray-600">
                      {selectedMatch.fromCity} → {selectedMatch.toCity}
                    </p>
                  </div>
                  <div>
                    <Label>Pickup Address</Label>
                    <p className="text-sm text-gray-600">
                      {selectedMatch.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <Label>Delivery Address</Label>
                    <p className="text-sm text-gray-600">
                      {selectedMatch.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delivery Confirmation Modal */}
        <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark as Delivered</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Delivery Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about the delivery..."
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Upload Photo (optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photo</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <AnimatedButton
                  onClick={() =>
                    selectedMatch &&
                    handleStatusUpdate(selectedMatch.id, "delivered")
                  }
                  className="flex-1"
                >
                  Mark as Delivered
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setShowDeliveryModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </AnimatedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Report Issue Modal */}
        <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Issue Type</Label>
                <Select value={issueReason} onValueChange={setIssueReason}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-show">No-show</SelectItem>
                    <SelectItem value="damaged">Package damaged</SelectItem>
                    <SelectItem value="wrong-address">Wrong address</SelectItem>
                    <SelectItem value="communication">
                      Communication issue
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue..."
                  value={issueDescription}
                  onChange={e => setIssueDescription(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <AnimatedButton
                  onClick={() =>
                    selectedMatch && handleReportIssue(selectedMatch.id)
                  }
                  variant="destructive"
                  className="flex-1"
                >
                  Report Issue
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => setShowIssueModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </AnimatedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
