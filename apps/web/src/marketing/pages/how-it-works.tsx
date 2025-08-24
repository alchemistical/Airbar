import Header from "../components/Header";
import Footer from "../components/Footer";
import HowItWorksTabs from "../components/HowItWorksTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, DollarSign, Clock, Package } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">How Airbar Works</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Whether you're sending a package or traveling with extra space, our platform makes it simple, safe, and profitable.
            </p>
          </div>
        </section>

        {/* Interactive Tabs */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <HowItWorksTabs />
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Airbar?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">KYC verification and escrow payments protect both parties</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Save Money</h3>
                  <p className="text-sm text-gray-600">Up to 70% cheaper than traditional shipping</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">Direct flights mean faster delivery times</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Track Everything</h3>
                  <p className="text-sm text-gray-600">Real-time updates from pickup to delivery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
            <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8">Check out our comprehensive FAQ or contact our support team</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <a>
                  <Button variant="outline">View FAQ</Button>
                </a>
              </Link>
              <Link href="/contact">
                <a>
                  <Button>Contact Support</Button>
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}