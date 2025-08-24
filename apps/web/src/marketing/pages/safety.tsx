import Header from "../components/Header";
import Footer from "../components/Footer";
import SafetyPillars from "../components/SafetyPillars";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, FileText, Phone } from "lucide-react";

export default function SafetyPage() {
  const prohibitedItems = [
    "Weapons and ammunition",
    "Illegal drugs and substances",
    "Explosives and flammable materials",
    "Live animals",
    "Perishable food items",
    "Cash and negotiable instruments",
    "Hazardous materials",
    "Counterfeit goods",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Your Safety is Our Priority</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              We've built comprehensive safety measures into every step of the Airbar experience to protect both senders and travelers.
            </p>
          </div>
        </section>

        {/* Trust Pillars */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Safety Framework</h2>
            <SafetyPillars />
          </div>
        </section>

        {/* Prohibited Items */}
        <section id="prohibited" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Prohibited Items</h2>
            <div className="max-w-4xl mx-auto">
              <Alert className="mb-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Travelers have the right to inspect and refuse any package. Attempting to ship prohibited items may result in account suspension.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-4">
                {prohibitedItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span>{item}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Verification Process</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Identity Verification</h3>
                  <p className="text-sm text-gray-600">Government ID required for all users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Background Check</h3>
                  <p className="text-sm text-gray-600">Enhanced verification for frequent travelers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone Verification</h3>
                  <p className="text-sm text-gray-600">SMS verification for all accounts</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our safety team is available 24/7 to assist with any concerns or emergencies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                Report an Issue
              </a>
              <a href="/support" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Visit Help Center
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}