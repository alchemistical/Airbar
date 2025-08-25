import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "../lib/queryClient";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { MapPin, Package, DollarSign, Shield, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import DashboardLayout from "../components/layout/DashboardLayout";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

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
};

const CheckoutForm = ({ matchId, onSuccess }: { matchId: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/match-requests/${matchId}`,
      },
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "An error occurred during payment");
      setIsProcessing(false);
    } else {
      // Payment succeeded
      toast({
        title: "Payment successful!",
        description: "Funds have been secured in escrow.",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Secure Escrow Protection</p>
            <p className="text-blue-700 mt-1">
              Your payment will be held securely until the package is delivered. 
              Funds are only released to the traveler after you confirm receipt.
            </p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Payment"
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { matchId } = useParams<{ matchId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Authentication guard
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  // Mock match request data
  const mockMatchRequest: MatchRequestDetail = {
    id: parseInt(matchId || "1"),
    tripId: 1,
    senderId: parseInt(user.id.toString()), // Use authenticated user as sender
    travelerId: 456, // Mock traveler ID for this match
    senderName: "Alex Kim",
    travelerName: "Sarah Chen",
    fromCity: "New York",
    toCity: "London",
    departureDate: "2025-01-20",
    weight: 3.5,
    reward: 28,
    message: "Small electronics package, well-wrapped. No liquids.",
    status: "accepted",
    acceptedAt: "2025-01-12T11:30:00Z"
  };

  const { data: matchRequest = mockMatchRequest, isLoading } = useQuery<MatchRequestDetail>({
    queryKey: [`/api/match-requests/${matchId}`],
    enabled: false, // Using mock data
  });

  // Create payment intent
  useEffect(() => {
    if (!matchId) return;

    // Mock payment intent creation
    apiRequest("/api/payments/checkout-session", {
      method: "POST",
      body: JSON.stringify({
        matchRequestId: matchId,
        amount: matchRequest.reward,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Mock client secret for demo
        setClientSecret(data.clientSecret || "pi_mock_secret_" + matchId);
      })
      .catch((err) => {
        toast({
          title: "Failed to initialize payment",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
        console.error("Payment init error:", err);
      });
  }, [matchId, matchRequest.reward, toast]);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      navigate(`/match-requests/${matchId}`);
    }, 2000);
  };

  if (isLoading || !clientSecret) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-airbar-blue mx-auto mb-4" />
            <p className="text-gray-500">Preparing secure checkout...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (paymentComplete) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Funds have been secured in escrow. Redirecting...
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Payment</CardTitle>
                <CardDescription>
                  Secure checkout powered by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0F5A9F',
                      },
                    },
                  }}
                >
                  <CheckoutForm 
                    matchId={matchId || ""} 
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>

          {/* Match Request Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Route
                  </div>
                  <p className="font-semibold mt-1">
                    {matchRequest.fromCity} → {matchRequest.toCity}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    Package Details
                  </div>
                  <p className="font-semibold mt-1">
                    {matchRequest.weight}kg
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    Traveler
                  </div>
                  <p className="font-semibold mt-1">
                    {matchRequest.travelerName}
                  </p>
                </div>

                <Separator />

                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-airbar-blue">
                      ${matchRequest.reward}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Includes escrow protection
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Payment Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>✓ SSL encrypted payment</p>
                <p>✓ Funds held in secure escrow</p>
                <p>✓ Released only after delivery</p>
                <p>✓ Full dispute resolution support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}