import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Archive,
  FileText,
  DollarSign,
} from "lucide-react";
import { Link, useParams } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type TimelineEvent = {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
};

type HistoryDetailRecord = {
  id: string;
  matchId: string;
  packageTitle: string;
  packageDescription: string;
  fromCity: string;
  toCity: string;
  fromAddress: string;
  toAddress: string;
  status: "delivered" | "cancelled" | "declined" | "refunded";
  userRole: "sender" | "traveler";
  otherUserName: string;
  otherUserRating: number;
  otherUserPhone: string;
  otherUserEmail: string;
  weight: number;
  size: string;
  dimensions: string;
  rewardAmount: number;
  completedDate: string;
  createdDate: string;
  hasDispute: boolean;
  disputeReason?: string;
  archived: boolean;
  notes?: string;
  timeline: TimelineEvent[];
  specialInstructions?: string;
  pickupWindow?: string;
  deliveryWindow?: string;
};

export default function HistoryDetail() {
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const [isArchived, setIsArchived] = useState(false);

  // Mock data - in real app this would be fetched based on ID
  const mockRecord: HistoryDetailRecord = {
    id: "H001",
    matchId: "M-2024-156",
    packageTitle: "Electronics Package",
    packageDescription:
      "High-end laptop and accessories for business meeting presentation. Includes charger, mouse, and presentation materials.",
    fromCity: "New York",
    toCity: "Miami",
    fromAddress: "123 Broadway St, New York, NY 10001",
    toAddress: "456 Ocean Drive, Miami, FL 33139",
    status: "delivered",
    userRole: "traveler",
    otherUserName: "Sarah Johnson",
    otherUserRating: 4.8,
    otherUserPhone: "+1 (555) 123-4567",
    otherUserEmail: "sarah.johnson@email.com",
    weight: 3.5,
    size: "Medium",
    dimensions: "40cm x 30cm x 15cm",
    rewardAmount: 85.0,
    completedDate: "2024-12-28",
    createdDate: "2024-12-20",
    hasDispute: false,
    archived: false,
    specialInstructions:
      "Handle with care - fragile electronics. Recipient will be available from 2-6 PM.",
    pickupWindow: "Dec 21, 2024 10:00 AM - 2:00 PM",
    deliveryWindow: "Dec 28, 2024 2:00 PM - 6:00 PM",
    timeline: [
      {
        status: "created",
        title: "Request Created",
        description: "Parcel request posted by sender",
        timestamp: "2024-12-20 09:30 AM",
        completed: true,
      },
      {
        status: "matched",
        title: "Matched with Traveler",
        description: "Request accepted by traveler",
        timestamp: "2024-12-21 11:15 AM",
        completed: true,
      },
      {
        status: "picked-up",
        title: "Package Picked Up",
        description: "Package collected from sender",
        timestamp: "2024-12-21 01:45 PM",
        completed: true,
      },
      {
        status: "in-transit",
        title: "In Transit",
        description: "Package traveling to destination",
        timestamp: "2024-12-21 03:30 PM",
        completed: true,
      },
      {
        status: "delivered",
        title: "Package Delivered",
        description: "Successfully delivered to recipient",
        timestamp: "2024-12-28 04:15 PM",
        completed: true,
      },
      {
        status: "confirmed",
        title: "Delivery Confirmed",
        description: "Delivery confirmed by recipient",
        timestamp: "2024-12-28 04:30 PM",
        completed: true,
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "declined":
        return "bg-orange-100 text-orange-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    return role === "traveler"
      ? "bg-blue-100 text-blue-800"
      : "bg-indigo-100 text-indigo-800";
  };

  const handleArchive = () => {
    setIsArchived(!isArchived);
    // In real app, would make API call to archive/unarchive
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/history">
              <AnimatedButton variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </AnimatedButton>
            </Link>
            <div>
              <h1 className="text-h1 font-bold text-airbar-black">
                {mockRecord.packageTitle}
              </h1>
              <p className="text-gray-600">Match ID: {mockRecord.matchId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className={getRoleColor(mockRecord.userRole)}
            >
              {mockRecord.userRole === "traveler" ? "As Traveler" : "As Sender"}
            </Badge>
            <Badge
              variant="secondary"
              className={getStatusColor(mockRecord.status)}
            >
              {mockRecord.status.charAt(0).toUpperCase() +
                mockRecord.status.slice(1)}
            </Badge>
            {mockRecord.hasDispute && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Dispute
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Package Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {mockRecord.packageTitle}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {mockRecord.packageDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{mockRecord.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{mockRecord.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{mockRecord.dimensions}</p>
                  </div>
                </div>

                {mockRecord.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Special Instructions
                    </p>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {mockRecord.specialInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Route & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Route & Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                      Pickup Location
                    </h4>
                    <p className="text-sm text-gray-600">
                      {mockRecord.fromAddress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Window: {mockRecord.pickupWindow}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-green-600" />
                      Delivery Location
                    </h4>
                    <p className="text-sm text-gray-600">
                      {mockRecord.toAddress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Window: {mockRecord.deliveryWindow}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Delivery Timeline
                  </h4>
                  <div className="space-y-4">
                    {mockRecord.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                            event.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{event.title}</h5>
                            <span className="text-xs text-gray-500">
                              {event.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Information */}
            {mockRecord.hasDispute && (
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Dispute Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-800">
                      {mockRecord.disputeReason ||
                        "Dispute was raised regarding delivery conditions. Issue has been resolved through customer support."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    {mockRecord.userRole === "traveler"
                      ? "Amount Earned"
                      : "Amount Paid"}
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      mockRecord.userRole === "traveler"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {mockRecord.userRole === "traveler" ? "+" : "-"}$
                    {mockRecord.rewardAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed on {mockRecord.completedDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Other User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {mockRecord.userRole === "traveler"
                    ? "Sender"
                    : "Traveler"}{" "}
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {mockRecord.otherUserName}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm">
                      {mockRecord.otherUserRating}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{mockRecord.otherUserPhone}</p>
                  <p>{mockRecord.otherUserEmail}</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Key Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Request Created</p>
                  <p className="font-medium">{mockRecord.createdDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="font-medium">{mockRecord.completedDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <Textarea
                    placeholder="Add notes about this delivery..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <AnimatedButton
                    variant={isArchived ? "default" : "outline"}
                    className="w-full"
                    onClick={handleArchive}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {isArchived ? "Unarchive" : "Archive Record"}
                  </AnimatedButton>

                  <AnimatedButton variant="outline" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Reviewed
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
