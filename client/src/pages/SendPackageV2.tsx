import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LocationSelect } from "@/components/form/LocationSelect";
import { WeightInput } from "@/components/form/WeightInput";
import { ParcelTypeSelector, type ParcelType } from "@/components/form/ParcelTypeSelector";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, 
  MapPin, 
  Calendar,
  DollarSign, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Plane,
  Calculator
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { type LocationResult } from "@/lib/locationService";
import { cn } from "@/lib/utils";

// Form schema for the optimized 4-step flow
const formSchema = z.object({
  // Step 1: Route
  origin: z.custom<LocationResult>().nullable().refine(val => val !== null, {
    message: "Origin is required"
  }),
  destination: z.custom<LocationResult>().nullable().refine(val => val !== null, {
    message: "Destination is required"
  }),
  
  // Step 2: Package Details
  parcelTypes: z.array(z.string()).min(1, "Select at least one package type"),
  weight: z.number().min(0.1, "Weight is required").max(30, "Maximum 30kg allowed"),
  description: z.string().min(10, "Description must be at least 10 characters").max(140, "Maximum 140 characters"),
  declaredValue: z.number().min(0, "Value must be positive").max(10000, "Maximum value $10,000"),
  
  // Step 3: Pickup & Drop-off
  pickupLocation: z.custom<LocationResult>().nullable().refine(val => val !== null, {
    message: "Pickup location is required"
  }),
  pickupDateStart: z.string().min(1, "Pickup date is required"),
  pickupDateEnd: z.string().min(1, "Pickup date is required"),
  dropoffFlexibility: z.number().min(0).max(2), // 0: exact, 1: ±3 days, 2: ±7 days
  fragile: z.boolean(),
  
  // Step 4: Review & Price (calculated fields)
  estimatedReward: z.number().optional(),
  savings: z.number().optional()
}).refine(data => data.origin?.id !== data.destination?.id, {
  message: "Origin and destination must be different",
  path: ["destination"]
});

type FormData = z.infer<typeof formSchema>;

const FLEXIBILITY_OPTIONS = [
  { value: 0, label: "Exact date", days: 0 },
  { value: 1, label: "±3 days", days: 3 },
  { value: 2, label: "±7 days", days: 7 }
];

