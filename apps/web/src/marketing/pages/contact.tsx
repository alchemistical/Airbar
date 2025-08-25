import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('contact_form_submitted', formData);
    }
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
  };

  const locations = [
    {
      city: "New York",
      address: "123 Innovation Way, Suite 100",
      email: "ny@airbar.com",
      phone: "+1 (212) 555-0100",
    },
    {
      city: "London",
      address: "456 Tech Street, Floor 5",
      email: "uk@airbar.com",
      phone: "+44 20 7123 4567",
    },
    {
      city: "Singapore",
      address: "789 Digital Avenue, Unit 20-01",
      email: "sg@airbar.com",
      phone: "+65 6234 5678",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Have a question or need help? We're here to assist you every step of the way.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name*</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
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
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category*</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="business">Business Partnership</SelectItem>
                            <SelectItem value="media">Media Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject*</Label>
                        <Input
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message*</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>
                      
                      <AnimatedButton type="submit" className="w-full" size="lg">
                        Send Message
                      </AnimatedButton>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Other ways to reach us</h2>
                
                {/* Quick Contact */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Email</p>
                          <a href="mailto:support@airbar.com" className="text-primary hover:underline">
                            support@airbar.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Phone</p>
                          <a href="tel:+18005551234" className="text-primary hover:underline">
                            +1 (800) 555-1234
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Support Hours</p>
                          <p className="text-gray-600">24/7 Customer Support</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Locations */}
                <h3 className="text-lg font-semibold mb-4">Our Offices</h3>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-primary mb-2">{location.city}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5" />
                            {location.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {location.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {location.phone}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}