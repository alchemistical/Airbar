import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LocationSelect } from "@/components/form/LocationSelect";
import { WeightInput } from "@/components/form/WeightInput";
import { ParcelTypeSelector, type ParcelType } from "@/components/form/ParcelTypeSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plane, 
  Luggage,
  Package,
  Clock,
  Calculator,
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Info,
  AlertCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { type LocationResult } from "@/lib/locationService";
import { cn } from "@/lib/utils";

// Form schema for the optimized 5-step flow
const formSchema = z.object({
  // Step 1: Flight Info
  departureAirport: z.custom<LocationResult>().nullable().refine(val => val !== null, {
    message: "Departure airport is required"
  }),
  arrivalAirport: z.custom<LocationResult>().nullable().refine(val => val !== null, {
    message: "Arrival airport is required"
  }),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  
  // Step 2: Luggage Space
  spaceAvailable: z.number().min(1, "Available space is required").max(50, "Maximum 50kg"),
  bagType: z.array(z.string()).min(1, "Select at least one bag type"),
  numberOfBags: z.number().min(1).max(5),
  additionalNotes: z.string().max(200).optional(),
  
  // Step 3: Acceptable Parcel Types
  acceptableTypes: z.array(z.string()).min(1, "Select at least one parcel type"),
  restrictedItems: z.string().max(200).optional(),
  
  // Step 4: Delivery Preferences
  preferredDropoff: z.enum(["airport", "hotel", "flexible"]),
  availabilityWindows: z.array(z.string()).min(1, "Select at least one time window"),
  flexibilityLevel: z.number().min(0).max(2),
  expectedDeliveryDate: z.string().optional(),
  
  // Step 5: Pricing (calculated)
  minReward: z.number().min(5).max(500),
  pricePerKg: z.number().optional()
}).refine(data => data.departureAirport?.id !== data.arrivalAirport?.id, {
  message: "Departure and arrival airports must be different",
  path: ["arrivalAirport"]
});

type FormData = z.infer<typeof formSchema>;

const BAG_TYPES = [
  { value: "carry_on", label: "Carry-on" },
  { value: "checked", label: "Checked" },
  { value: "both", label: "Both" }
];

