import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Plane } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-7xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are saving money on shipping and earning while they travel.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/send-package">
            <a>
              <Button size="lg" className="group">
                <Package className="h-5 w-5 mr-2" />
                Send a Package
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </Link>
          <Link href="/dashboard/traveler/trips/addtrip">
            <a>
              <Button size="lg" variant="outline" className="group">
                <Plane className="h-5 w-5 mr-2" />
                Start Earning
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          By using Airbar, you agree to our{" "}
          <Link href="/terms">
            <a className="text-primary hover:underline">Terms of Service</a>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <a className="text-primary hover:underline">Privacy Policy</a>
          </Link>
        </p>
      </div>
    </section>
  );
}