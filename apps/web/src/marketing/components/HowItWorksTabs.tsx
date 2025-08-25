import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "wouter";
import { Package, Plane, Search, CreditCard, Camera, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">("sender");

  const senderSteps = [
    {
      icon: Search,
      title: "Post",
      description: "List your package details and destination",
    },
    {
      icon: CreditCard,
      title: "Match & Pay",
      description: "Select a traveler and pay securely",
    },
    {
      icon: Camera,
      title: "Deliver",
      description: "Track and confirm with photos",
    },
  ];

  const travelerSteps = [
    {
      icon: Plane,
      title: "List Trip",
      description: "Add your route and available space",
    },
    {
      icon: Package,
      title: "Accept Packages",
      description: "Review and accept requests",
    },
    {
      icon: DollarSign,
      title: "Get Paid",
      description: "Earn after successful delivery",
    },
  ];

  const steps = activeTab === "sender" ? senderSteps : travelerSteps;

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("sender")}
            className={cn(
              "px-6 py-2 rounded-md font-medium transition-all duration-150",
              activeTab === "sender"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            I want to send
          </button>
          <button
            onClick={() => setActiveTab("traveler")}
            className={cn(
              "px-6 py-2 rounded-md font-medium transition-all duration-150",
              activeTab === "traveler"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            I'm traveling
          </button>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative max-w-4xl mx-auto mb-12">
        {/* Timeline Bar */}
        <div className="absolute top-16 left-16 right-16 h-1 bg-gray-200 hidden md:block"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step Number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Icon Circle */}
              <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center group hover:bg-primary/20 transition-colors">
                  <step.icon className="h-16 w-16 text-primary" />
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Average Savings Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full">
          <DollarSign className="h-5 w-5" />
          <span className="font-semibold">Average delivery savings: 65%</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href={activeTab === "sender" ? "/send-package" : "/add-trip"}>
          <AnimatedButton size="lg">
            {activeTab === "sender" ? "Start Your First Package" : "Add Your Trip"}
          </AnimatedButton>
        </Link>
      </div>
    </div>
  );
}