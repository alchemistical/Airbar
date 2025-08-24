import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrackingStepper } from "@/components/TrackingStepper";
import { EscrowBanner } from "@/components/EscrowBanner";
import {
  MapPin,
  Package,
  DollarSign,
  User,
  MessageSquare,
  CheckCircle,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Camera,
  FileText,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MatchDetails {
  id: number;
  tripId: number;
  parcelId: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  senderPhone?: string;
  travelerPhone?: string;
  senderVerified?: boolean;
  travelerVerified?: boolean;
  fromCity: string;
  toCity: string;
  departureDate: string;
  arrivalDate?: string;
  weight: number;
  reward: number;
  category: string;
  description?: string;
  specialInstructions?: string;
  status: string;
  paymentStatus?: string;
  escrowStatus?: string;
  escrowAmount?: number;
  trackingStep?: string;
  createdAt: string;
  acceptedAt?: string;
  paidAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  rating?: number;
  review?: string;
  photos?: string[];
  messages?: Array<{
    id: number;
    senderId: number;
    message: string;
    timestamp: string;
  }>;
  timeline?: Array<{
    event: string;
    timestamp: string;
    actor: string;
    description?: string;
  }>;
}

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  accepted: "bg-purple-100 text-purple-800 border-purple-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  confirmed: "bg-indigo-100 text-indigo-800 border-indigo-300",
  in_transit: "bg-cyan-100 text-cyan-800 border-cyan-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  disputed: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function MatchDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const matchId = params.id;
  const currentUserId = 1; // Would come from auth context

  // Fetch match details
  const { data: match } = useQuery<MatchDetails>({
    queryKey: [`/api/matches/${matchId}`],
  });

  // Mock data for demonstration
  const mockMatch: MatchDetails = {
    id: Number(matchId),
    tripId: 1,
    parcelId: 1,
    senderId: 1,
    travelerId: 2,
    senderName: "Alex Kim",
    travelerName: "Sarah Johnson",
    senderPhone: "+1 (555) 123-4567",
    travelerPhone: "+1 (555) 987-6543",
    senderVerified: true,
    travelerVerified: true,
    fromCity: "San Francisco, CA",
    toCity: "Los Angeles, CA",
    departureDate: "2025-01-25",
    arrivalDate: "2025-01-25",
    weight: 2.5,
    reward: 35,
    category: "Electronics",
    description: "Laptop charger and accessories",
    specialInstructions: "Please handle with care. Items are fragile.",
    status: "paid",
    paymentStatus: "completed",
    escrowStatus: "held",
    escrowAmount: 35,
    trackingStep: "picked_up",
    createdAt: "2025-01-20T10:00:00Z",
    acceptedAt: "2025-01-20T14:30:00Z",
    paidAt: "2025-01-20T16:00:00Z",
    pickedUpAt: "2025-01-25T09:00:00Z",
    messages: [
      {
        id: 1,
        senderId: 1,
        message:
          "Hi! I can pick up the package from downtown SF if that works.",
        timestamp: "2025-01-20T14:35:00Z",
      },
      {
        id: 2,
        senderId: 2,
        message: "That's perfect! I'll have it ready by 9 AM.",
        timestamp: "2025-01-20T14:45:00Z",
      },
    ],
    timeline: [
      {
        event: "Match Request Created",
        timestamp: "2025-01-20T10:00:00Z",
        actor: "Alex Kim",
        description: "Requested match for package delivery",
      },
      {
        event: "Request Accepted",
        timestamp: "2025-01-20T14:30:00Z",
        actor: "Sarah Johnson",
        description: "Accepted the delivery request",
      },
      {
        event: "Payment Completed",
        timestamp: "2025-01-20T16:00:00Z",
        actor: "Alex Kim",
        description: "$35 paid and held in escrow",
      },
      {
        event: "Package Picked Up",
        timestamp: "2025-01-25T09:00:00Z",
        actor: "Sarah Johnson",
        description: "Package collected from sender",
      },
    ],
  };

  const displayMatch = match || mockMatch;
  const isSender = displayMatch.senderId === currentUserId;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/matches")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Matches
            </Button>
            <h1 className="text-2xl font-bold">Match Details</h1>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                statusColors[displayMatch.status as keyof typeof statusColors]
              )}
            >
              {displayMatch.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Escrow Banner if applicable */}
        {displayMatch.escrowStatus && (
          <EscrowBanner
            amount={displayMatch.escrowAmount || 0}
            status={displayMatch.escrowStatus as any}
            releaseDate={displayMatch.deliveredAt}
          />
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Match Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route & Package Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Route & Package Details
                  <Badge variant="outline">
                    {isSender ? "You are the Sender" : "You are the Traveler"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Route
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {displayMatch.fromCity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(
                          new Date(displayMatch.departureDate),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-px w-12 bg-gray-300" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <span className="font-medium">
                          {displayMatch.toCity}
                        </span>
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">
                        {displayMatch.arrivalDate
                          ? format(
                              new Date(displayMatch.arrivalDate),
                              "MMM d, yyyy"
                            )
                          : "Same day"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Package Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          {displayMatch.category}
                        </div>
                        <div className="text-sm text-gray-600">
                          {displayMatch.weight} kg
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">
                          ${displayMatch.reward}
                        </div>
                        <div className="text-sm text-gray-600">Reward</div>
                      </div>
                    </div>
                  </div>
                  {displayMatch.description && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700">
                        {displayMatch.description}
                      </p>
                    </div>
                  )}
                  {displayMatch.specialInstructions && (
                    <div className="mt-2 p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 mb-1">
                        Special Instructions:
                      </p>
                      <p className="text-sm text-amber-700">
                        {displayMatch.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Sender</span>
                        {displayMatch.senderVerified && (
                          <Shield className="h-3.5 w-3.5 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm">
                        <div>{displayMatch.senderName}</div>
                        {displayMatch.status !== "pending" && (
                          <div className="text-gray-600">
                            {displayMatch.senderPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Traveler</span>
                        {displayMatch.travelerVerified && (
                          <Shield className="h-3.5 w-3.5 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm">
                        <div>{displayMatch.travelerName}</div>
                        {displayMatch.status !== "pending" && (
                          <div className="text-gray-600">
                            {displayMatch.travelerPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Status */}
            {displayMatch.status !== "pending" &&
              displayMatch.status !== "cancelled" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrackingStepper
                      currentStep={
                        (displayMatch.trackingStep as any) || "picked_up"
                      }
                      timestamps={{
                        picked_up: displayMatch.pickedUpAt,
                        in_transit:
                          displayMatch.status === "in_transit"
                            ? new Date().toISOString()
                            : undefined,
                        delivered: displayMatch.deliveredAt,
                      }}
                    />

                    {/* Action Buttons based on status */}
                    <div className="mt-6 flex gap-3">
                      {displayMatch.status === "paid" && !isSender && (
                        <Button className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Pickup Photo
                        </Button>
                      )}
                      {displayMatch.status === "in_transit" && !isSender && (
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Delivered
                        </Button>
                      )}
                      {displayMatch.status === "delivered" &&
                        !displayMatch.rating && (
                          <Button variant="outline" className="flex-1">
                            Rate & Review
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayMatch.messages && displayMatch.messages.length > 0 ? (
                  <div className="space-y-3">
                    {displayMatch.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={cn(
                          "p-3 rounded-lg",
                          msg.senderId === currentUserId
                            ? "bg-blue-50 ml-12"
                            : "bg-gray-50 mr-12"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {msg.senderId === displayMatch.senderId
                              ? displayMatch.senderName
                              : displayMatch.travelerName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No messages yet
                  </p>
                )}

                <div className="mt-4">
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Timeline & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayMatch.status === "accepted" && isSender && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/dashboard/payment/checkout?matchRequestId=${matchId}`
                      )
                    }
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${displayMatch.reward}
                  </Button>
                )}
                {displayMatch.status === "pending" && !isSender && (
                  <>
                    <Button className="w-full">Accept Request</Button>
                    <Button variant="outline" className="w-full">
                      Decline
                    </Button>
                  </>
                )}
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Contract
                </Button>
                {["paid", "in_transit", "delivered"].includes(
                  displayMatch.status
                ) && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {displayMatch.timeline && displayMatch.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {displayMatch.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-gray-400 mt-1.5" />
                        </div>
                        <div className="flex-1 -mt-0.5">
                          <div className="font-medium text-sm">
                            {event.event}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {format(new Date(event.timestamp), "MMM d, h:mm a")}
                          </div>
                          {event.description && (
                            <div className="text-sm text-gray-700 mt-1">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No activity yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
