import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { EscrowBanner } from "@/components/EscrowBanner";
import { TrackingStepper } from "@/components/TrackingStepper";
import {
  MapPin,
  Calendar,
  Package,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MatchRequest {
  id: number;
  tripId: number;
  parcelId: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  weight: number;
  reward: number;
  category: string;
  message: string;
  status:
    | "pending"
    | "accepted"
    | "paid"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "disputed"
    | "cancelled";
  paymentStatus?: string;
  escrowStatus?: string;
  escrowAmount?: number;
  trackingStep?: "picked_up" | "in_transit" | "delivered";
  createdAt: string;
  acceptedAt?: string;
  paidAt?: string;
}

export default function MatchRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams();
  const matchId = params.id;
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">("sender");
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  // Fetch match requests from API
  const { data: matchRequests = [] } = useQuery<MatchRequest[]>({
    queryKey: ["/api/match-requests"],
  });

  // Mock data for demonstration
  const mockMatchRequests: MatchRequest[] = [
    {
      id: 1,
      tripId: 1,
      parcelId: 1,
      senderId: 1,
      travelerId: 502, // Mock traveler ID
      senderName: "Alex Kim",
      travelerName: "Sarah Chen",
      fromCity: "New York, NY",
      toCity: "Miami, FL",
      departureDate: "2025-01-20",
      weight: 5,
      reward: 45,
      category: "electronics",
      message: "Laptop for my cousin, please handle with care",
      status: "accepted",
      paymentStatus: "pending",
      createdAt: "2025-01-16T10:00:00Z",
      acceptedAt: "2025-01-16T11:30:00Z",
    },
    {
      id: 2,
      tripId: 2,
      parcelId: 2,
      senderId: 3,
      travelerId: 501, // Mock traveler ID
      senderName: "Emily Johnson",
      travelerName: "Alex Kim",
      fromCity: "Los Angeles, CA",
      toCity: "Chicago, IL",
      departureDate: "2025-01-25",
      weight: 3,
      reward: 35,
      category: "documents",
      message: "Important documents, waterproof package",
      status: "pending",
      createdAt: "2025-01-16T09:00:00Z",
    },
    {
      id: 3,
      tripId: 3,
      parcelId: 3,
      senderId: 1,
      travelerId: 504, // Mock traveler ID
      senderName: "Alex Kim",
      travelerName: "Emma Davis",
      fromCity: "Boston, MA",
      toCity: "Seattle, WA",
      departureDate: "2025-01-28",
      weight: 8,
      reward: 120,
      category: "gifts",
      message: "Birthday gifts for family",
      status: "paid",
      paymentStatus: "completed",
      escrowStatus: "held",
      escrowAmount: 120,
      trackingStep: "picked_up",
      createdAt: "2025-01-15T14:00:00Z",
      acceptedAt: "2025-01-15T15:00:00Z",
      paidAt: "2025-01-15T16:00:00Z",
    },
  ];

  const acceptMutation = useMutation({
    mutationFn: async (matchId: number) => {
      return apiRequest("POST", `/api/match-requests/${matchId}/accept`);
    },
    onSuccess: () => {
      toast({
        title: "Match accepted!",
        description: "The sender will be notified to proceed with payment.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (matchId: number) => {
      return apiRequest("POST", `/api/match-requests/${matchId}/decline`);
    },
    onSuccess: () => {
      toast({
        title: "Match declined",
        description: "The sender has been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
    },
  });

  const payMutation = useMutation({
    mutationFn: async (matchId: number) => {
      // This would integrate with Stripe
      return apiRequest("POST", `/api/match-requests/${matchId}/pay`);
    },
    onSuccess: () => {
      toast({
        title: "Payment successful!",
        description: "Funds are now held in escrow until delivery.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
    },
  });

  // Filter requests based on active tab
  const filteredRequests = mockMatchRequests.filter(req =>
    activeTab === "sender" ? req.senderId === parseInt(user.id) : req.travelerId === parseInt(user.id)
  );

  if (matchId) {
    // Single match detail view
    const match = mockMatchRequests.find(m => m.id === parseInt(matchId));
    if (!match) return <div>Match not found</div>;

    const isUserSender = match.senderId === userId;
    const canAccept = !isUserSender && match.status === "pending";
    const canPay =
      isUserSender &&
      match.status === "accepted" &&
      match.paymentStatus === "pending";
    const showTracking = [
      "paid",
      "confirmed",
      "in_transit",
      "delivered",
    ].includes(match.status);

    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/match-requests">
                <Button variant="ghost" size="sm" className="mb-2">
                  ← Back to Matches
                </Button>
              </Link>
              <h1 className="text-h1">Match Request Details</h1>
            </div>
            <MatchStatusBadge status={match.status} />
          </div>

          {/* Escrow Banner */}
          {match.escrowStatus && match.escrowAmount && (
            <EscrowBanner
              amount={match.escrowAmount}
              status={match.escrowStatus as any}
              className="mb-6"
            />
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Match Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-secondary">Route</span>
                    </div>
                    <span className="font-medium">
                      {match.fromCity} → {match.toCity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-secondary">Departure</span>
                    </div>
                    <span>
                      {format(new Date(match.departureDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Package Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-secondary">Weight</span>
                    </div>
                    <span className="font-medium">{match.weight}kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-secondary">Reward</span>
                    </div>
                    <span className="font-medium text-primary">
                      ${match.reward}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Category</span>
                    <Badge variant="secondary">{match.category}</Badge>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-secondary">Message</span>
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {match.message}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking */}
              {showTracking && match.trackingStep && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrackingStepper currentStep={match.trackingStep} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Users & Actions */}
            <div className="space-y-6">
              {/* Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary mb-1">Sender</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{match.senderName}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-secondary mb-1">Traveler</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{match.travelerName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canAccept && (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => acceptMutation.mutate(match.id)}
                        disabled={acceptMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Match
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => declineMutation.mutate(match.id)}
                        disabled={declineMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}

                  {canPay && (
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Payment required within 1 hour
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          navigate(`/payment-checkout/${match.id}`)
                        }
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${match.reward}
                      </Button>
                    </div>
                  )}

                  {match.status === "paid" && (
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact {isUserSender ? "Traveler" : "Sender"}
                    </Button>
                  )}

                  {["delivered", "disputed"].includes(match.status) && (
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Open Dispute
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // List view
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-h1">Match Requests</h1>
          <p className="text-secondary mt-2">
            Manage your package delivery matches
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="sender">As Sender</TabsTrigger>
            <TabsTrigger value="traveler">As Traveler</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map(match => (
                <Card key={match.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          {match.fromCity} → {match.toCity}
                        </h3>
                        <p className="text-sm text-secondary mt-1">
                          {format(new Date(match.departureDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <MatchStatusBadge status={match.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-secondary">Weight</p>
                        <p className="font-medium">{match.weight}kg</p>
                      </div>
                      <div>
                        <p className="text-secondary">Reward</p>
                        <p className="font-medium text-primary">
                          ${match.reward}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-secondary">
                        {activeTab === "sender" ? "Traveler" : "Sender"}
                      </p>
                      <p className="font-medium">
                        {activeTab === "sender"
                          ? match.travelerName
                          : match.senderName}
                      </p>
                    </div>

                    {match.status === "accepted" &&
                      match.paymentStatus === "pending" &&
                      activeTab === "sender" && (
                        <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Payment required
                        </div>
                      )}

                    {match.status === "pending" && activeTab === "traveler" && (
                      <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Response needed
                      </div>
                    )}

                    <Link href={`/match-requests/${match.id}`}>
                      <Button variant="outline" className="w-full mt-3">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <Card className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No match requests</h3>
                <p className="text-secondary mb-4">
                  {activeTab === "sender"
                    ? "Browse trips to send your packages"
                    : "Wait for senders to request matches with your trips"}
                </p>
                <Link href="/marketplace/trips">
                  <Button variant="outline">Browse Trips</Button>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
