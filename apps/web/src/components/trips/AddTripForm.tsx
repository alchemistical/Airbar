import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plane,
  Luggage,
  Package,
  MapPin,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Edit,
  DollarSign,
  Info,
  TrendingUp,
} from "lucide-react";

// Form schemas for each step
const step1Schema = z.object({
  fromAirport: z.string().min(1, "Departure airport is required"),
  toAirport: z.string().min(1, "Arrival airport is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  airline: z.string().optional(),
});

const step2Schema = z.object({
  luggageSpace: z.string().min(1, "Please select luggage space"),
  luggageType: z.string().min(1, "Please select luggage type"),
  numBags: z.number().min(1, "Number of bags must be at least 1"),
  additionalNotes: z.string().optional(),
});

const step3Schema = z.object({
  parcelTypes: z
    .array(z.string())
    .min(1, "Please select at least one parcel type"),
  restrictions: z.string().optional(),
});

const step4Schema = z.object({
  dropOffLocation: z.string().min(1, "Drop-off location is required"),
  handOffMethod: z.string().min(1, "Please select hand-off method"),
  deliveryTimes: z
    .array(z.string())
    .min(1, "Please select at least one delivery time"),
  flexibility: z.number().min(0).max(100),
  deliveryDate: z.string().min(1, "Expected delivery date is required"),
  consentInspection: z.boolean().refine(val => val === true, {
    message: "You must agree to inspect items before accepting",
  }),
  consentRejection: z.boolean().refine(val => val === true, {
    message: "You must acknowledge your right to reject parcels",
  }),
  consentPhotos: z.boolean().refine(val => val === true, {
    message: "You must agree to take handoff and delivery photos",
  }),
  consentDeclaredItems: z.boolean().refine(val => val === true, {
    message: "You must agree to carry only declared items",
  }),
});

const step5Schema = z.object({
  pricingModel: z.string().min(1, "Please select a pricing model"),
  pricePerKg: z.number().min(0.01, "Price must be greater than 0"),
  pricePerItem: z.number().optional(),
  acceptSuggestedPrice: z.boolean().optional(),
});

const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

type FormData = z.infer<typeof fullSchema>;

const steps = [
  { id: 1, title: "Flight Info", icon: Plane },
  { id: 2, title: "Luggage Space", icon: Luggage },
  { id: 3, title: "Parcel Types", icon: Package },
  { id: 4, title: "Delivery Details", icon: MapPin },
  { id: 5, title: "Pricing", icon: DollarSign },
  { id: 6, title: "Review & Submit", icon: CheckCircle },
];

const parcelTypeOptions = [
  { id: "documents", label: "Documents" },
  { id: "small-packages", label: "Small Packages" },
  { id: "electronics", label: "Electronics" },
  { id: "perishables", label: "Perishables" },
  { id: "fragile", label: "Fragile Items" },
];

interface AddTripFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function AddTripForm({ onSubmit, onCancel }: AddTripFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(
      currentStep === 6
        ? fullSchema
        : currentStep === 1
          ? step1Schema
          : currentStep === 2
            ? step2Schema
            : currentStep === 3
              ? step3Schema
              : currentStep === 4
                ? step4Schema
                : step5Schema
    ),
    defaultValues: {
      fromAirport: "",
      toAirport: "",
      departureDate: "",
      returnDate: "",
      airline: "",
      luggageSpace: "",
      luggageType: "",
      numBags: 1,
      additionalNotes: "",
      parcelTypes: [],
      restrictions: "",
      dropOffLocation: "",
      handOffMethod: "",
      deliveryTimes: [],
      flexibility: 50,
      deliveryDate: "",
      consentInspection: false,
      consentRejection: false,
      consentPhotos: false,
      consentDeclaredItems: false,
      pricingModel: "",
      pricePerKg: 0,
      pricePerItem: 0,
      acceptSuggestedPrice: false,
    },
  });

  const watchedValues = form.watch();

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const getCompletionScore = () => {
    let completed = 0;
    const total = 5; // 5 main steps before review

    if (
      watchedValues.fromAirport &&
      watchedValues.toAirport &&
      watchedValues.departureDate
    )
      completed++;
    if (
      watchedValues.luggageSpace &&
      watchedValues.luggageType &&
      watchedValues.numBags
    )
      completed++;
    if (watchedValues.parcelTypes?.length > 0) completed++;
    if (
      watchedValues.dropOffLocation &&
      watchedValues.handOffMethod &&
      watchedValues.deliveryTimes?.length > 0
    )
      completed++;
    if (
      watchedValues.pricingModel &&
      (watchedValues.pricePerKg > 0 || (watchedValues.pricePerItem || 0) > 0)
    )
      completed++;

    return Math.round((completed / total) * 100);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="fromAirport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Airport *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., JFK - New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toAirport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Airport *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., LAX - Los Angeles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="departureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Return Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="airline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Airline (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Emirates, Delta, Turkish Airlines"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="luggageSpace"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Luggage Space Available *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select luggage space" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="<5kg">Less than 5kg</SelectItem>
                <SelectItem value="5-10kg">5-10kg</SelectItem>
                <SelectItem value="10-20kg">10-20kg</SelectItem>
                <SelectItem value=">20kg">More than 20kg</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="luggageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Luggage Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select luggage type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="carry-on">Carry-on</SelectItem>
                  <SelectItem value="checked-bag">Checked Bag</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numBags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bags *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1"
                  value={field.value || 1}
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., I can carry small items in my backpack, Available space in my suitcase"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="parcelTypes"
        render={() => (
          <FormItem>
            <FormLabel>Select acceptable parcel types *</FormLabel>
            <div className="space-y-4">
              {parcelTypeOptions.map(option => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="parcelTypes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={checked => {
                            const updatedValue = checked
                              ? [...(field.value || []), option.id]
                              : field.value?.filter(
                                  value => value !== option.id
                                ) || [];
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="restrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Restrictions (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., No liquids, no perishables, no items over 2kg"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-h3 text-airbar-black mb-2">Delivery Preferences</h3>
        <p className="text-body text-airbar-dark-gray mb-6">
          Specify how and when you'd like to deliver parcels to make the process
          smooth for everyone.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="dropOffLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Preferred Drop-off Location *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Taksim Square, Downtown LA, JFK Airport Terminal 1"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="handOffMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Hand-off Method *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="How would you like to hand off parcels?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in-person-airport">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">In person at airport</span>
                      <span className="text-sm text-airbar-dark-gray">
                        Meet at departure/arrival terminal
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="destination-drop">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        At destination drop point
                      </span>
                      <span className="text-sm text-airbar-dark-gray">
                        Meet at a specific location in the city
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="door-to-door">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Door-to-door delivery</span>
                      <span className="text-sm text-airbar-dark-gray">
                        Deliver directly to recipient's address
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryTimes"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Available Drop-off Times *
              </FormLabel>
              <p className="text-sm text-airbar-dark-gray mb-4">
                Select all times when you're available for delivery
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { value: "morning", label: "Morning", time: "6AM - 12PM" },
                  {
                    value: "afternoon",
                    label: "Afternoon",
                    time: "12PM - 6PM",
                  },
                  { value: "evening", label: "Evening", time: "6PM - 10PM" },
                ].map(timeSlot => (
                  <FormField
                    key={timeSlot.value}
                    control={form.control}
                    name="deliveryTimes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              field.value?.includes(timeSlot.value)
                                ? "border-airbar-blue bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => {
                              const currentValue = field.value || [];
                              const isSelected = currentValue.includes(
                                timeSlot.value
                              );
                              const updatedValue = isSelected
                                ? currentValue.filter(
                                    value => value !== timeSlot.value
                                  )
                                : [...currentValue, timeSlot.value];
                              field.onChange(updatedValue);
                            }}
                          >
                            <div className="text-center">
                              <div className="font-medium text-airbar-black">
                                {timeSlot.label}
                              </div>
                              <div className="text-sm text-airbar-dark-gray mt-1">
                                {timeSlot.time}
                              </div>
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flexibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Delivery Deadline Flexibility
              </FormLabel>
              <p className="text-sm text-airbar-dark-gray mb-4">
                How flexible are you with delivery timing if unexpected delays
                occur?
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-airbar-black">
                    Fixed Schedule
                  </span>
                  <span className="text-sm font-medium text-airbar-black">
                    Very Flexible
                  </span>
                </div>
                <FormControl>
                  <Slider
                    value={[field.value || 50]}
                    onValueChange={value => field.onChange(value[0])}
                    max={100}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </FormControl>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold text-airbar-blue">
                    {field.value || 50}% flexible
                  </span>
                  <p className="text-xs text-airbar-dark-gray mt-1">
                    {(field.value || 50) < 30
                      ? "I prefer to stick to the planned schedule"
                      : (field.value || 50) < 70
                        ? "I'm somewhat flexible with timing"
                        : "I'm very flexible and understanding of delays"}
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Expected Delivery Date *
              </FormLabel>
              <p className="text-sm text-airbar-dark-gray mb-2">
                When do you expect to deliver the parcels?
              </p>
              <FormControl>
                <Input type="date" className="h-12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Traveler Consent Checkboxes */}
        <div className="mt-8 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-base font-semibold text-airbar-black mb-3">
              Traveler Responsibilities
            </h4>
            <p className="text-sm text-airbar-dark-gray mb-4">
              Please confirm that you understand and agree to the following
              requirements:
            </p>

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="consentInspection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm">
                        I will inspect all items before accepting them *
                      </FormLabel>
                      <p className="text-xs text-airbar-dark-gray">
                        You agree to check parcels for prohibited items and
                        verify they match the description
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentRejection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm">
                        I understand I can reject any parcel at handoff *
                      </FormLabel>
                      <p className="text-xs text-airbar-dark-gray">
                        You have the right to refuse any package that seems
                        suspicious or doesn't match the description
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentPhotos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm">
                        I will take a handoff and delivery photo *
                      </FormLabel>
                      <p className="text-xs text-airbar-dark-gray">
                        Photos are required for both pickup and delivery
                        confirmation to ensure transparency
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentDeclaredItems"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-sm">
                        I agree to carry only declared items *
                      </FormLabel>
                      <p className="text-xs text-airbar-dark-gray">
                        You will not accept any undeclared or hidden items in
                        the packages
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {(form.formState.errors.consentInspection ||
              form.formState.errors.consentRejection ||
              form.formState.errors.consentPhotos ||
              form.formState.errors.consentDeclaredItems) && (
              <p className="text-sm text-red-600 mt-3">
                Please accept all traveler responsibilities to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => {
    // Calculate suggested pricing based on route
    const calculateSuggestedPrice = () => {
      const luggageKg = watchedValues.luggageSpace
        ? parseFloat(watchedValues.luggageSpace.replace(/[^\d.-]/g, "")) || 10
        : 10;

      // Base price: $3-5 per kg for domestic, $5-8 for international
      const isInternational =
        watchedValues.fromAirport?.includes("International") ||
        watchedValues.toAirport?.includes("International");
      const basePrice = isInternational ? 6.5 : 4;

      return {
        perKg: basePrice,
        perItem: basePrice * 2, // Roughly 2kg per item average
        totalEstimate: basePrice * luggageKg,
        platformFee: 15, // 15% platform fee
      };
    };

    const suggestedPricing = calculateSuggestedPrice();

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-h3 text-airbar-black mb-2">Set Your Pricing</h3>
          <p className="text-body text-airbar-dark-gray mb-6">
            Choose how you want to charge for carrying packages. Our suggested
            prices are based on your route and current market rates.
          </p>
        </div>

        {/* Platform Suggested Pricing */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Platform Suggested Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Price per kg</p>
                <p className="text-2xl font-bold text-airbar-blue">
                  ${suggestedPricing.perKg.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price per item</p>
                <p className="text-2xl font-bold text-airbar-blue">
                  ${suggestedPricing.perItem.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Estimated earnings for {watchedValues.luggageSpace || "10kg"}
              </p>
              <p className="text-xl font-semibold text-green-600">
                $
                {(
                  suggestedPricing.totalEstimate *
                  (1 - suggestedPricing.platformFee / 100)
                ).toFixed(2)}
                <span className="text-sm text-gray-500 ml-2">
                  after platform fee
                </span>
              </p>
            </div>

            <FormField
              control={form.control}
              name="acceptSuggestedPrice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Accept suggested pricing</FormLabel>
                    <p className="text-xs text-gray-500">
                      Use our optimized pricing for maximum matches
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={checked => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("pricePerKg", suggestedPricing.perKg);
                          form.setValue(
                            "pricePerItem",
                            suggestedPricing.perItem
                          );
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Custom Pricing */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="pricingModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Pricing Model *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select how you want to charge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="per-kg">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Per Kilogram</span>
                        <span className="text-sm text-gray-500">
                          Charge based on package weight
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="per-item">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Per Item</span>
                        <span className="text-sm text-gray-500">
                          Fixed price per package
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="both">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Both Options</span>
                        <span className="text-sm text-gray-500">
                          Let senders choose their preference
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(watchedValues.pricingModel === "per-kg" ||
            watchedValues.pricingModel === "both") && (
            <FormField
              control={form.control}
              name="pricePerKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Price per Kilogram ($) *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-12"
                      {...field}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Market average: ${suggestedPricing.perKg.toFixed(2)}/kg for
                    this route
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(watchedValues.pricingModel === "per-item" ||
            watchedValues.pricingModel === "both") && (
            <FormField
              control={form.control}
              name="pricePerItem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Price per Item ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-12"
                      {...field}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Market average: ${suggestedPricing.perItem.toFixed(2)}/item
                    for this route
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Important Notes */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-600" />
              Important Pricing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Platform fee: {suggestedPricing.platformFee}% of total
                earnings
              </li>
              <li>• Final prices are negotiated with each sender</li>
              <li>• You can adjust prices for individual matches</li>
              <li>• Higher prices may result in fewer matches</li>
              <li>• Payment held in escrow until delivery confirmation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Earnings Estimate */}
        {watchedValues.pricePerKg > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Potential Earnings Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    For {watchedValues.luggageSpace || "10kg"} at $
                    {watchedValues.pricePerKg}/kg
                  </span>
                  <span className="font-semibold">
                    $
                    {(
                      parseFloat(
                        watchedValues.luggageSpace?.replace(/[^\d.-]/g, "") ||
                          "10"
                      ) * watchedValues.pricePerKg
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Platform fee (-{suggestedPricing.platformFee}%)
                  </span>
                  <span className="text-red-600">
                    -$
                    {(
                      (parseFloat(
                        watchedValues.luggageSpace?.replace(/[^\d.-]/g, "") ||
                          "10"
                      ) *
                        watchedValues.pricePerKg *
                        suggestedPricing.platformFee) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Net Earnings</span>
                  <span className="font-bold text-green-600">
                    $
                    {(
                      parseFloat(
                        watchedValues.luggageSpace?.replace(/[^\d.-]/g, "") ||
                          "10"
                      ) *
                      watchedValues.pricePerKg *
                      (1 - suggestedPricing.platformFee / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="mx-auto h-12 w-12 text-airbar-green mb-4" />
        <h3 className="text-h3 text-airbar-black mb-2">Review Your Trip</h3>
        <p className="text-body text-airbar-dark-gray">
          Please review all details before publishing your trip
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Flight Information</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Route:</strong> {watchedValues.fromAirport} →{" "}
              {watchedValues.toAirport}
            </p>
            <p>
              <strong>Departure:</strong> {watchedValues.departureDate}
            </p>
            {watchedValues.returnDate && (
              <p>
                <strong>Return:</strong> {watchedValues.returnDate}
              </p>
            )}
            {watchedValues.airline && (
              <p>
                <strong>Airline:</strong> {watchedValues.airline}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Luggage Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(2)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Space Available:</strong> {watchedValues.luggageSpace}
            </p>
            <p>
              <strong>Type:</strong> {watchedValues.luggageType}
            </p>
            <p>
              <strong>Number of Bags:</strong> {watchedValues.numBags}
            </p>
            {watchedValues.additionalNotes && (
              <p>
                <strong>Notes:</strong> {watchedValues.additionalNotes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Parcel Preferences</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(3)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>Accepted Types:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {watchedValues.parcelTypes?.map(type => (
                  <Badge key={type} variant="secondary">
                    {parcelTypeOptions.find(opt => opt.id === type)?.label}
                  </Badge>
                ))}
              </div>
            </div>
            {watchedValues.restrictions && (
              <p>
                <strong>Restrictions:</strong> {watchedValues.restrictions}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Delivery Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(4)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Drop-off Location:</strong>{" "}
              {watchedValues.dropOffLocation}
            </p>
            <p>
              <strong>Hand-off Method:</strong> {watchedValues.handOffMethod}
            </p>
            <div>
              <strong>Available Times:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {watchedValues.deliveryTimes?.map(time => (
                  <Badge key={time} variant="outline" className="capitalize">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
            <p>
              <strong>Flexibility:</strong> {watchedValues.flexibility}%
              flexible
            </p>
            <p>
              <strong>Expected Delivery:</strong> {watchedValues.deliveryDate}
            </p>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pricing</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(5)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Pricing Model:</strong>{" "}
              {watchedValues.pricingModel === "per-kg"
                ? "Per Kilogram"
                : watchedValues.pricingModel === "per-item"
                  ? "Per Item"
                  : watchedValues.pricingModel === "both"
                    ? "Both Options"
                    : "Not set"}
            </p>
            {(watchedValues.pricingModel === "per-kg" ||
              watchedValues.pricingModel === "both") && (
              <p>
                <strong>Price per kg:</strong> $
                {watchedValues.pricePerKg?.toFixed(2) || "0.00"}
              </p>
            )}
            {(watchedValues.pricingModel === "per-item" ||
              watchedValues.pricingModel === "both") && (
              <p>
                <strong>Price per item:</strong> $
                {watchedValues.pricePerItem?.toFixed(2) || "0.00"}
              </p>
            )}
            <p className="text-sm text-gray-600">
              Platform fee: 15% of earnings
            </p>
          </CardContent>
        </Card>

        {/* Traveler Responsibilities Confirmation */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Traveler Responsibilities Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-3">
              You have agreed to the following responsibilities:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Inspect all items before accepting them</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Right to reject any parcel at handoff</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Take handoff and delivery photos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Carry only declared items</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-h2 text-airbar-black">Add New Trip</h2>
              <Badge variant="secondary">Step {currentStep} of 6</Badge>
            </div>
            <Progress value={(currentStep / 6) * 100} className="mb-4" />
            <div className="mb-4">
              <div className="text-small text-airbar-dark-gray mb-2">
                Trip Completeness Score: {getCompletionScore()}%
              </div>
              <Progress value={getCompletionScore()} className="h-2" />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-airbar-blue border-airbar-blue text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="ml-2 hidden md:block">
                  <div
                    className={`text-small font-medium ${
                      currentStep >= step.id
                        ? "text-airbar-blue"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-airbar-blue" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>

                  {currentStep < 6 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-airbar-blue text-white hover:bg-blue-600"
                    >
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-airbar-green text-white hover:bg-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish Trip
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
