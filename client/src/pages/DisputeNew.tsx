import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft, ArrowRight, Camera, CheckCircle, Clock, FileText, Package, Shield, TrendingUp, Upload, X, AlertTriangle } from "lucide-react";

const reasonSchema = z.object({
  reason: z.enum(["lost", "damaged", "late", "payment", "other"]),
});

const detailsSchema = z.object({
  description: z.string().min(20, "Please provide at least 20 characters"),
  preferredOutcome: z.enum(["refund", "partial", "replacement", "other"]),
  evidence: z.array(z.object({
    url: z.string(),
    type: z.string(),
    uploadedAt: z.string(),
  })).optional(),
});

const fullSchema = reasonSchema.merge(detailsSchema).extend({
  matchId: z.number(),
  senderId: z.number(),
  travelerId: z.number(),
});

type FormData = z.infer<typeof fullSchema>;

const reasonOptions = [
  { value: "lost", label: "Lost Package", icon: Package, description: "Package was not delivered" },
  { value: "damaged", label: "Damaged Item", icon: AlertTriangle, description: "Item arrived damaged or broken" },
  { value: "late", label: "Late Delivery", icon: Clock, description: "Package delivered after deadline" },
  { value: "payment", label: "Payment Issue", icon: TrendingUp, description: "Problem with payment or refund" },
  { value: "other", label: "Other Issue", icon: AlertCircle, description: "Different type of problem" },
];

const outcomeOptions = [
  { value: "refund", label: "Full Refund", description: "Get your money back completely" },
  { value: "partial", label: "Partial Refund", description: "Get a portion of your payment back" },
  { value: "replacement", label: "Replacement", description: "Get a new item shipped" },
  { value: "other", label: "Other Resolution", description: "Suggest a different solution" },
];

export default function DisputeNew() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; type: string; uploadedAt: string }>>([]);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get match ID from query params
  const searchParams = new URLSearchParams(location.search || "");
  const matchId = parseInt(searchParams.get("match") || "0");
  const userId = 1; // TODO: Get from auth context

  const form = useForm<FormData>({
    resolver: zodResolver(currentStep === 3 ? fullSchema : currentStep === 1 ? reasonSchema : detailsSchema),
    defaultValues: {
      reason: undefined,
      description: "",
      preferredOutcome: undefined,
      evidence: [],
      matchId: matchId,
      senderId: userId,
      travelerId: 2, // TODO: Get from match data
    },
  });

  // Save draft to localStorage
  useEffect(() => {
    const values = form.watch();
    localStorage.setItem("disputeDraft", JSON.stringify(values));
  }, [form.watch()]);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("disputeDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.reset(parsed);
      } catch (e) {
        // Invalid draft
      }
    }
  }, []);

  const createDisputeMutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("/api/disputes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (dispute) => {
      localStorage.removeItem("disputeDraft");
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
      toast({
        title: "Dispute created",
        description: "Your issue has been reported successfully.",
      });
      navigate(`/support/disputes/${dispute.id}`);
    },
    onError: () => {
      toast({
        title: "Failed to create dispute",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: FormData) => {
    data.evidence = uploadedFiles;
    createDisputeMutation.mutate(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Mock file upload - in real app, upload to storage
    Array.from(files).forEach(file => {
      const mockUrl = URL.createObjectURL(file);
      setUploadedFiles(prev => [...prev, {
        url: mockUrl,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }]);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const watchedValues = form.watch();

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-h3 text-airbar-black mb-2">What went wrong?</h3>
        <p className="text-gray-600">Select the issue type that best describes your problem</p>
      </div>

      <FormField
        control={form.control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid gap-4"
              >
                {reasonOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                      field.value === option.value ? "border-airbar-blue bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <div className="flex items-start gap-4 w-full">
                      <div className={`p-2 rounded-lg ${
                        field.value === option.value ? "bg-airbar-blue text-white" : "bg-gray-100"
                      }`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      {field.value === option.value && (
                        <CheckCircle className="h-5 w-5 text-airbar-blue" />
                      )}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-h3 text-airbar-black mb-2">Provide Details</h3>
        <p className="text-gray-600">Help us understand the situation better</p>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Describe what happened *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please provide detailed information about the issue, including dates, times, and any communication with the other party..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Minimum 20 characters. Be as specific as possible.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredOutcome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What resolution would you prefer? *</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {outcomeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-3 hover:bg-gray-50 ${
                      field.value === option.value ? "border-airbar-blue bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
                      </div>
                      {field.value === option.value && (
                        <CheckCircle className="h-4 w-4 text-airbar-blue" />
                      )}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <FormLabel>Upload Evidence (Optional)</FormLabel>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Upload photos, receipts, or documents
          </p>
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-sm text-airbar-blue hover:text-blue-600">
              Choose files
            </span>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="sr-only"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {file.type.startsWith("image/") ? <Camera className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  <span className="text-sm">File {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="mx-auto h-12 w-12 text-airbar-green mb-4" />
        <h3 className="text-h3 text-airbar-black mb-2">Review & Submit</h3>
        <p className="text-gray-600">Please review your dispute details before submitting</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Issue Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {watchedValues.reason && (
                <>
                  {reasonOptions.find(r => r.value === watchedValues.reason)?.icon && (
                    <div className="p-1.5 bg-gray-100 rounded">
                      {(() => {
                        const Icon = reasonOptions.find(r => r.value === watchedValues.reason)!.icon;
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </div>
                  )}
                  <span className="font-medium">
                    {reasonOptions.find(r => r.value === watchedValues.reason)?.label}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {watchedValues.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Preferred Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {outcomeOptions.find(o => o.value === watchedValues.preferredOutcome)?.label}
            </p>
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{uploadedFiles.length} file(s) attached</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• The other party will be notified and given 48 hours to respond</li>
              <li>• Our support team will review and mediate if needed</li>
              <li>• Most disputes are resolved within 5 business days</li>
              <li>• You'll receive email updates on your case progress</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-h2 text-airbar-black">Report an Issue</h2>
              <Badge variant="secondary">
                Step {currentStep} of 3
              </Badge>
            </div>
            <Progress value={(currentStep / 3) * 100} className="mb-4" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {[
              { id: 1, title: "Select Issue", icon: AlertCircle },
              { id: 2, title: "Provide Details", icon: FileText },
              { id: 3, title: "Review & Submit", icon: CheckCircle },
            ].map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-airbar-blue border-airbar-blue text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <div className={`text-small font-medium ${
                    currentStep >= step.id ? 'text-airbar-blue' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-airbar-blue' : 'bg-gray-300'
                  }`} />
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/support")}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-airbar-blue text-white hover:bg-blue-600"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createDisputeMutation.isPending}
                      className="bg-airbar-green text-white hover:bg-green-600"
                    >
                      {createDisputeMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Submit Dispute
                        </>
                      )}
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