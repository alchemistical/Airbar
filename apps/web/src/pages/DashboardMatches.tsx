import { useState } from "react";
import { useParams, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { EscrowBanner } from "@/components/EscrowBanner";
import { TrackingStepper, TrackingStep } from "@/components/TrackingStepper";
import {
  MapPin,
  Calendar,
  Package,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Camera,
  FileText,
  User,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Match {
  id: number;
  matchRequestId: number;
  tripId: number;
  parcelId: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  senderRating: number;
  travelerRating: number;
  senderVerified: boolean;
  travelerVerified: boolean;
  fromCity: string;
  toCity: string;
  departureDate: string;
  weight: number;
  reward: number;
  category: string;
  packageDescription: string;
  status: "confirmed" | "in_transit" | "delivered" | "disputed";
  trackingStep: TrackingStep;
  escrowStatus: "held" | "pending_release" | "released";
  escrowAmount: number;
  pickupCode: string;
  deliveryCode: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupTime?: string;
  pickupPhotos?: string[];
  deliveryPhotos?: string[];
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export default function DashboardMatches() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams<{matchId: string}>();
  const matchId = params.matchId;
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">("sender");
  const [pickupNotes, setPickupNotes] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Mock data - would come from API
  const mockMatches: Match[] = [
    {
      id: 1,
      matchRequestId: 3,
      tripId: 3,
      parcelId: 3,
      senderId: 1,
      travelerId: 404, // Mock traveler ID
      senderName: "Alex Kim",
      travelerName: "Emma Davis",
      senderRating: 4.8,
      travelerRating: 5.0,
      senderVerified: true,
      travelerVerified: false,
      fromCity: "Boston, MA",
      toCity: "Seattle, WA",
      departureDate: "2025-01-28",
      weight: 8,
      reward: 120,
      category: "gifts",
      packageDescription: "Birthday gifts for family - fragile items",
      status: "confirmed",
      trackingStep: "picked_up",
      escrowStatus: "held",
      escrowAmount: 120,
      pickupCode: "PKP-4892",
      deliveryCode: "DLV-7623",
      pickupAddress: "123 Main St, Boston, MA 02101",
      deliveryAddress: "456 Pine St, Seattle, WA 98101",
      pickupTime: "2025-01-28T08:00:00Z",
      createdAt: "2025-01-15T16:00:00Z",
      pickedUpAt: "2025-01-28T08:30:00Z",
    },
    {
      id: 2,
      matchRequestId: 4,
      tripId: 5,
      parcelId: 5,
      senderId: 2,
      travelerId: 401, // Mock traveler ID
      senderName: "Sarah Chen",
      travelerName: "Alex Kim",
      senderRating: 4.9,
      travelerRating: 4.8,
      senderVerified: true,
      travelerVerified: true,
      fromCity: "New York, NY",
      toCity: "Los Angeles, CA",
      departureDate: "2025-01-30",
      weight: 3,
      reward: 45,
      category: "documents",
      packageDescription: "Legal documents - waterproof envelope",
      status: "confirmed",
      trackingStep: "picked_up",
      escrowStatus: "held",
      escrowAmount: 45,
      pickupCode: "PKP-2847",
      deliveryCode: "DLV-9384",
      createdAt: "2025-01-16T10:00:00Z",
    },
  ];

  const confirmPickupMutation = useMutation({
    mutationFn: async (data: {
      matchId: number;
      notes: string;
      photos?: File[];
    }) => {
      return apiRequest("POST", `/api/matches/${data.matchId}/pickup`, {
        notes: data.notes,
        photos: data.photos,
      });
    },
    onSuccess: () => {
      toast({
        title: "Pickup confirmed!",
        description: "Package is now in transit.",
      });
      setShowPickupModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: async (data: {
      matchId: number;
      notes: string;
      photos?: File[];
    }) => {
      return apiRequest("POST", `/api/matches/${data.matchId}/delivery`, {
        notes: data.notes,
        photos: data.photos,
      });
    },
    onSuccess: () => {
      toast({
        title: "Delivery confirmed!",
        description: "Escrow will be released to the traveler.",
      });
      setShowDeliveryModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
  });

  // Filter matches based on active tab
  const filteredMatches = mockMatches.filter(match =>
    activeTab === "sender"
      ? match.senderId === parseInt(user.id)
      : match.travelerId === parseInt(user.id)
  );

  if (matchId) {
    // Single match detail view
    const match = mockMatches.find(m => m.id === parseInt(matchId));
    if (!match) return <div>Match not found</div>;

    const isUserSender = match.senderId === parseInt(user.id);
    const canConfirmPickup =
      !isUserSender && match.trackingStep === "picked_up" && !match.pickedUpAt;
    const canConfirmDelivery =
      isUserSender && match.trackingStep === "in_transit";

    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard/matches">
                <AnimatedButton variant="ghost" size="sm" className="mb-2">
                  ← Back to Matches
                </AnimatedButton>
              </Link>
              <h1 className="text-h1">Match Details</h1>
            </div>
            <MatchStatusBadge status={match.status} />
          </div>

          {/* Escrow Banner */}
          <EscrowBanner
            amount={match.escrowAmount}
            status={match.escrowStatus}
            releaseDate={
              match.deliveredAt ? new Date(match.deliveredAt) : undefined
            }
          />

          {/* Tracking Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackingStepper currentStep={match.trackingStep} />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-secondary">Picked Up</p>
                  <p className="font-medium">
                    {match.pickedUpAt
                      ? format(new Date(match.pickedUpAt), "MMM d, h:mm a")
                      : "Pending"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-secondary">In Transit</p>
                  <p className="font-medium">
                    {match.trackingStep === "in_transit" ||
                    match.trackingStep === "delivered"
                      ? "Active"
                      : "—"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-secondary">Delivered</p>
                  <p className="font-medium">
                    {match.deliveredAt
                      ? format(new Date(match.deliveredAt), "MMM d, h:mm a")
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Match Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Route & Package Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Route */}
                  <div>
                    <h4 className="font-medium mb-3">Route Details</h4>
                    <div className="space-y-3">
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
                          <span className="text-secondary">Travel Date</span>
                        </div>
                        <span>
                          {format(new Date(match.departureDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Package */}
                  <div>
                    <h4 className="font-medium mb-3">Package Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-secondary">Weight</span>
                        </div>
                        <span className="font-medium">{match.weight}kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Category</span>
                        <Badge variant="secondary">{match.category}</Badge>
                      </div>
                      <div>
                        <p className="text-secondary mb-2">Description</p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">
                          {match.packageDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Codes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Pickup Code</p>
                      <p className="font-mono font-bold text-lg">
                        {match.pickupCode}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">
                        Delivery Code
                      </p>
                      <p className="font-mono font-bold text-lg">
                        {match.deliveryCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              {(match.pickupAddress || match.deliveryAddress) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {match.pickupAddress && (
                      <div>
                        <p className="text-sm text-secondary mb-1">
                          Pickup Address
                        </p>
                        <p className="font-medium">{match.pickupAddress}</p>
                        {match.pickupTime && (
                          <p className="text-sm text-secondary mt-1">
                            Scheduled:{" "}
                            {format(
                              new Date(match.pickupTime),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        )}
                      </div>
                    )}
                    {match.deliveryAddress && (
                      <div>
                        <p className="text-sm text-secondary mb-1">
                          Delivery Address
                        </p>
                        <p className="font-medium">{match.deliveryAddress}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Participants & Actions */}
            <div className="space-y-6">
              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sender */}
                  <div className="space-y-3">
                    <p className="text-sm text-secondary">Sender</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{match.senderName}</p>
                          {match.senderVerified && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{match.senderRating}</span>
                        </div>
                      </div>
                    </div>
                    {isUserSender && (
                      <div className="flex space-x-2">
                        <AnimatedButton size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </AnimatedButton>
                        <AnimatedButton size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </AnimatedButton>
                      </div>
                    )}
                  </div>

                  {/* Traveler */}
                  <div className="space-y-3">
                    <p className="text-sm text-secondary">Traveler</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{match.travelerName}</p>
                          {match.travelerVerified && (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{match.travelerRating}</span>
                        </div>
                      </div>
                    </div>
                    {!isUserSender && (
                      <div className="flex space-x-2">
                        <AnimatedButton size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </AnimatedButton>
                        <AnimatedButton size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </AnimatedButton>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canConfirmPickup && (
                    <Dialog
                      open={showPickupModal}
                      onOpenChange={setShowPickupModal}
                    >
                      <DialogTrigger asChild>
                        <AnimatedButton className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Pickup
                        </AnimatedButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Package Pickup</DialogTitle>
                          <DialogDescription>
                            Verify the pickup code and take photos of the
                            package
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Pickup Notes</Label>
                            <Textarea
                              placeholder="Package condition, any issues..."
                              value={pickupNotes}
                              onChange={e => setPickupNotes(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Package Photos</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-secondary">
                                Upload photos
                              </p>
                            </div>
                          </div>
                          <AnimatedButton
                            className="w-full"
                            onClick={() =>
                              confirmPickupMutation.mutate({
                                matchId: match.id,
                                notes: pickupNotes,
                              })
                            }
                            disabled={confirmPickupMutation.isPending}
                          >
                            Confirm Pickup
                          </AnimatedButton>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {canConfirmDelivery && (
                    <Dialog
                      open={showDeliveryModal}
                      onOpenChange={setShowDeliveryModal}
                    >
                      <DialogTrigger asChild>
                        <AnimatedButton className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Delivery
                        </AnimatedButton>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Package Delivery</DialogTitle>
                          <DialogDescription>
                            Verify the delivery code and confirm receipt
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Delivery Notes</Label>
                            <Textarea
                              placeholder="Confirmation of receipt, condition..."
                              value={deliveryNotes}
                              onChange={e => setDeliveryNotes(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Delivery Photos</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-secondary">
                                Upload proof of delivery
                              </p>
                            </div>
                          </div>
                          <AnimatedButton
                            className="w-full"
                            onClick={() =>
                              confirmDeliveryMutation.mutate({
                                matchId: match.id,
                                notes: deliveryNotes,
                              })
                            }
                            disabled={confirmDeliveryMutation.isPending}
                          >
                            Confirm Delivery
                          </AnimatedButton>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <AnimatedButton variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Receipt
                  </AnimatedButton>

                  {match.status === "delivered" && (
                    <AnimatedButton
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report Issue
                    </AnimatedButton>
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
          <h1 className="text-h1">Active Matches</h1>
          <p className="text-secondary mt-2">
            Track and manage your confirmed deliveries
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
              {filteredMatches.map(match => (
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
                  <CardContent className="space-y-4">
                    {/* Package Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary">Package</span>
                        <span className="font-medium">
                          {match.weight}kg - {match.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary">Reward</span>
                        <span className="font-medium text-primary">
                          ${match.reward}
                        </span>
                      </div>
                    </div>

                    {/* Other Party */}
                    <div>
                      <p className="text-sm text-secondary mb-2">
                        {activeTab === "sender" ? "Traveler" : "Sender"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {activeTab === "sender"
                              ? match.travelerName
                              : match.senderName}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">
                              {activeTab === "sender"
                                ? match.travelerRating
                                : match.senderRating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Mini */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            match.trackingStep === "picked_up"
                              ? "text-primary font-medium"
                              : "text-gray-400"
                          }
                        >
                          Picked Up
                        </span>
                        <span
                          className={
                            match.trackingStep === "in_transit"
                              ? "text-primary font-medium"
                              : "text-gray-400"
                          }
                        >
                          In Transit
                        </span>
                        <span
                          className={
                            match.trackingStep === "delivered"
                              ? "text-primary font-medium"
                              : "text-gray-400"
                          }
                        >
                          Delivered
                        </span>
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{
                            width:
                              match.trackingStep === "picked_up"
                                ? "33%"
                                : match.trackingStep === "in_transit"
                                  ? "66%"
                                  : match.trackingStep === "delivered"
                                    ? "100%"
                                    : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <Link href={`/dashboard/matches/${match.id}`}>
                      <AnimatedButton variant="outline" className="w-full">
                        View Details
                      </AnimatedButton>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <Card className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No active matches</h3>
                <p className="text-secondary mb-4">
                  {activeTab === "sender"
                    ? "Your accepted packages will appear here"
                    : "Packages you're delivering will appear here"}
                </p>
                <Link href="/match-requests">
                  <AnimatedButton variant="outline">View Match Requests</AnimatedButton>
                </Link>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
