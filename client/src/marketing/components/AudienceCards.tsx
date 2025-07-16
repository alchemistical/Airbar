import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plane, ArrowRight, Check } from "lucide-react";

export default function AudienceCards() {
  const cards = [
    {
      title: "For Senders",
      icon: Package,
      steps: [
        "Post your package details",
        "Match with verified travelers",
        "Track until delivered",
      ],
      benefits: [
        "Save up to 70% on shipping",
        "Escrow payment protection",
        "Real-time tracking",
      ],
      cta: "Send a Package",
      ctaHref: "/send-package",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "For Travelers",
      icon: Plane,
      steps: [
        "List your upcoming trip",
        "Accept package requests",
        "Earn from unused space",
      ],
      benefits: [
        "Earn up to $300 per trip",
        "Choose what you carry",
        "Secure payment system",
      ],
      cta: "Start Earning",
      ctaHref: "/dashboard/traveler/trips/addtrip",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-150">
          <div className={`h-2 ${card.iconColor.replace('text-', 'bg-')}`} />
          <CardContent className="p-8">
            <div className={`inline-flex p-3 rounded-lg ${card.color} mb-6`}>
              <card.icon className={`h-8 w-8 ${card.iconColor}`} />
            </div>
            
            <h3 className="text-2xl font-bold mb-6">{card.title}</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3">How it works:</h4>
              <ol className="space-y-2">
                {card.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${card.iconColor.replace('text-', 'bg-')} text-white flex items-center justify-center text-sm font-semibold`}>
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold mb-3">Benefits:</h4>
              <ul className="space-y-2">
                {card.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href={card.ctaHref}>
              <a>
                <Button className="w-full group">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}