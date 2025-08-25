import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingDown } from "lucide-react";

export default function PricingEstimator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("1");
  const [urgency, setUrgency] = useState("standard");
  const [estimate, setEstimate] = useState<{
    reward: number;
    fee: number;
    total: number;
    savings: number;
  } | null>(null);

  const calculateEstimate = () => {
    // Simple pricing calculation
    const basePrice = parseFloat(weight) * 15; // $15 per kg base
    const urgencyMultiplier = urgency === "express" ? 1.5 : 1;
    const distanceMultiplier = 1.2; // Would be calculated based on actual route
    
    const reward = basePrice * urgencyMultiplier * distanceMultiplier;
    const fee = reward * 0.15; // 15% platform fee
    const total = reward + fee;
    const courierPrice = total * 3.5; // Couriers typically 3-4x more expensive
    const savings = courierPrice - total;

    setEstimate({
      reward: Math.round(reward),
      fee: Math.round(fee),
      total: Math.round(total),
      savings: Math.round(savings),
    });

    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('pricing_estimate_generated', {
        from,
        to,
        weight: parseFloat(weight),
        urgency,
        total,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Estimator Form */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Quick Price Estimate
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="e.g., New York, USA"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="e.g., London, UK"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="urgency">Delivery Speed</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger id="urgency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                      <SelectItem value="express">Express (2-3 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AnimatedButton 
                  onClick={calculateEstimate} 
                  className="w-full"
                  disabled={!from || !to || !weight}
                >
                  Calculate Price
                </AnimatedButton>
              </div>
            </div>
            
            {/* Results */}
            <div>
              {estimate ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Your Estimate</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Traveler Reward</span>
                      <span className="font-medium">${estimate.reward}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Platform Fee (15%)</span>
                      <span className="font-medium">${estimate.fee}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-semibold">
                      <span>Total Cost</span>
                      <span className="text-primary">${estimate.total}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingDown className="h-5 w-5" />
                      <span className="font-semibold">You Save: ${estimate.savings}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Compared to traditional courier services
                    </p>
                  </div>
                  
                  <AnimatedButton className="w-full" asChild>
                    <a href="/send-package">Send This Package</a>
                  </AnimatedButton>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <TrendingDown className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Compare & Save</h3>
                    <p className="text-gray-600">
                      Enter your package details to see how much you can save with Airbar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comparison Text */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Average savings based on comparison with major international courier services.</p>
        <p>Actual prices may vary based on route availability and package requirements.</p>
      </div>
    </div>
  );
}