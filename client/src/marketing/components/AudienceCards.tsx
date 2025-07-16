import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, Plane, ArrowRight, Check, DollarSign, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AudienceCards() {
  const [activeTab, setActiveTab] = useState<"senders" | "travelers">("senders");

  const content = {
    senders: {
      title: "Send Packages Globally",
      icon: Package,
      benefits: [
        { icon: DollarSign, text: "Save up to 70% on international shipping" },
        { icon: Shield, text: "Escrow payment protection & insurance" },
        { icon: Clock, text: "Real-time tracking with photo updates" },
      ],
      cta: "Send Your First Package",
      ctaHref: "/send-package",
    },
    travelers: {
      title: "Earn While You Travel",
      icon: Plane,
      benefits: [
        { icon: DollarSign, text: "Earn $50-300 per trip from unused luggage space" },
        { icon: Shield, text: "Choose what packages you want to carry" },
        { icon: Clock, text: "Get paid within 48 hours of delivery" },
      ],
      cta: "Start Earning Today",
      ctaHref: "/dashboard/traveler/trips/addtrip",
    },
  };

  const currentContent = content[activeTab];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab Header */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
        <button
          onClick={() => setActiveTab("senders")}
          className={cn(
            "flex-1 py-3 px-6 rounded-md font-medium transition-all",
            activeTab === "senders"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Package className="h-5 w-5 inline-block mr-2" />
          For Senders
        </button>
        <button
          onClick={() => setActiveTab("travelers")}
          className={cn(
            "flex-1 py-3 px-6 rounded-md font-medium transition-all",
            activeTab === "travelers"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <Plane className="h-5 w-5 inline-block mr-2" />
          For Travelers
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-2xl font-bold mb-6">{currentContent.title}</h3>
        
        <ul className="space-y-4 mb-8">
          {currentContent.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-gray-700 pt-1">{benefit.text}</span>
            </li>
          ))}
        </ul>

        <Link href={`${currentContent.ctaHref}?intent=${activeTab === "senders" ? "send" : "travel"}&src=homepage_audience`}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto group"
            onClick={() => {
              localStorage.setItem('userIntent', activeTab === "senders" ? "send" : "travel");
              localStorage.setItem('intentSource', 'homepage_audience');
            }}
          >
            {currentContent.cta}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}