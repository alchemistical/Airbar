import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Package, FileSpreadsheet, HeadphonesIcon, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BusinessPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    volume: "",
    country: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('business_lead_submitted', formData);
    }
    toast({
      title: "Thank you for your interest!",
      description: "Our sales team will contact you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      volume: "",
      country: "",
      message: "",
    });
  };

  const features = [
    {
      icon: Package,
      title: "Volume Discounts",
      description: "Special rates for businesses shipping 10+ packages per month",
    },
    {
      icon: FileSpreadsheet,
      title: "Bulk Upload",
      description: "CSV import for managing multiple shipments efficiently",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "Priority support with dedicated account manager",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track shipments, costs, and performance metrics",
    },
    {
      icon: Shield,
      title: "Enhanced Insurance",
      description: "Additional coverage options for high-value shipments",
    },
    {
      icon: Building,
      title: "API Access",
      description: "Integrate Airbar directly into your systems",
    },
  ];

  const useCases = [
    "E-commerce fulfillment",
    "Sample distribution",
    "Document delivery",
    "Event logistics",
    "Cross-border returns",
    "Emergency shipments",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Airbar for Business</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Scale your international shipping with custom solutions designed for businesses of all sizes
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Enterprise Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-medium">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">Get in Touch</h2>
              <p className="text-center text-gray-600 mb-8">
                Tell us about your shipping needs and we'll create a custom solution for your business
              </p>
              
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name*</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company*</Label>
                        <Input
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="volume">Monthly Volume*</Label>
                        <Select value={formData.volume} onValueChange={(value) => setFormData({ ...formData, volume: value })}>
                          <SelectTrigger id="volume">
                            <SelectValue placeholder="Select volume" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10-50">10-50 packages</SelectItem>
                            <SelectItem value="50-100">50-100 packages</SelectItem>
                            <SelectItem value="100-500">100-500 packages</SelectItem>
                            <SelectItem value="500+">500+ packages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="country">Country*</Label>
                        <Input
                          id="country"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Tell us about your shipping needs</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    
                    <AnimatedButton type="submit" className="w-full" size="lg">
                      Contact Sales Team
                    </AnimatedButton>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Logos */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
            <p className="text-sm text-gray-600 mb-8">Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              <div className="text-2xl font-bold text-gray-400">TechCorp</div>
              <div className="text-2xl font-bold text-gray-400">Fashion Co</div>
              <div className="text-2xl font-bold text-gray-400">Global Trade</div>
              <div className="text-2xl font-bold text-gray-400">StartupHub</div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}