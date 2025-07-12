import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, MapPin, Package, DollarSign, User, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, CreditCard, Shield } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

type MatchRequest = {
  id: number;
  tripId?: number;
  parcelId?: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  weight: number;
  reward: number;
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired" | "paid" | "confirmed";
  paymentStatus?: "pending" | "succeeded" | "failed";
  escrowStatus?: "held" | "released" | "refunded";
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  acceptedAt?: string;
  paidAt?: string;
  userRole: "sender" | "traveler";
};

const MatchStatusBadge = ({ status, paymentStatus, escrowStatus }: { 
  status: string; 
  paymentStatus?: string;
  escrowStatus?: string;
}) => {
  if (escrowStatus === "held") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Shield className="h-3 w-3 mr-1" />
        Escrow Held
      </Badge>
    );
  }

  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "accepted":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Accepted
        </Badge>
      );
    case "declined":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Declined
        </Badge>
      );
    case "expired":
      return <Badge variant="outline">Expired</Badge>;
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CreditCard className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Confirmed
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const EscrowBanner = ({ escrowStatus }: { escrowStatus?: string }) => {
  if (escrowStatus !== "held") return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-green-600" />
        <div>
          <p className="font-medium text-green-800">Funds Secured in Escrow</p>
          <p className="text-sm text-green-600">Payment is held securely until delivery is confirmed</p>
        </div>
      </div>
    </div>
  );
};

export default function MatchRequests() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">("sender");

  // Mock data
  const mockRequests: MatchRequest[] = [
    {
      id: 1,
      tripId: 1,
      senderId: 1,
      travelerId: 2,
      senderName: "Alex Kim",
      travelerName: "Sarah Chen",
      fromCity: "New York",
      toCity: "London",
      departureDate: "2025-01-20",
      weight: 3.5,
      reward: 28,
      message: "Small electronics package, well-wrapped. No liquids.",
      status: "accepted",
      paymentStatus: "pending",
      createdAt: "2025-01-12T10:00:00Z",
      updatedAt: "2025-01-12T11:30:00Z",
      acceptedAt: "2025-01-12T11:30:00Z",
      userRole: "sender"
    },
    {
      id: 2,
      tripId: 2,
      senderId: 3,
      travelerId: 1,
      senderName: "Emma Wilson",
      travelerName: "Alex Kim",
      fromCity: "Los Angeles",
      toCity: "Tokyo",
      departureDate: "2025-01-25",
      weight: 5,
      reward: 60,
      message: "Documents and small gifts for family",
      status: "pending",
      createdAt: "2025-01-12T09:00:00Z",
      updatedAt: "2025-01-12T09:00:00Z",
      expiresAt: "2025-01-13T09:00:00Z",
      userRole: "traveler"
    },
    {
      id: 3,
      tripId: 1,
      senderId: 1,
      travelerId: 2,
      senderName: "Alex Kim",
      travelerName: "Sarah Chen",
      fromCity: "Chicago",
      toCity: "Paris",
      departureDate: "2025-01-18",
      weight: 2,
      reward: 12,
      status: "confirmed",
      paymentStatus: "succeeded",
      escrowStatus: "held",
      createdAt: "2025-01-10T14:00:00Z",
      updatedAt: "2025-01-10T16:00:00Z",
      acceptedAt: "2025-01-10T14:30:00Z",
      paidAt: "2025-01-10T16:00:00Z",
      userRole: "sender"
    }
  ];

  const { data: requests = mockRequests, isLoading } = useQuery<MatchRequest[]>({
    queryKey: ["/api/match-requests"],
    enabled: false, // Using mock data
  });

  const acceptMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return apiRequest(`/api/match-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "accepted" }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request accepted!",
        description: "The sender has been notified and can now proceed with payment.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return apiRequest(`/api/match-requests/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "declined" }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request declined",
        description: "The sender has been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
    },
  });

  const senderRequests = requests.filter(r => r.userRole === "sender");
  const travelerRequests = requests.filter(r => r.userRole === "traveler");

  const RequestCard = ({ request }: { request: MatchRequest }) => {
    const isSender = request.userRole === "sender";
    const showPayButton = isSender && request.status === "accepted" && request.paymentStatus !== "succeeded";
    const showAcceptDecline = !isSender && request.status === "pending";

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {request.fromCity} → {request.toCity}
              </CardTitle>
              <CardDescription className="mt-1">
                Departure: {format(new Date(request.departureDate), "MMM d, yyyy")}
              </CardDescription>
            </div>
            <MatchStatusBadge 
              status={request.status} 
              paymentStatus={request.paymentStatus}
              escrowStatus={request.escrowStatus}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Escrow Banner */}
          <EscrowBanner escrowStatus={request.escrowStatus} />

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {isSender ? "Traveler" : "Sender"}
              </p>
              <p className="font-medium">
                {isSender ? request.travelerName : request.senderName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Package Details</p>
              <p className="font-medium">{request.weight}kg - ${request.reward}</p>
            </div>
          </div>

          {request.message && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-600">{request.message}</p>
              </div>
            </div>
          )}

          {/* Timeline Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Requested {formatDistanceToNow(new Date(request.createdAt))} ago</span>
            </div>
            {request.expiresAt && request.status === "pending" && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-3 w-3" />
                <span>Expires in {formatDistanceToNow(new Date(request.expiresAt))}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showPayButton && (
              <Button 
                className="flex-1"
                onClick={() => navigate(`/checkout/${request.id}`)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ${request.reward}
              </Button>
            )}
            {showAcceptDecline && (
              <>
                <Button 
                  className="flex-1"
                  onClick={() => acceptMutation.mutate(request.id)}
                  disabled={acceptMutation.isPending}
                >
                  Accept Request
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => declineMutation.mutate(request.id)}
                  disabled={declineMutation.isPending}
                >
                  Decline
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/match-requests/${request.id}`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-h1 text-airbar-black">Match Requests</h1>
          <p className="text-gray-600 mt-1">Manage your package delivery requests</p>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Travelers have 24 hours to respond to requests. Accepted requests must be paid within 1 hour.
          </AlertDescription>
        </Alert>

        {/* Tabs for Sender/Traveler Views */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "sender" | "traveler")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sender">
              As Sender ({senderRequests.length})
            </TabsTrigger>
            <TabsTrigger value="traveler">
              As Traveler ({travelerRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sender" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue mx-auto"></div>
              </div>
            ) : senderRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No package requests yet</p>
                  <Link href="/marketplace/trips">
                    <Button className="mt-4">Browse Trips</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {senderRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="traveler" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue mx-auto"></div>
              </div>
            ) : travelerRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No delivery requests received</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {travelerRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}