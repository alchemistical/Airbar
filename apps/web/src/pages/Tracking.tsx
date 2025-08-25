import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  MapPin,
  Clock,
  User,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  MessageCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type TrackingStatus =
  | "confirmed"
  | "picked-up"
  | "in-transit"
  | "delivered"
  | "cancelled";
type StatusFilter = "all" | "in-progress" | "delivered" | "reported";
type SortOption = "newest" | "deadline" | "status";
type UserRole = "traveler" | "sender";

type TrackingItem = {
  id: number;
  matchId: string;
  parcelTitle: string;
  parcelDescription: string;
  weight: number;
  dimensions: string;
  value: number;
  rewardAmount: string;

  // Status tracking
  status: TrackingStatus;
  lastUpdated: string;
  estimatedDelivery: string;
  deliveryDeadline: string;

  // Location details
  pickupAddress: string;
  deliveryAddress: string;
  fromCity: string;
  toCity: string;

  // User details (opposite role)
  otherUserName: string;
  otherUserRating: number;
  otherUserIsKyc: boolean;
  otherUserPhone: string;
  otherUserEmail: string;

  // Timeline
  timeline: {
    confirmed: { date: string; time: string; note?: string };
    pickedUp?: { date: string; time: string; note?: string };
    inTransit?: { date: string; time: string; note?: string };
    delivered?: { date: string; time: string; note?: string };
  };

  // Flags
  hasIssue: boolean;
  isDelayed: boolean;
  requiresId: boolean;
};

