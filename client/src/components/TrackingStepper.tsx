import { Check, Circle, Package, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrackingStep = "picked_up" | "in_transit" | "delivered";

interface TrackingStepperProps {
  currentStep: TrackingStep;
  className?: string;
}

export function TrackingStepper({ currentStep, className }: TrackingStepperProps) {
  const steps = [
    { id: "picked_up", label: "Picked Up", icon: Package },
    { id: "in_transit", label: "In Transit", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle }
  ];

  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  )}
                >
                  {isCompleted && index < currentIndex ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm mt-2 font-medium",
                    isCompleted ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}