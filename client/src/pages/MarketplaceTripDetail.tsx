import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MapPin, Package, DollarSign, User, Shield, Star, Clock, AlertTriangle, CheckCircle2, MessageSquare, Weight, Plane } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

type TripDetail = {
  id: number;
  userId: number;
  travelerName: string;
  travelerRating: number;
  travelerVerified: boolean;
  travelerPhoto?: string;
  fromCity: string;
  toCity: string;
  fromAirport?: string;
  toAirport?: string;
  departureDate: string;
  arrivalDate: string;
  maxWeight: number;
  pricePerKg: number;
  availableSpace: number;
  status: string;
  tripType: "one-way" | "round-trip";
  totalRequests: number;
  tripDetails?: string;
  prohibitedItems?: string[];
  acceptedSizes?: string[];
  travelerBio?: string;
  completedTrips?: number;
  responseTime?: string;
  verificationDate?: string;
};

export default function MarketplaceTripDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestWeight, setRequestWeight] = useState("1");
  const [requestMessage, setRequestMessage] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Mock data for demonstration
  const mockTrip: TripDetail = {
    id: parseInt(id || "1"),
    userId: 2,
    travelerName: "Sarah Chen",
    travelerRating: 4.9,
    travelerVerified: true,
    travelerPhoto: "/api/placeholder/100/100",
    fromCity: "New York",
    toCity: "London",
    fromAirport: "JFK International Airport",
    toAirport: "Heathrow Airport",
    departureDate: "2025-01-20T14:30:00",
    arrivalDate: "2025-01-21T07:45:00",
    maxWeight: 15,
    pricePerKg: 8,
    availableSpace: 12,
    status: "active",
    tripType: "one-way",
    totalRequests: 3,
    tripDetails: "I'm traveling for a business conference and have extra luggage space. Happy to help with small to medium packages. I'll be staying near Central London.",
    prohibitedItems: ["Liquids over 100ml", "Batteries", "Perishable foods", "Fragile items"],
    acceptedSizes: ["Small (up to 5kg)", "Medium (5-10kg)", "Large (10-15kg)"],
    travelerBio: "Frequent business traveler with 50+ successful deliveries. I understand the importance of handling packages with care.",
    completedTrips: 52,
    responseTime: "Usually responds within 2 hours",
    verificationDate: "2024-06-15"
  };

  const { data: trip = mockTrip, isLoading } = useQuery<TripDetail>({
    queryKey: [`/api/marketplace/trips/${id}`],
    enabled: false, // Using mock data for now
  });

  const requestMatchMutation = useMutation({
    mutationFn: async (data: { tripId: number; weight: number; message: string; reward: number }) => {
      return apiRequest("/api/match-requests", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Match request sent!",
        description: "The traveler will review your request and respond soon.",
      });
      setShowRequestModal(false);
      queryClient.invalidateQueries({ queryKey: [`/api/marketplace/trips/${id}`] });
      navigate("/match-requests");
    },
    onError: () => {
      toast({
        title: "Failed to send request",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleWeightChange = (weight: string) => {
    setRequestWeight(weight);
    const weightNum = parseFloat(weight) || 0;
    setCalculatedPrice(weightNum * trip.pricePerKg);
  };

  const handleRequestSubmit = () => {
    const weight = parseFloat(requestWeight);
    if (weight <= 0 || weight > trip.availableSpace) {
      toast({
        title: "Invalid weight",
        description: `Please enter a weight between 0 and ${trip.availableSpace}kg`,
        variant: "destructive",
      });
      return;
    }

    requestMatchMutation.mutate({
      tripId: trip.id,
      weight,
      message: requestMessage,
      reward: calculatedPrice,
    });
  };

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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/marketplace/trips")}>
          ← Back to trips
        </Button>

        {/* Main Trip Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Route & Date Info */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-airbar-blue" />
                    <h1 className="text-2xl font-bold">{trip.fromCity} → {trip.toCity}</h1>
                    {trip.tripType === "round-trip" && (
                      <Badge variant="secondary">Round Trip</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 ml-7 space-y-1">
                    {trip.fromAirport && <p>From: {trip.fromAirport}</p>}
                    {trip.toAirport && <p>To: {trip.toAirport}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="font-medium">{format(new Date(trip.departureDate), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-gray-400 rotate-90" />
                    <div>
                      <p className="text-sm text-gray-600">Arrival</p>
                      <p className="font-medium">{format(new Date(trip.arrivalDate), "MMM d, h:mm a")}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Capacity & Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Available Space</span>
                    </div>
                    <p className="text-2xl font-bold text-airbar-blue">{trip.availableSpace}kg</p>
                    <p className="text-sm text-gray-500">of {trip.maxWeight}kg total</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Price per kg</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${trip.pricePerKg}</p>
                    <p className="text-sm text-gray-500">competitive rate</p>
                  </div>
                </div>

                {trip.totalRequests > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <p className="text-sm text-orange-800">
                        {trip.totalRequests} other senders have requested this trip
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Traveler Info */}
              <div className="space-y-4">
                <Card className="bg-gray-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trip.travelerPhoto} />
                        <AvatarFallback>{trip.travelerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{trip.travelerName}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium ml-1">{trip.travelerRating}</span>
                          </div>
                          {trip.travelerVerified && (
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">{trip.travelerBio}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completed trips</span>
                        <span className="font-medium">{trip.completedTrips}</span>
                      </div>
                      {trip.responseTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Response time</span>
                          <span className="font-medium">{trip.responseTime}</span>
                        </div>
                      )}
                      {trip.verificationDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Verified since</span>
                          <span className="font-medium">{format(new Date(trip.verificationDate), "MMM yyyy")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setShowRequestModal(true);
                    handleWeightChange(requestWeight);
                  }}
                >
                  Request Match
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            <TabsTrigger value="sizes">Accepted Sizes</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About this trip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{trip.tripDetails}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="restrictions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prohibited Items</CardTitle>
                <CardDescription>The traveler cannot accept these items</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trip.prohibitedItems?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sizes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accepted Package Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trip.acceptedSizes?.map((size, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{size}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Match Request Modal */}
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request a Match</DialogTitle>
              <DialogDescription>
                Send a request to {trip.travelerName} for package delivery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="weight">Package Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={requestWeight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  min="0.1"
                  max={trip.availableSpace}
                  step="0.1"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum: {trip.availableSpace}kg available
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated reward</span>
                  <span className="text-2xl font-bold text-airbar-blue">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {requestWeight}kg × ${trip.pricePerKg}/kg
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message to traveler (optional)</Label>
                <Textarea
                  id="message"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Describe your package and any special instructions..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRequestSubmit}
                disabled={requestMatchMutation.isPending}
              >
                {requestMatchMutation.isPending ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}