export default function Tracking() {
  const [activeRole, setActiveRole] = useState<UserRole>("traveler");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracking, setSelectedTracking] = useState<TrackingItem | null>(
    null
  );

  // Mock data - in real app this would come from API
  const mockTrackingData: TrackingItem[] = [
    {
      id: 1,
      matchId: "TRK-2025-001",
      parcelTitle: "Important Business Documents",
      parcelDescription: "Legal contracts and signed agreements",
      weight: 0.5,
      dimensions: "30×20×2cm",
      value: 500,
      rewardAmount: "45.00",
      status: "in-transit",
      lastUpdated: "2025-01-10 14:30",
      estimatedDelivery: "2025-01-12",
      deliveryDeadline: "2025-01-15",
      pickupAddress: "123 Business District, New York, NY",
      deliveryAddress: "456 Corporate Plaza, San Francisco, CA",
      fromCity: "New York",
      toCity: "San Francisco",
      otherUserName: "Sarah Chen",
      otherUserRating: 4.8,
      otherUserIsKyc: true,
      otherUserPhone: "+1 555-0123",
      otherUserEmail: "sarah.chen@email.com",
      timeline: {
        confirmed: {
          date: "2025-01-08",
          time: "09:15",
          note: "Match confirmed by both parties",
        },
        pickedUp: {
          date: "2025-01-09",
          time: "11:30",
          note: "Package collected from sender",
        },
        inTransit: {
          date: "2025-01-10",
          time: "14:30",
          note: "Package on flight to San Francisco",
        },
      },
      hasIssue: false,
      isDelayed: false,
      requiresId: true,
    },
    {
      id: 2,
      matchId: "TRK-2025-002",
      parcelTitle: "Electronics Gift Package",
      parcelDescription: "Smartphone and accessories for family",
      weight: 2.3,
      dimensions: "25×15×8cm",
      value: 800,
      rewardAmount: "85.00",
      status: "picked-up",
      lastUpdated: "2025-01-10 16:45",
      estimatedDelivery: "2025-01-13",
      deliveryDeadline: "2025-01-15",
      pickupAddress: "789 Tech Street, Austin, TX",
      deliveryAddress: "321 Family Lane, Denver, CO",
      fromCity: "Austin",
      toCity: "Denver",
      otherUserName: "Mike Rodriguez",
      otherUserRating: 4.9,
      otherUserIsKyc: true,
      otherUserPhone: "+1 555-0456",
      otherUserEmail: "mike.r@email.com",
      timeline: {
        confirmed: {
          date: "2025-01-09",
          time: "14:20",
          note: "Match confirmed",
        },
        pickedUp: {
          date: "2025-01-10",
          time: "16:45",
          note: "Package received in good condition",
        },
      },
      hasIssue: false,
      isDelayed: false,
      requiresId: false,
    },
    {
      id: 3,
      matchId: "TRK-2025-003",
      parcelTitle: "Medical Supplies",
      parcelDescription: "Emergency medication delivery",
      weight: 0.8,
      dimensions: "20×15×5cm",
      value: 200,
      rewardAmount: "120.00",
      status: "delivered",
      lastUpdated: "2025-01-09 18:00",
      estimatedDelivery: "2025-01-09",
      deliveryDeadline: "2025-01-10",
      pickupAddress: "Medical Center, Boston, MA",
      deliveryAddress: "Hospital District, Philadelphia, PA",
      fromCity: "Boston",
      toCity: "Philadelphia",
      otherUserName: "Dr. Jennifer Park",
      otherUserRating: 5.0,
      otherUserIsKyc: true,
      otherUserPhone: "+1 555-0789",
      otherUserEmail: "j.park@medical.com",
      timeline: {
        confirmed: {
          date: "2025-01-08",
          time: "20:30",
          note: "Urgent delivery confirmed",
        },
        pickedUp: {
          date: "2025-01-09",
          time: "06:00",
          note: "Express pickup completed",
        },
        inTransit: {
          date: "2025-01-09",
          time: "08:15",
          note: "Priority handling",
        },
        delivered: {
          date: "2025-01-09",
          time: "18:00",
          note: "Delivered to hospital reception",
        },
      },
      hasIssue: false,
      isDelayed: false,
      requiresId: true,
    },
  ];

  const filteredData = mockTrackingData
    .filter(item => {
      // Status filter
      if (
        statusFilter === "in-progress" &&
        !["confirmed", "picked-up", "in-transit"].includes(item.status)
      )
        return false;
      if (statusFilter === "delivered" && item.status !== "delivered")
        return false;
      if (statusFilter === "reported" && !item.hasIssue) return false;

      // Search filter
      if (
        searchQuery &&
        !item.parcelTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.matchId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return (
            new Date(a.deliveryDeadline).getTime() -
            new Date(b.deliveryDeadline).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default: // newest
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
      }
    });

  const getStatusColor = (
    status: TrackingStatus,
    hasIssue: boolean,
    isDelayed: boolean
  ) => {
    if (hasIssue) return "bg-red-100 text-red-800";
    if (isDelayed) return "bg-orange-100 text-orange-800";

    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "picked-up":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: TrackingStatus) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "picked-up":
        return "Picked Up";
      case "in-transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const renderTimeline = (item: TrackingItem) => {
    const steps = [
      { key: "confirmed", label: "Confirmed", icon: CheckCircle },
      { key: "pickedUp", label: "Picked Up", icon: Package },
      { key: "inTransit", label: "In Transit", icon: MapPin },
      { key: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    return (
      <div className="space-y-6">
        <div className="relative">
          {steps.map((step, index) => {
            const timelineItem =
              item.timeline[step.key as keyof typeof item.timeline];
            const isCompleted = !!timelineItem;
            const isCurrent =
              !isCompleted &&
              index ===
                steps.findIndex(
                  s => !item.timeline[s.key as keyof typeof item.timeline]
                );

            return (
              <div key={step.key} className="flex items-start space-x-4 pb-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-2 ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isCurrent
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? "bg-green-200" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-medium ${
                        isCompleted
                          ? "text-green-600"
                          : isCurrent
                            ? "text-blue-600"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {timelineItem && (
                      <span className="text-sm text-gray-500">
                        {timelineItem.date} at {timelineItem.time}
                      </span>
                    )}
                  </div>
                  {timelineItem?.note && (
                    <p className="text-sm text-gray-600 mt-1">
                      {timelineItem.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTrackingCard = (item: TrackingItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{item.parcelTitle}</h3>
              <Badge
                className={getStatusColor(
                  item.status,
                  item.hasIssue,
                  item.isDelayed
                )}
              >
                {getStatusLabel(item.status)}
              </Badge>
              {item.hasIssue && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Issue Reported
                </Badge>
              )}
              {item.isDelayed && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Delayed
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Match ID: {item.matchId}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>
                  {activeRole === "traveler" ? "Sender" : "Traveler"}:{" "}
                  {item.otherUserName}
                </span>
                {item.otherUserIsKyc && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>{item.otherUserRating}</span>
                </div>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedTracking(item)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </AnimatedButton>
            </DialogTrigger>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {item.fromCity} → {item.toCity}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              Due: {new Date(item.deliveryDeadline).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>Reward: ${item.rewardAmount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Last updated: {new Date(item.lastUpdated).toLocaleString()}
          </span>
          {activeRole === "traveler" && item.status !== "delivered" && (
            <div className="flex space-x-2">
              {item.status === "confirmed" && (
                <AnimatedButton size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Mark as Picked Up
                </AnimatedButton>
              )}
              {item.status === "picked-up" && (
                <AnimatedButton size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Mark In Transit
                </AnimatedButton>
              )}
              {item.status === "in-transit" && (
                <AnimatedButton size="sm" className="bg-green-600 hover:bg-green-700">
                  Mark as Delivered
                </AnimatedButton>
              )}
            </div>
          )}
          {activeRole === "sender" && (
            <div className="flex space-x-2">
              <AnimatedButton variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </AnimatedButton>
              {item.status !== "delivered" && (
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Report Issue
                </AnimatedButton>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Role Tabs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">
              Package Tracking
            </h1>
            <p className="text-gray-600">
              Monitor your parcel deliveries in real-time
            </p>
          </div>
        </div>

        {/* Role Selection and Filters */}
        <Card>
          <CardContent className="p-6">
            <Tabs
              value={activeRole}
              onValueChange={value => setActiveRole(value as UserRole)}
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="traveler">As Traveler</TabsTrigger>
                <TabsTrigger value="sender">As Sender</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mt-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by match ID, user, or city..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(value: StatusFilter) =>
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="reported">Reported Issues</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="deadline">By Deadline</SelectItem>
                    <SelectItem value="status">By Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                {filteredData.length} of {mockTrackingData.length} packages
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking List */}
        <div className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map(renderTrackingCard)
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : `No packages to track as ${activeRole === "traveler" ? "traveler" : "sender"}`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Tracking Dialog */}
        <Dialog
          open={!!selectedTracking}
          onOpenChange={() => setSelectedTracking(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTracking && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>{selectedTracking.parcelTitle}</span>
                    <Badge
                      className={getStatusColor(
                        selectedTracking.status,
                        selectedTracking.hasIssue,
                        selectedTracking.isDelayed
                      )}
                    >
                      {getStatusLabel(selectedTracking.status)}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Delivery Timeline
                    </h3>
                    {renderTimeline(selectedTracking)}
                  </div>

                  {/* Package & Contact Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Package Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Match ID:</span>
                          <span className="font-medium">
                            {selectedTracking.matchId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-medium text-right">
                            {selectedTracking.parcelDescription}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">
                            {selectedTracking.weight}kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium">
                            {selectedTracking.dimensions}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Value:</span>
                          <span className="font-medium">
                            ${selectedTracking.value}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reward:</span>
                          <span className="font-medium text-green-600">
                            ${selectedTracking.rewardAmount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Required:</span>
                          <span className="font-medium">
                            {selectedTracking.requiresId ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {activeRole === "traveler" ? "Sender" : "Traveler"}{" "}
                        Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {selectedTracking.otherUserName}
                              </span>
                              {selectedTracking.otherUserIsKyc && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>
                                {selectedTracking.otherUserRating} rating
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedTracking.otherUserPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedTracking.otherUserEmail}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Addresses</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Pickup Location:</p>
                          <p className="font-medium">
                            {selectedTracking.pickupAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            Delivery Address:
                          </p>
                          <p className="font-medium">
                            {selectedTracking.deliveryAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            Delivery Deadline:
                          </p>
                          <p className="font-medium">
                            {new Date(
                              selectedTracking.deliveryDeadline
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
