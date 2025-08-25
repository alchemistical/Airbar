import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { track } from "@/lib/analytics";
import { Calculator, TrendingUp } from "lucide-react";
import tokens from "../../../content/tokens.json";

export default function EstimatorV2() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    weight: "",
    window: "standard"
  });
  const [results, setResults] = useState<{
    reward: number;
    savings: number;
  } | null>(null);

  // Check for prefilled data from mini estimator
  useEffect(() => {
    if (window.location.hash.includes("#estimator")) {
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      setFormData(prev => ({
        ...prev,
        from: params.get("from") || prev.from,
        to: params.get("to") || prev.to,
        weight: params.get("weight") || prev.weight
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock calculation for demo
    const weight = parseFloat(formData.weight) || 1;
    const baseRate = 15; // Base rate per kg
    const reward = Math.round(weight * baseRate * (formData.window === "express" ? 1.5 : 1));
    const courierRate = weight * 45; // Typical courier rate
    const savings = Math.round(((courierRate - reward) / courierRate) * 100);

    setResults({ reward, savings });
    
    track("hp_estimator_full_submit", {
      from: formData.from,
      to: formData.to,
      weight: parseFloat(formData.weight),
      window: formData.window
    });
  };

  const handleContinue = () => {
    const params = new URLSearchParams(formData);
    navigate(`/send-package?${params.toString()}`);
  };

  return (
    <section id="estimator" className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {tokens.estimator.title}
            </h2>
            <p className="text-gray-600">
              Get instant pricing for your package delivery
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">{tokens.estimator.from}</Label>
                  <Input
                    id="from"
                    placeholder="e.g., New York, JFK"
                    value={formData.from}
                    onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="to">{tokens.estimator.to}</Label>
                  <Input
                    id="to"
                    placeholder="e.g., London, LHR"
                    value={formData.to}
                    onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">{tokens.estimator.weight} (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    placeholder="e.g., 2.5"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="window">{tokens.estimator.window}</Label>
                  <Select
                    value={formData.window}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, window: value }))}
                  >
                    <SelectTrigger id="window">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                      <SelectItem value="express">Express (2-3 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <AnimatedButton type="submit" className="w-full" size="lg">
                Calculate Price
              </AnimatedButton>
            </form>

            {results && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {tokens.estimator.result_reward}
                    </h3>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ${results.reward}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    What travelers earn
                  </p>
                </Card>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {tokens.estimator.result_savings}
                    </h3>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">
                    {results.savings}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Compared to couriers
                  </p>
                </Card>
              </div>
            )}

            {results && (
              <AnimatedButton
                onClick={handleContinue}
                className="w-full mt-6"
                size="lg"
                variant="default"
              >
                Continue with This Quote
              </AnimatedButton>
            )}
          </Card>

          <p className="text-xs text-gray-500 text-center mt-4">
            * Prices are estimates and may vary based on traveler availability and package details
          </p>
        </div>
      </div>
    </section>
  );
}