export default function SendPackageV2() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routeRestrictions, setRouteRestrictions] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: null,
      destination: null,
      parcelTypes: [],
      weight: 0,
      description: "",
      declaredValue: 0,
      pickupLocation: null,
      pickupDateStart: "",
      pickupDateEnd: "",
      dropoffFlexibility: 1,
      fragile: false,
      estimatedReward: 0,
      savings: 0
    },
  });

  const watchOrigin = form.watch("origin");
  const watchDestination = form.watch("destination");
  const watchWeight = form.watch("weight");
  const watchParcelTypes = form.watch("parcelTypes");

  // Check route restrictions when route changes
  const checkRouteRestrictions = async () => {
    if (watchOrigin && watchDestination) {
      // Mock API call - in real app would fetch from backend
      const restrictions: string[] = [];
      if (watchOrigin.countryCode !== watchDestination.countryCode) {
        restrictions.push("liquids", "batteries");
      }
      setRouteRestrictions(restrictions);
    }
  };

  const calculateEstimates = () => {
    if (watchOrigin && watchDestination && watchWeight > 0) {
      // Mock calculation - in real app would use pricing API
      const basePrice = watchWeight * 5;
      const distance = Math.abs(watchOrigin.lat - watchDestination.lat) * 100;
      const estimatedReward = Math.round(basePrice + distance * 0.1);
      const traditionalCost = estimatedReward * 2.5;
      const savings = Math.round(((traditionalCost - estimatedReward) / traditionalCost) * 100);
      
      form.setValue("estimatedReward", estimatedReward);
      form.setValue("savings", savings);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["origin", "destination"];
        break;
      case 2:
        fieldsToValidate = ["parcelTypes", "weight", "description", "declaredValue"];
        break;
      case 3:
        fieldsToValidate = ["pickupLocation", "pickupDateStart", "pickupDateEnd"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 1) {
        await checkRouteRestrictions();
      }
      if (currentStep === 2) {
        calculateEstimates();
      }
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/debug/send-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      console.log("Package submitted successfully:", result);
      
      // Show success message
      alert("Package submitted successfully! Check console for details.");
      
      // Redirect to payment/escrow
      // setLocation("/dashboard/payment-checkout");
    } catch (error) {
      console.error("Error submitting package:", error);
      alert("Error submitting package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "flex items-center",
              step < 4 && "flex-1"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                currentStep >= step
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-gray-300 text-gray-500"
              )}
            >
              {currentStep > step ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div
                className={cn(
                  "h-1 flex-1 mx-2 transition-colors",
                  currentStep > step ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Route</span>
        <span>Details</span>
        <span>Pickup</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Where are you sending?</h2>
        <p className="text-gray-600">Tell us the origin and destination for your package</p>
      </div>

      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => (
          <FormItem>
            <LocationSelect
              label="From"
              required
              placeholder="Select origin city or airport"
              intent="send"
              scope="city_airport"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.origin?.message}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <LocationSelect
              label="To"
              required
              placeholder="Select destination city or airport"
              intent="send"
              scope="city_airport"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.destination?.message}
            />
          </FormItem>
        )}
      />

      {watchOrigin && watchDestination && (
        <Alert>
          <Plane className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">
                Route: {watchOrigin.primaryLabel} → {watchDestination.primaryLabel}
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Avg. savings: 65%</span>
                <span className="text-blue-600">Avg. reward: $25-45</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Package Details</h2>
        <p className="text-gray-600">Help travelers understand what they'll be carrying</p>
      </div>

      <FormField
        control={form.control}
        name="parcelTypes"
        render={({ field }) => (
          <FormItem>
            <ParcelTypeSelector
              value={field.value as ParcelType[]}
              onChange={field.onChange}
              required
              error={form.formState.errors.parcelTypes?.message}
            />
          </FormItem>
        )}
      />

      {routeRestrictions.length > 0 && Array.isArray(watchParcelTypes) && watchParcelTypes.some(t => routeRestrictions.includes(t)) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some selected items may be restricted on this route. Please review regulations.
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <WeightInput
              label="Package Weight"
              value={field.value}
              onChange={field.onChange}
              required
              error={form.formState.errors.weight?.message}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contents Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe the package contents..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{field.value.length}/140 characters</span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="declaredValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Declared Value (USD) *</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </div>
            </FormControl>
            <p className="text-xs text-gray-500 mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              Used for insurance. Values over $500 require additional verification.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Pickup & Delivery</h2>
        <p className="text-gray-600">Where and when should the traveler collect your package?</p>
      </div>

      <FormField
        control={form.control}
        name="pickupLocation"
        render={({ field }) => (
          <FormItem>
            <LocationSelect
              label="Pickup Location"
              required
              placeholder="Select or enter pickup address"
              intent="send"
              scope="city_airport"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.pickupLocation?.message}
            />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pickupDateStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available From *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pickupDateEnd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Until *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="dropoffFlexibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Flexibility</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Slider
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  min={0}
                  max={2}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  {FLEXIBILITY_OPTIONS.map((option) => (
                    <span
                      key={option.value}
                      className={cn(
                        "text-gray-500",
                        field.value === option.value && "text-primary font-medium"
                      )}
                    >
                      {option.label}
                    </span>
                  ))}
                </div>
              </div>
            </FormControl>
            <p className="text-xs text-gray-500 mt-1">
              More flexibility = more travelers = faster matching
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fragile"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded border-gray-300"
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                This package contains fragile items
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep4 = () => {
    const formData = form.getValues();
    const estimatedReward = formData.estimatedReward || 0;
    const savings = formData.savings || 0;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Review & Confirm</h2>
          <p className="text-gray-600">Check your package details before proceeding to payment</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Route Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{formData.origin?.primaryLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{formData.destination?.primaryLabel}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Type:</span>
              <div className="flex gap-1">
                {formData.parcelTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{formData.weight} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium">${formData.declaredValue}</span>
            </div>
            {formData.fragile && (
              <Badge variant="destructive" className="w-fit">
                <AlertCircle className="h-3 w-3 mr-1" />
                Fragile
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-4 bg-primary/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Pricing Estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Traveler Reward:</span>
              <span className="font-bold text-primary">${estimatedReward}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Traditional Shipping:</span>
              <span className="line-through text-gray-400">${estimatedReward * 2.5}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Savings:</span>
                <span className="text-green-600 font-bold">{savings}% OFF</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Payment will be held in escrow until successful delivery. You'll receive tracking updates throughout the journey.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Send a Package</h1>
              <p className="text-gray-600">Connect with travelers heading your way</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {renderProgressBar()}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderCurrentStep()}
                
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Proceed to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}