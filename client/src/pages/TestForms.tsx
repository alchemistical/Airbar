import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Package, Plane } from "lucide-react";

export default function TestForms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Test Form Flows</h1>
          <p className="text-gray-600">Click on a card to test the optimized forms</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/send-package")}
          >
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Send Package V2</CardTitle>
              <CardDescription>
                Test the optimized 4-step send package flow with location search, weight input, and parcel type selector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Test Send Package Flow</Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setLocation("/dashboard/traveler/trips/addtrip")}
          >
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Add Trip V2</CardTitle>
              <CardDescription>
                Test the optimized 5-step add trip flow with airport search, pricing calculator, and delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Test Add Trip Flow</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 bg-blue-50 p-6 rounded-lg">
          <h2 className="font-semibold mb-2">Features to Test:</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Location search with favorites and recent locations</li>
            <li>✓ Weight input with kg/lb conversion</li>
            <li>✓ Multi-select parcel type selector</li>
            <li>✓ Route-based restrictions</li>
            <li>✓ Progressive disclosure and validation</li>
            <li>✓ Smart defaults and pricing calculator</li>
          </ul>
        </div>
      </div>
    </div>
  );
}