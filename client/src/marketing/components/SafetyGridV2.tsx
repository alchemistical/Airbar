import { Shield, UserCheck, MapPin, Camera, Clock, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const safetyFeatures = [
  {
    id: "escrow",
    icon: Shield,
    title: "Escrow Protection",
    description: "Your payment is held securely until you confirm delivery. We release funds only after you're satisfied.",
    link: "/safety#escrow",
    highlighted: true
  },
  {
    id: "kyc",
    icon: UserCheck,
    title: "Verified Users",
    description: "All travelers and senders complete government ID verification before their first transaction.",
    link: "/safety#verification"
  },
  {
    id: "tracking",
    icon: MapPin,
    title: "Live Tracking",
    description: "Track your package in real-time with status updates at pickup, transit, and delivery stages.",
    link: "/safety#tracking"
  },
  {
    id: "photo",
    icon: Camera,
    title: "Photo Documentation",
    description: "Visual proof at every handoff ensures transparency and protects both parties.",
    link: "/safety#documentation"
  },
  {
    id: "dispute",
    icon: Clock,
    title: "48hr Dispute Resolution",
    description: "Our dedicated team resolves any issues within 48 hours, with full refund protection.",
    link: "/safety#disputes",
    highlighted: true
  },
  {
    id: "compliance",
    icon: FileText,
    title: "Customs & Compliance",
    description: "Clear guidelines on prohibited items and customs documentation for international shipments.",
    link: "/safety#compliance"
  }
];

export default function SafetyGridV2() {
  return (
    <section id="safety-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Safety & Trust
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your security is our priority. Every transaction is protected by multiple layers of verification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {safetyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={cn(
                  "p-6 hover:shadow-lg transition-shadow duration-200",
                  feature.highlighted && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                    feature.highlighted ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {feature.description}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      asChild
                    >
                      <a href={feature.link}>
                        Learn more →
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}