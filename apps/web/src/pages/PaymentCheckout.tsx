import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Package,
  MapPin,
  Calendar,
  Weight,
  DollarSign,
  AlertCircle,
  Clock,
  Shield,
} from "lucide-react";
import { format } from "date-fns";

interface MatchRequestDetail {
  id: number;
  tripId: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  weight: string;
  reward: string;
  message?: string;
  status: string;
  paymentStatus?: string;
  escrowStatus?: string;
  acceptedAt?: string;
}

export default function PaymentCheckout() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: matchRequest, isLoading } = useQuery<MatchRequestDetail>({
    queryKey: ["/api/match-requests", id],
    queryFn: async () => {
      const response = await fetch(`/api/match-requests/${id}`);
      if (!response.ok) throw new Error("Failed to fetch match request");
      return response.json();
    },
    enabled: !!id,
  });

  const createPaymentSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/payments/checkout-session", {
        matchRequestId: id,
        amount: matchRequest?.reward,
      });
    },
    onSuccess: async data => {
      // In a real implementation, this would redirect to Stripe Checkout
      // For demo, we'll simulate a successful payment
      setIsProcessing(true);

      // Simulate payment processing
      setTimeout(async () => {
        try {
          await processPaymentMutation.mutateAsync();
        } catch (error) {
          setIsProcessing(false);
        }
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/match-requests/${id}/pay`, {
        paymentIntentId: `pi_mock_${id}`,
      });
    },
    onSuccess: data => {
      toast({
        title: "Payment Successful!",
        description:
          "Your payment has been processed and funds are held in escrow.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      navigate(`/dashboard/matches/${data.match.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (matchRequest && matchRequest.status !== "accepted") {
      toast({
        title: "Invalid Request",
        description: "This match request is not ready for payment.",
        variant: "destructive",
      });
      navigate("/dashboard/match-requests");
    }
  }, [matchRequest, navigate, toast]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!matchRequest) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Match request not found
            </h3>
            <Button onClick={() => navigate("/dashboard/match-requests")}>
              Back to Requests
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const acceptedTime = matchRequest.acceptedAt
    ? new Date(matchRequest.acceptedAt)
    : new Date();
  const expiresAt = new Date(acceptedTime.getTime() + 60 * 60 * 1000); // 1 hour from acceptance
  const timeRemaining = Math.max(0, expiresAt.getTime() - Date.now());
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Complete Payment</CardTitle>
            <CardDescription>
              Pay securely to confirm your delivery with{" "}
              {matchRequest.travelerName}
            </CardDescription>
          </CardHeader>
        </Card>

        {timeRemaining > 0 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Complete payment within {minutesRemaining} minutes to secure this
              match
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <h3 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Delivery Details
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {matchRequest.fromCity} → {matchRequest.toCity}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Travel Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(matchRequest.departureDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Package Weight</p>
                <p className="font-medium flex items-center gap-1">
                  <Weight className="h-4 w-4" />
                  {matchRequest.weight}kg
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Traveler</p>
                <p className="font-medium">{matchRequest.travelerName}</p>
              </div>
            </div>

            {matchRequest.message && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Your Message</p>
                <p className="text-sm">{matchRequest.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-medium">Payment Summary</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Delivery Reward</span>
              <span className="font-medium">${matchRequest.reward}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Service Fee (5%)</span>
              <span className="font-medium">
                ${(parseFloat(matchRequest.reward) * 0.05).toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">
                ${(parseFloat(matchRequest.reward) * 1.05).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Escrow Protection
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Your payment will be held securely until delivery is confirmed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Funds are only released after you verify package receipt
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Dispute resolution available if issues arise
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/match-requests")}
            disabled={isProcessing || createPaymentSessionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => createPaymentSessionMutation.mutate()}
            disabled={
              isProcessing ||
              createPaymentSessionMutation.isPending ||
              timeRemaining === 0
            }
          >
            {isProcessing || createPaymentSessionMutation.isPending ? (
              <>Processing...</>
            ) : (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Pay ${(parseFloat(matchRequest.reward) * 1.05).toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
