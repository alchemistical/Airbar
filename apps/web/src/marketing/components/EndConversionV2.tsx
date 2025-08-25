import { useLocation } from "wouter";
import { AnimatedButton } from "@/components/ui/animated-button";
import { track } from "@/lib/analytics";
import { Send, Plane } from "lucide-react";

export default function EndConversionV2() {
  const [, navigate] = useLocation();

  const handleSendClick = () => {
    track("hp_end_cta_click", { intent: "send" });
    navigate("/send-package?intent=send");
  };

  const handleTravelClick = () => {
    track("hp_end_cta_click", { intent: "travel" });
    navigate("/add-trip?intent=travel");
  };

  return (
    <section className="py-16 md:py-24 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users saving money and earning from travel
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimatedButton
              size="lg"
              onClick={handleSendClick}
              className="min-w-[200px] group"
            >
              <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Send a Package
            </AnimatedButton>
            
            <AnimatedButton
              size="lg"
              variant="outline"
              onClick={handleTravelClick}
              className="min-w-[200px] group"
            >
              <Plane className="mr-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              List Your Trip
            </AnimatedButton>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            By using Airbar, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}