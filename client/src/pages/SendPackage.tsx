import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Upload,
  AlertCircle,
  Info
} from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Validation schemas for each step
const step1Schema = z.object({
  title: z.string().min(1, "Package title is required").max(100, "Title too long"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  length: z.number().min(1, "Length is required").max(200, "Maximum 200cm"),
  width: z.number().min(1, "Width is required").max(200, "Maximum 200cm"),
  height: z.number().min(1, "Height is required").max(200, "Maximum 200cm"),
  weight: z.number().min(0.1, "Weight is required").max(50, "Maximum 50kg"),
});

const step2Schema = z.object({
  pickupAddress: z.string().min(5, "Pickup address is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  pickupDateStart: z.string().min(1, "Pickup date range is required"),
  pickupDateEnd: z.string().min(1, "Pickup date range is required"),
  deliveryDeadline: z.string().min(1, "Delivery deadline is required"),
  deliveryType: z.enum(["domestic", "international"], {
    required_error: "Please select delivery type",
  }),
});

const step3Schema = z.object({
  deliveryCondition: z.enum(["standard", "fragile", "express"], {
    required_error: "Please select delivery condition",
  }),
  parcelValue: z.number().min(0, "Value must be positive").max(10000, "Maximum value $10,000"),
  requiresId: z.boolean(),
  notes: z.string().max(500, "Notes too long"),
});

const step4Schema = z.object({
  rewardAmount: z.number().min(5, "Minimum reward is $5").max(500, "Maximum reward is $500"),
  negotiableReward: z.boolean(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

type FormData = z.infer<typeof fullSchema>;

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Clothing",
  "Books",
  "Gifts",
  "Fragile Items",
  "Food Items",
  "Medical Supplies",
  "Art & Collectibles",
  "Other"
];

const DELIVERY_CONDITIONS = [
  { value: "standard", label: "Standard", description: "Regular handling, no special requirements" },
  { value: "fragile", label: "Fragile", description: "Requires careful handling and protection" },
  { value: "express", label: "Express", description: "Priority delivery with faster service" }
];

export default function SendPackage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      pickupAddress: "",
      deliveryAddress: "",
      pickupDateStart: "",
      pickupDateEnd: "",
      deliveryDeadline: "",
      deliveryType: "domestic",
      deliveryCondition: "standard",
      parcelValue: 0,
      requiresId: false,
      notes: "",
      rewardAmount: 0,
      negotiableReward: false,
    },
  });

  const getCurrentStepSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return step1Schema;
    }
  };

  const validateCurrentStep = async () => {
    const currentStepSchema = getCurrentStepSchema();
    const currentValues = form.getValues();
    
    try {
      currentStepSchema.parse(currentValues);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          form.setError(err.path[0] as keyof FormData, {
            type: "manual",
            message: err.message,
          });
        });
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // In real app, this would make an API call
      console.log("Submitting package request:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to sender parcels page
      setLocation("/dashboard/sender/parcels");
    } catch (error) {
      console.error("Error submitting package request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedReward = () => {
    const formValues = form.getValues();
    const { weight, deliveryType, deliveryCondition } = formValues;
    
    let baseReward = Math.max(10, weight * 5); // $5 per kg, minimum $10
    
    if (deliveryType === "international") baseReward *= 2;
    if (deliveryCondition === "fragile") baseReward *= 1.3;
    if (deliveryCondition === "express") baseReward *= 1.5;
    
    return Math.round(baseReward);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Parcel Information";
      case 2: return "Pickup & Delivery Details";
      case 3: return "Delivery Type & Conditions";
      case 4: return "Reward & Review";
      default: return "Send Package";
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Important Documents" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe what you're sending, any special handling requirements..."
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h3 className="text-h4 font-semibold mb-4">Package Dimensions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="0.0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="pickupAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pickup Location *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter pickup address..."
                {...field} 
              />
            </FormControl>
            <div className="text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              We'll show this to potential travelers
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deliveryAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Address *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter delivery address..."
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deliveryType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Delivery Type *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domestic" id="domestic" />
                  <Label htmlFor="domestic">Domestic (Same country)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="international" id="international" />
                  <Label htmlFor="international">International (Cross-border)</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="pickupDateStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Date Start *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Pickup Date End *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryDeadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Deadline *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="deliveryCondition"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Delivery Type *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-4"
              >
                {DELIVERY_CONDITIONS.map((condition) => (
                  <div key={condition.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={condition.value} id={condition.value} />
                      <Label htmlFor={condition.value} className="font-medium">
                        {condition.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{condition.description}</p>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="parcelValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parcel Value (USD) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <div className="text-xs text-gray-500 mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              Used for insurance calculations
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requiresId"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>ID Required for Delivery</FormLabel>
              <div className="text-sm text-gray-600">
                Recipient must show valid ID to receive package
              </div>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes for Traveler</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any special instructions, handling requirements, or additional information..."
                {...field} 
              />
            </FormControl>
            <div className="text-xs text-gray-500 mt-1">
              Optional - Maximum 500 characters
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep4 = () => {
    const formValues = form.getValues();
    const suggestedReward = calculateEstimatedReward();
    
    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="rewardAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Amount (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder={suggestedReward.toString()}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <div className="text-sm text-blue-600 mt-1">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Suggested reward: ${suggestedReward}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="negotiableReward"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Allow reward negotiation</FormLabel>
                <div className="text-sm text-gray-600">
                  Travelers can propose different reward amounts
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Package Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Package:</strong> {formValues.title}
              </div>
              <div>
                <strong>Category:</strong> {formValues.category}
              </div>
              <div>
                <strong>Weight:</strong> {formValues.weight}kg
              </div>
              <div>
                <strong>Dimensions:</strong> {formValues.length}×{formValues.width}×{formValues.height}cm
              </div>
              <div>
                <strong>Pickup:</strong> {formValues.pickupAddress}
              </div>
              <div>
                <strong>Delivery:</strong> {formValues.deliveryAddress}
              </div>
              <div>
                <strong>Type:</strong> {formValues.deliveryType}
              </div>
              <div>
                <strong>Condition:</strong> {formValues.deliveryCondition}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-medium">Reward Amount:</span>
              <Badge className="bg-green-100 text-green-800">
                ${formValues.rewardAmount || suggestedReward}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Your package request will be visible to travelers</li>
                <li>Travelers can accept your request and contact you</li>
                <li>You'll receive notifications when someone shows interest</li>
                <li>Once matched, coordinate pickup details with your traveler</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h2 font-bold">{getStepTitle()}</h2>
              <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
            </div>
            
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${
                    step <= currentStep ? "bg-airbar-blue" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Parcel Info</span>
              <span>Pickup & Delivery</span>
              <span>Conditions</span>
              <span>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Request
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