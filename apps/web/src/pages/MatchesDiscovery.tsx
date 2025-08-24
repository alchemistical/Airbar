import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchDiscovery } from "@/components/matching/MatchDiscovery";
import { useUserRole } from "@/hooks/useUserRole";
import { Users, Package } from "lucide-react";

export default function MatchesDiscovery() {
  const { userRole } = useUserRole();
  const [activeTab, setActiveTab] = useState<"sender" | "traveler">(
    userRole === "traveler" ? "traveler" : "sender"
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Discover Matches
          </h2>
          <p className="text-muted-foreground">
            Find perfect matches for your shipping needs or travel opportunities
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as "sender" | "traveler")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="sender" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Send Package</span>
          </TabsTrigger>
          <TabsTrigger value="traveler" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Carry Package</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sender" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Find Travelers</span>
              </CardTitle>
              <CardDescription>
                Search for travelers who can carry your package to its
                destination. Connect with verified travelers on routes you need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  Verified travelers available
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Secure escrow payments
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Real-time tracking
                </Badge>
              </div>
              <MatchDiscovery userType="sender" currentUserId={1} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traveler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Find Packages</span>
              </CardTitle>
              <CardDescription>
                Search for packages to carry on your upcoming trips. Earn money
                by helping others while you travel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  Earn while you travel
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Flexible carrying options
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Secure payments
                </Badge>
              </div>
              <MatchDiscovery userType="traveler" currentUserId={1} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Search & Filter</h3>
              <p className="text-sm text-gray-600">
                Use our smart filters to find the perfect match for your route,
                dates, and preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Connect & Negotiate</h3>
              <p className="text-sm text-gray-600">
                Send match requests with your message and proposed price. Chat
                to finalize details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Transaction</h3>
              <p className="text-sm text-gray-600">
                Complete your transaction with secure escrow payments and
                real-time tracking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
