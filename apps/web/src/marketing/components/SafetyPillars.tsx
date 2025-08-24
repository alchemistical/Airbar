import { Link } from "wouter";
import { Shield, UserCheck, Camera, Clock, AlertCircle, DollarSign } from "lucide-react";

export default function SafetyPillars() {
  const pillars = [
    {
      icon: Shield,
      title: "Escrow Payment Protection",
      description: "Funds are held securely in escrow and only released after delivery is confirmed by both parties. Your money is 100% protected until successful delivery.",
      link: "/safety#escrow",
    },
    {
      icon: UserCheck,
      title: "KYC Verified Users",
      description: "Every user undergoes government ID verification, selfie matching, and phone number confirmation. Enhanced verification available for frequent travelers.",
      link: "/safety#verification",
    },
    {
      icon: Clock,
      title: "48-Hour Dispute Resolution",
      description: "Our dedicated support team resolves disputes within 48 hours. First response guaranteed within 2 hours. Fair mediation based on photo evidence.",
      link: "/safety#disputes",
    },
    {
      icon: Camera,
      title: "Photo Documentation",
      description: "Required photos at every step: package contents, sealed package at pickup, and delivery confirmation. Complete visual trail for transparency.",
      link: "/safety#documentation",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {pillars.map((pillar, index) => (
        <Link key={index} href={pillar.link}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-150 cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <pillar.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                <div className="mt-4 text-sm text-primary font-medium group-hover:underline">
                  Learn more →
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* Additional Info Cards */}
      <div className="md:col-span-2 grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="h-6 w-6 text-green-700" />
            <h4 className="font-bold text-green-900">Escrow Explained</h4>
          </div>
          <p className="text-green-800 text-sm leading-relaxed">
            When you pay for a package delivery, funds are held in a secure escrow account managed by our licensed payment partner. 
            Money is only released to the traveler after you confirm successful delivery with photo proof.
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-blue-700" />
            <h4 className="font-bold text-blue-900">Dispute SLA</h4>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            First response within 2 hours. Resolution within 48 hours. 
            If not resolved, escalation to senior team with 5-day final resolution guarantee. 
            Fair mediation based on evidence provided by both parties.
          </p>
        </div>
      </div>
    </div>
  );
}