import { Link } from "wouter";
import { Shield, UserCheck, Camera, Clock, Package, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SafetyPillars() {
  const pillars = [
    {
      icon: UserCheck,
      title: "KYC Verified Travelers",
      description: "All travelers undergo identity verification before they can carry packages.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Escrow Payments",
      description: "Your money is held securely until delivery is confirmed by both parties.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Package,
      title: "Package Tracking",
      description: "Real-time updates from pickup to delivery with location tracking.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Clock,
      title: "48h Dispute Resolution",
      description: "Quick resolution process with dedicated support team assistance.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Camera,
      title: "Photo Proof",
      description: "Required photos at pickup and delivery for complete transparency.",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      icon: Star,
      title: "Community Ratings",
      description: "Transparent rating system helps you choose trusted partners.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {pillars.map((pillar, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-150">
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-lg ${pillar.bgColor} mb-4`}>
                <pillar.icon className={`h-6 w-6 ${pillar.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{pillar.title}</h3>
              <p className="text-sm text-gray-600">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Link href="/safety">
          <a className="inline-flex items-center text-primary hover:text-primary-hover font-medium">
            Learn more about our safety measures
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
}