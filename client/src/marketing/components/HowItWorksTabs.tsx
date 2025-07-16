import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Package, Plane, Search, Shield, CreditCard, CheckCircle } from "lucide-react";

export default function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">("sender");

  const senderSteps = [
    {
      icon: Package,
      title: "Post Your Package",
      description: "Describe what you need to send, where it's going, and when you need it delivered.",
    },
    {
      icon: Search,
      title: "Match with Travelers",
      description: "Browse verified travelers heading to your destination and send match requests.",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay securely through our escrow system. Funds are held until delivery is confirmed.",
    },
    {
      icon: CheckCircle,
      title: "Track & Receive",
      description: "Track your package in real-time and confirm receipt with photo verification.",
    },
  ];

  const travelerSteps = [
    {
      icon: Plane,
      title: "List Your Trip",
      description: "Add your travel dates, route, and how much space you have available.",
    },
    {
      icon: Search,
      title: "Review Requests",
      description: "Check package requests from verified senders and accept the ones that suit you.",
    },
    {
      icon: Shield,
      title: "Carry Safely",
      description: "Inspect items, take photos, and carry only what you're comfortable with.",
    },
    {
      icon: CreditCard,
      title: "Earn Money",
      description: "Get paid after successful delivery. Funds released from escrow to your account.",
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
            className={`px-6 py-2 rounded-md font-medium transition-all duration-150 ${
              activeTab === "sender"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            I want to send
          </button>
          <button
            onClick={() => setActiveTab("traveler")}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-150 ${
              activeTab === "traveler"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            I'm traveling
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href={activeTab === "sender" ? "/send-package" : "/dashboard/traveler/trips/addtrip"}>
          <a>
            <Button size="lg">
              {activeTab === "sender" ? "Send Your First Package" : "List Your Trip"}
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}