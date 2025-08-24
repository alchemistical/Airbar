import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddTripForm from "@/components/trips/AddTripForm";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTripSchema } from "@shared/schema";

export default function AddTrip() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTripMutation = useMutation({
    mutationFn: async (tripData: any) => {
      // Transform enhanced form data to match current API schema
      const apiData = {
        userId: 1, // Demo user ID
        fromCity: tripData.fromAirport || tripData.fromCity || "",
        toCity: tripData.toAirport || tripData.toCity || "",
        departureDate: new Date(tripData.departureDate).toISOString(),
        arrivalDate: tripData.returnDate ? new Date(tripData.returnDate).toISOString() : 
                     tripData.arrivalDate ? new Date(tripData.arrivalDate).toISOString() : null,
        status: "active",
        maxWeight: tripData.luggageSpace?.includes("kg") ? 
          parseFloat(tripData.luggageSpace.replace(/[^\d.-]/g, "")) || 10.0 : 10.0,
        pricePerKg: 5.0, // Default pricing
      };

      return apiRequest("/api/trips", {
        method: "POST",
        body: JSON.stringify(apiData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Trip created successfully!",
        description: "Your trip has been published and is now visible to senders.",
      });
      
      // Invalidate trips cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/trips/1"] });
      
      // Navigate back to trips list
      setLocation("/dashboard/traveler/trips");
    },
    onError: (error) => {
      toast({
        title: "Failed to create trip",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
      console.error("Trip creation error:", error);
    },
  });

  const handleSubmit = (formData: any) => {
    createTripMutation.mutate(formData);
  };

  const handleCancel = () => {
    setLocation("/dashboard/traveler/trips");
  };

  return (
    <DashboardLayout>
      <AddTripForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
      />
    </DashboardLayout>
  );
}