const TIME_WINDOWS = [
  { value: "morning", label: "Morning (6AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
  { value: "evening", label: "Evening (6PM - 12AM)" }
];

const FLEXIBILITY_LEVELS = [
  { value: 0, label: "Tight schedule", description: "Need exact timing" },
  { value: 1, label: "Some flexibility", description: "Can adjust ±2 hours" },
  { value: 2, label: "Very flexible", description: "Can meet anytime" }
];

export default function AddTripV2() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureAirport: null,
      arrivalAirport: null,
      departureDate: "",
      returnDate: "",
      airline: "",
      flightNumber: "",
      spaceAvailable: 0,
      bagType: [],
      numberOfBags: 1,
      additionalNotes: "",
      acceptableTypes: [],
      restrictedItems: "",
      preferredDropoff: "airport",
      availabilityWindows: [],
      flexibilityLevel: 1,
      expectedDeliveryDate: "",
      minReward: 25,
      pricePerKg: 5
    },
  });

  const watchDeparture = form.watch("departureAirport");
  const watchArrival = form.watch("arrivalAirport");
  const watchSpace = form.watch("spaceAvailable");
  const watchBagType = form.watch("bagType");
  const watchAcceptableTypes = form.watch("acceptableTypes");

  const calculatePricing = () => {
    if (watchDeparture && watchArrival && watchSpace > 0) {
      // Mock calculation - in real app would use pricing API
      const distance = Math.abs(watchDeparture.lat - watchArrival.lat) * 100;
      const basePricePerKg = 3 + (distance * 0.02);
      const minReward = Math.round(basePricePerKg * 5); // Min 5kg package
      
      form.setValue("pricePerKg", Math.round(basePricePerKg));
      form.setValue("minReward", minReward);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["departureAirport", "arrivalAirport", "departureDate"];
        break;
      case 2:
        fieldsToValidate = ["spaceAvailable", "bagType", "numberOfBags"];
        break;
      case 3:
        fieldsToValidate = ["acceptableTypes"];
        break;
      case 4:
        fieldsToValidate = ["preferredDropoff", "availabilityWindows", "flexibilityLevel"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (currentStep === 4) {
        calculatePricing();
      }
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Publishing trip:", data);
      
      // Redirect to trips list
      setLocation("/dashboard/traveler/trips");
    } catch (error) {
      console.error("Error publishing trip:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={cn(
              "flex items-center",
              step < 5 && "flex-1"
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
            {step < 5 && (
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
        <span>Flight</span>
        <span>Space</span>
        <span>Types</span>
        <span>Delivery</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Flight Information</h2>
        <p className="text-gray-600">Enter your travel details</p>
      </div>

      <FormField
        control={form.control}
        name="departureAirport"
        render={({ field }) => (
          <FormItem>
            <LocationSelect
              label="Departure Airport"
              required
              placeholder="Search airports..."
              intent="travel"
              scope="airport_only"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.departureAirport?.message}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arrivalAirport"
        render={({ field }) => (
          <FormItem>
            <LocationSelect
              label="Arrival Airport"
              required
              placeholder="Search airports..."
              intent="travel"
              scope="airport_only"
              value={field.value}
              onChange={field.onChange}
              error={form.formState.errors.arrivalAirport?.message}
            />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="departureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Date *</FormLabel>
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
          name="returnDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Date (optional)</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  min={form.watch("departureDate") || new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="airline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Airline (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., United Airlines" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flight Number (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., UA123" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {watchDeparture && watchArrival && (
        <Alert>
          <Plane className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">
                Route: {watchDeparture.code} → {watchArrival.code}
              </p>
              <p className="text-sm text-gray-600">
                Popular route with high demand for package delivery
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Luggage Space</h2>
        <p className="text-gray-600">How much space can you offer?</p>
      </div>

      <FormField
        control={form.control}
        name="spaceAvailable"
        render={({ field }) => (
          <FormItem>
            <WeightInput
              label="Available Space"
              value={field.value}
              onChange={field.onChange}
              required
              max={50}
              error={form.formState.errors.spaceAvailable?.message}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bagType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bag Type *</FormLabel>
            <div className="space-y-2">
              {BAG_TYPES.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={type.value}
                    checked={Array.isArray(field.value) && field.value.includes(type.value)}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, type.value]);
                      } else {
                        field.onChange(currentValue.filter(v => v !== type.value));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={type.value} className="font-normal cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfBags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Bags</FormLabel>
            <Select
              value={field.value.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "bag" : "bags"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Can only carry documents in backpack"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500">
              {field.value.length}/200 characters
            </div>
          </FormItem>
        )}
      />

      {watchSpace > 0 && Array.isArray(watchBagType) && watchBagType.length > 0 && (
        <Alert>
          <Luggage className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">
              {watchSpace}kg available in {watchBagType.join(" & ")} luggage
            </p>
            <p className="text-sm text-gray-600 mt-1">
              This is above average capacity - you'll likely get more match requests!
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Acceptable Parcel Types</h2>
        <p className="text-gray-600">What types of packages can you carry?</p>
      </div>

      <FormField
        control={form.control}
        name="acceptableTypes"
        render={({ field }) => (
          <FormItem>
            <ParcelTypeSelector
              value={field.value as ParcelType[]}
              onChange={field.onChange}
              required
              error={form.formState.errors.acceptableTypes?.message}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="restrictedItems"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Restricted Items (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List any items you cannot carry..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <p className="text-xs text-gray-500 mt-1">
              Be specific about items you're not comfortable carrying
            </p>
          </FormItem>
        )}
      />

      {Array.isArray(watchAcceptableTypes) && watchAcceptableTypes.includes("fragile") && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Carrying fragile items requires extra care. Make sure you have appropriate packaging protection.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Delivery Preferences</h2>
        <p className="text-gray-600">How flexible are you with pickup and delivery?</p>
      </div>

      <FormField
        control={form.control}
        name="preferredDropoff"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Preferred Drop-off Location</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="airport" id="airport" />
                  <Label htmlFor="airport" className="font-normal cursor-pointer">
                    Airport (most convenient)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hotel" id="hotel" />
                  <Label htmlFor="hotel" className="font-normal cursor-pointer">
                    Hotel/Accommodation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible" className="font-normal cursor-pointer">
                    Flexible (anywhere reasonable)
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availabilityWindows"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Time Windows *</FormLabel>
            <div className="space-y-2">
              {TIME_WINDOWS.map(window => (
                <div key={window.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={window.value}
                    checked={Array.isArray(field.value) && field.value.includes(window.value)}
                    onChange={(e) => {
                      const currentValue = Array.isArray(field.value) ? field.value : [];
                      if (e.target.checked) {
                        field.onChange([...currentValue, window.value]);
                      } else {
                        field.onChange(currentValue.filter(v => v !== window.value));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={window.value} className="font-normal cursor-pointer">
                    {window.label}
                  </Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="flexibilityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule Flexibility</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
                className="space-y-2"
              >
                {FLEXIBILITY_LEVELS.map(level => (
                  <div key={level.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value.toString()} id={`flex-${level.value}`} />
                      <Label htmlFor={`flex-${level.value}`} className="font-normal cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">{level.description}</p>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectedDeliveryDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Delivery Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <p className="text-xs text-gray-500 mt-1">
              When do you expect to complete delivery at destination?
            </p>
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep5 = () => {
    const formData = form.getValues();
    const pricePerKg = formData.pricePerKg || 5;
    const minReward = formData.minReward || 25;
    const maxReward = Math.round(pricePerKg * formData.spaceAvailable);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
          <p className="text-gray-600">Review your trip details and set pricing</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Flight Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Route:</span>
              <span className="font-medium">
                {formData.departureAirport?.code} → {formData.arrivalAirport?.code}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formData.departureDate}</span>
            </div>
            {formData.airline && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Airline:</span>
                <span className="font-medium">{formData.airline}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Capacity & Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Space:</span>
              <span className="font-medium">{formData.spaceAvailable}kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bag Type:</span>
              <span className="font-medium">{formData.bagType.join(", ")}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Accepts:</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {formData.acceptableTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-4 bg-primary/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Earning Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price per kg:</span>
                <span className="font-medium">${pricePerKg}/kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Minimum package (5kg):</span>
                <span className="font-medium">${minReward}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maximum earnings:</span>
                <span className="font-bold text-primary text-lg">${maxReward}</span>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="minReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Reward Threshold</FormLabel>
                  <div className="space-y-2">
                    <Slider
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      min={5}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>$5</span>
                      <span className="font-medium text-primary">${field.value}</span>
                      <span>$100</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You'll only receive requests above this amount
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your trip will be published immediately and visible to senders. You'll receive match requests via email and in-app notifications.
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
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard/traveler/trips")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Plane className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add a Trip</h1>
              <p className="text-gray-600">Help others by carrying their packages</p>
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
                  
                  {currentStep < 5 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Publishing...</>
                      ) : (
                        <>
                          Publish Trip
                          <CheckCircle className="ml-2 h-4 w-4" />
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