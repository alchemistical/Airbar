import Header from "../components/Header";
import Footer from "../components/Footer";
import PricingEstimator from "../components/PricingEstimator";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Save up to 70% compared to traditional shipping. No hidden fees, just clear and fair pricing.
            </p>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Calculate Your Shipping Cost</h2>
            <PricingEstimator />
          </div>
        </section>

        {/* How Pricing Works */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">How Our Pricing Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <h3 className="font-semibold mb-2">Goes to Traveler</h3>
                  <p className="text-sm text-gray-600">The majority of your payment rewards the traveler for their service</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">15%</div>
                  <h3 className="font-semibold mb-2">Platform Fee</h3>
                  <p className="text-sm text-gray-600">Covers escrow protection, support, and platform operations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-2">$0</div>
                  <h3 className="font-semibold mb-2">Hidden Fees</h3>
                  <p className="text-sm text-gray-600">What you see is what you pay. No surprises at checkout</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Compare with Traditional Shipping</h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Feature</th>
                          <th className="px-6 py-4 text-center font-semibold text-primary">Airbar</th>
                          <th className="px-6 py-4 text-center font-semibold">Traditional Couriers</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-6 py-4">Average Cost (2kg package)</td>
                          <td className="px-6 py-4 text-center font-semibold text-primary">$30-50</td>
                          <td className="px-6 py-4 text-center">$100-175</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">Delivery Time</td>
                          <td className="px-6 py-4 text-center">2-5 days</td>
                          <td className="px-6 py-4 text-center">5-10 days</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">Escrow Protection</td>
                          <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                          <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-600 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">Photo Proof</td>
                          <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                          <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-600 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4">Direct Communication</td>
                          <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                          <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-600 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">Pricing FAQ</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">When am I charged?</h3>
                  <p className="text-gray-600">You're only charged after a traveler accepts your request. Your payment is held in escrow until delivery is confirmed.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">When do travelers get paid?</h3>
                  <p className="text-gray-600">Travelers receive payment after successful delivery and confirmation from both parties. Funds are released from escrow within 24-48 hours.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What about customs fees?</h3>
                  <p className="text-gray-600">Customs fees and duties are the responsibility of the sender/receiver and are not included in our pricing. We recommend checking local regulations.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is insurance included?</h3>
                  <p className="text-gray-600">Basic protection is included through our escrow system. Additional insurance options will be available soon for high-value items.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}