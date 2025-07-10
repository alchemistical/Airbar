import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { 
  Plane, 
  Package, 
  Shield, 
  Globe,
  ArrowRight,
  Star,
  Users
} from "lucide-react";

export default function Homepage() {
  const features = [
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with travelers in 150+ countries worldwide"
    },
    {
      icon: Shield,
      title: "Secure & Insured",
      description: "Every package is protected with comprehensive insurance"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "2M+ verified users with ratings and reviews"
    }
  ];

  const stats = [
    { value: "2M+", label: "Active Users" },
    { value: "150+", label: "Countries" },
    { value: "50K+", label: "Deliveries" },
    { value: "4.8★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-airbar-blue p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-airbar-black">AirBar</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/how-it-works">
                <a className="text-gray-600 hover:text-airbar-blue">How It Works</a>
              </Link>
              <Link href="/find-travelers">
                <a className="text-gray-600 hover:text-airbar-blue">Find Travelers</a>
              </Link>
              <Link href="/browse-packages">
                <a className="text-gray-600 hover:text-airbar-blue">Browse Packages</a>
              </Link>
              <Link href="/pricing">
                <a className="text-gray-600 hover:text-airbar-blue">Pricing</a>
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-airbar-blue hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-airbar-blue to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ship Smarter with
            <span className="block text-airbar-orange">Traveling Humans</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Connect with verified travelers to deliver your packages worldwide. 
            Safe, affordable, and faster than traditional shipping.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link href="/send-package">
              <Button size="lg" className="bg-white text-airbar-blue hover:bg-gray-100 px-8 py-3">
                <Package className="mr-2 h-5 w-5" />
                Send a Package
              </Button>
            </Link>
            <Link href="/add-trip">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-airbar-blue px-8 py-3">
                <Plane className="mr-2 h-5 w-5" />
                Offer Your Trip
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-airbar-black mb-4">
              Why Choose AirBar?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of international shipping with our trusted community of travelers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="bg-airbar-blue/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-airbar-blue" />
                    </div>
                    <h3 className="text-2xl font-semibold text-airbar-black">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-airbar-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Shipping?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust AirBar for their international shipping needs
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-airbar-blue hover:bg-blue-700 px-8 py-3">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}