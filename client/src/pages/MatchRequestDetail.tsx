import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, MapPin, Package, DollarSign, User, Clock, Shield, CheckCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";

type MatchRequestDetail = {
  id: number;
  tripId: number;
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
  status: string;
  paymentStatus?: string;
  escrowStatus?: string;
  acceptedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};

export default function MatchRequestDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  // Mock data
  const mockRequest: MatchRequestDetail = {
    id: parseInt(id || "1"),
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
    status: "confirmed",
    paymentStatus: "succeeded",
    escrowStatus: "held",
    acceptedAt: "2025-01-12T11:30:00Z",
    paidAt: "2025-01-12T12:00:00Z",
    createdAt: "2025-01-12T10:00:00Z",
    updatedAt: "2025-01-12T12:00:00Z"
  };

  const { data: request = mockRequest, isLoading } = useQuery<MatchRequestDetail>({
    queryKey: [`/api/match-requests/${id}`],
    enabled: false, // Using mock data
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/match-requests")}>
          ← Back to match requests
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Match Request #{request.id}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {request.fromCity} → {request.toCity}
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                {request.status === "confirmed" && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmed
                  </Badge>
                )}
                {request.escrowStatus === "held" && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Escrow Held
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Escrow Banner */}
            {request.escrowStatus === "held" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Payment Secured in Escrow</p>
                    <p className="text-sm text-green-600 mt-1">
                      ${request.reward} is held securely and will be released after successful delivery
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Sender</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {request.senderName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Package Details</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Package className="h-4 w-4" />
                    {request.weight}kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure Date</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(request.departureDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Traveler</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {request.travelerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reward Amount</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4" />
                    ${request.reward}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium text-green-600">Paid</p>
                </div>
              </div>
            </div>

            {request.message && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Package Description</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm">{request.message}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium">Request Created</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(request.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                {request.acceptedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Request Accepted</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(request.acceptedAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
                {request.paidAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="font-medium">Payment Completed</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(request.paidAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">
                View Tracking
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}