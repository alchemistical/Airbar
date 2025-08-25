import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Package, MapPin, Calendar, Weight, DollarSign, AlertCircle } from "lucide-react";

interface MatchRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: {
    id: number;
    userId: number;
    fromCity: string;
    toCity: string;
    departureDate: string;
    arrivalDate?: string;
    maxWeight: string;
    pricePerKg: string;
    travelerName: string;
    travelerRating: string;
    travelerVerified: boolean;
  };
}

const matchRequestSchema = z.object({
  weight: z.string()
    .min(1, "Weight is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Weight must be greater than 0")
    .refine((val) => parseFloat(val) <= 10, "Weight cannot exceed 10kg"),
  category: z.string().min(1, "Category is required"),
  packageDescription: z.string()
    .min(10, "Please provide a detailed description (at least 10 characters)")
    .max(500, "Description is too long"),
  message: z.string()
    .max(300, "Message is too long")
    .optional(),
});

type MatchRequestFormData = z.infer<typeof matchRequestSchema>;

export function MatchRequestModal({ open, onOpenChange, trip }: MatchRequestModalProps) {
  const { toast } = useToast();
  const [estimatedReward, setEstimatedReward] = useState("0.00");

  const form = useForm<MatchRequestFormData>({
    resolver: zodResolver(matchRequestSchema),
    defaultValues: {
      weight: "",
      category: "",
      packageDescription: "",
      message: "",
    },
  });

  const createMatchRequestMutation = useMutation({
    mutationFn: (data: MatchRequestFormData) => {
      const weight = parseFloat(data.weight);
      const reward = weight * parseFloat(trip.pricePerKg);

      return apiRequest("POST", "/api/match-requests", {
        tripId: trip.id,
        travelerId: trip.userId,
        weight: weight.toString(),
        reward: reward.toFixed(2),
        category: data.category,
        packageDescription: data.packageDescription,
        message: data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Match request sent!",
        description: "The traveler will be notified of your request.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/match-requests"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: MatchRequestFormData) => {
    createMatchRequestMutation.mutate(data);
  };

  const handleWeightChange = (value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      const weight = parseFloat(value);
      const reward = weight * parseFloat(trip.pricePerKg);
      setEstimatedReward(reward.toFixed(2));
    } else {
      setEstimatedReward("0.00");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Match Request</DialogTitle>
          <DialogDescription>
            Request {trip.travelerName} to carry your package from {trip.fromCity} to {trip.toCity}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Details */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Trip Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{trip.fromCity} → {trip.toCity}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(trip.departureDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Weight className="h-4 w-4" />
                <span>Max {trip.maxWeight}kg</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>${trip.pricePerKg}/kg</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Package Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Package Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            step="0.1" 
                            placeholder="0.0"
                            onChange={(e) => {
                              field.onChange(e);
                              handleWeightChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum: {trip.maxWeight}kg
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Electronics, Clothing" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="packageDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe what you're sending, its value, and any special handling instructions..."
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific about contents and handling requirements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message to Traveler (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Any additional information or special requests..."
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Cost Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h4 className="font-medium">Cost Summary</h4>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Estimated Reward:</span>
                  <span className="text-primary">${estimatedReward}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {form.watch("weight") || "0"}kg × ${trip.pricePerKg}/kg
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  By sending this request, you agree to pay the reward amount through our secure escrow system 
                  if the traveler accepts. The payment will be held until delivery is confirmed.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3">
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createMatchRequestMutation.isPending}
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  type="submit"
                  disabled={createMatchRequestMutation.isPending}
                >
                  {createMatchRequestMutation.isPending ? "Sending..." : "Send Request"}
                </AnimatedButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}