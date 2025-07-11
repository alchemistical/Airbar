import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Plane, 
  Package, 
  DollarSign, 
  Star, 
  Plus,
  MapPin,
  Users,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  User,
  ArrowRight,
  Calendar,
  Eye,
  BarChart3
} from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "wouter";
import type { DashboardMetrics } from "@shared/schema";

export default function Dashboard() {
  const [walletView, setWalletView] = useState<"summary" | "graph">("summary");
  const userId = 1;
  
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: [`/api/dashboard/metrics/${userId}`],
  });

  const role = metrics?.role || "both";

  // Mock data for widgets - in real app would come from API
  const recentActivity = [
    { id: 1, type: "delivery", message: "Package delivered to Miami", time: "2 hours ago", icon: CheckCircle2, color: "text-airbar-success" },
    { id: 2, type: "payment", message: "Funds released - $85.00", time: "3 hours ago", icon: DollarSign, color: "text-airbar-primary" },
    { id: 3, type: "review", message: "New 5-star review received", time: "1 day ago", icon: Star, color: "text-airbar-warning" },
    { id: 4, type: "trip", message: "Trip to Chicago confirmed", time: "2 days ago", icon: Plane, color: "text-airbar-info" },
    { id: 5, type: "request", message: "New parcel request received", time: "3 days ago", icon: Package, color: "text-airbar-warning" },
  ];

  const upcomingTrips = [
    { id: 1, from: "New York", to: "Miami", date: "Dec 30", status: "confirmed", matches: 2 },
    { id: 2, from: "Los Angeles", to: "Chicago", date: "Jan 5", status: "pending", matches: 0 },
    { id: 3, from: "Boston", to: "Seattle", date: "Jan 12", status: "confirmed", matches: 1 },
  ];

  const renderTopStats = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ));
    }

    // Mock 7-day trend data for sparklines (in real app would come from API)
    const generateSparklineData = (baseValue: number) => {
      const data = [];
      for (let i = 0; i < 7; i++) {
        data.push(baseValue + Math.random() * 10 - 5);
      }
      return data;
    };

    const baseStats = [
      {
        title: role === "sender" ? "Active Deliveries" : "Active Trips",
        value: metrics?.activeTrips?.toString() || "0",
        icon: role === "sender" ? Package : Plane,
        color: "text-airbar-primary",
        bgColor: "bg-airbar-gray-100",
        sparklineData: generateSparklineData(parseInt(metrics?.activeTrips?.toString() || "0")),
        trend: "+12%"
      },
      {
        title: role === "sender" ? "Matches Pending" : "Parcel Requests",
        value: metrics?.parcelRequests?.toString() || "0",
        icon: role === "sender" ? Users : Package,
        color: "text-airbar-warning", 
        bgColor: "bg-airbar-gray-100",
        sparklineData: generateSparklineData(parseInt(metrics?.parcelRequests?.toString() || "0")),
        trend: "+8%"
      }
    ];

    const roleSpecificStats = role === "traveler" ? [
      {
        title: "In Escrow",
        value: metrics?.inEscrowAmount || "$0",
        icon: DollarSign,
        color: "text-airbar-success",
        bgColor: "bg-airbar-gray-100",
        sparklineData: generateSparklineData(parseFloat(metrics?.inEscrowAmount?.replace('$', '') || "0")),
        trend: "+15%"
      },
      {
        title: "Average Rating",
        value: metrics?.averageRating || "0.0",
        icon: Star,
        color: "text-airbar-warning",
        bgColor: "bg-airbar-gray-100",
        link: "/dashboard/reviews",
        sparklineData: generateSparklineData(parseFloat(metrics?.averageRating || "0")),
        trend: "+2%"
      }
    ] : [
      {
        title: "Tracking Active",
        value: metrics?.activeTrips?.toString() || "0",
        icon: MapPin,
        color: "text-airbar-info",
        bgColor: "bg-airbar-gray-100",
        sparklineData: generateSparklineData(parseInt(metrics?.activeTrips?.toString() || "0")),
        trend: "+5%"
      },
      {
        title: "Average Rating",
        value: metrics?.averageRating || "0.0", 
        icon: Star,
        color: "text-airbar-warning",
        bgColor: "bg-airbar-gray-100",
        link: "/dashboard/reviews",
        sparklineData: generateSparklineData(parseFloat(metrics?.averageRating || "0")),
        trend: "+2%"
      }
    ];

    return [...baseStats, ...roleSpecificStats].map((stat, index) => (
      <Card key={index} className="hover:shadow-md hover:bg-gray-50 transition-all duration-200 rounded-xl h-[120px]">
        <CardContent className="p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="flex items-center text-xs text-airbar-gray-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-xs text-airbar-gray-500 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-airbar-black mb-1">{stat.value}</p>
            </div>
            <div className="mt-auto">
              <div className="h-6 w-full">
                <Sparklines data={stat.sparklineData} height={20} width={100}>
                  <SparklinesLine color={
                    stat.color.includes('primary') ? '#2F80ED' :
                    stat.color.includes('success') ? '#27AE60' :
                    stat.color.includes('warning') ? '#F2994A' :
                    stat.color.includes('info') ? '#56CCF2' :
                    '#2F80ED'
                  } />
                </Sparklines>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  // QuickActions component with reordered actions by usage priority
  const QuickActions = () => {
    const actions = [
      { icon: Package, label: "Send Package", href: "/send-package", isPrimary: true },
      { icon: Plus, label: "Add Trip", href: "/dashboard/traveler/trips/addtrip", isPrimary: false },
      { icon: MapPin, label: "Track", href: "/dashboard/tracking", isPrimary: false },
      { icon: Wallet, label: "Withdraw", href: "/dashboard/wallet", isPrimary: false },
    ];

    return (
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                className={`${
                  action.isPrimary 
                    ? "bg-airbar-primary hover:bg-airbar-primary-dark text-white" 
                    : "border-2 border-airbar-primary text-airbar-primary hover:bg-airbar-primary hover:text-white"
                } rounded-xl px-4 py-2 font-medium transition-all duration-200 whitespace-nowrap`}
                variant={action.isPrimary ? "default" : "outline"}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const todoItems = [
    { 
      text: "Accept 2 new parcel matches", 
      count: metrics?.unacceptedMatches || 2, 
      priority: "high",
      href: "/dashboard/matches"
    },
    { 
      text: "Confirm delivery completion", 
      count: metrics?.pendingConfirmations || 1, 
      priority: "medium",
      href: "/dashboard/tracking"
    },
    { 
      text: "Upload receipt for verification", 
      count: metrics?.receiptsRequired || 1, 
      priority: "medium",
      href: "/dashboard/tracking"
    },
    ...(metrics?.kycComplete === false ? [{ 
      text: "Complete KYC verification", 
      count: 1, 
      priority: "high" as const,
      href: "/dashboard/profile"
    }] : []),
    { 
      text: "Process pending payouts", 
      count: metrics?.payoutsPending || 0, 
      priority: "low",
      href: "/dashboard/wallet"
    },
  ].filter(item => item.count > 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {renderTopStats()}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Grid - Left/Right Column Split */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
          {/* Left Column - Work */}
          <div className="space-y-6">
            {/* Wallet Snapshot */}
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Wallet className="h-5 w-5 mr-2 text-green-600" />
                  Wallet Overview
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={walletView === "summary" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWalletView("summary")}
                    className="rounded-lg"
                  >
                    Summary
                  </Button>
                  <Button
                    variant={walletView === "graph" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWalletView("graph")}
                    className="rounded-lg"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Graph
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {walletView === "summary" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-airbar-gray-100 rounded-xl">
                      <p className="text-sm text-airbar-gray-500 mb-1">Available Balance</p>
                      <p className="text-2xl font-bold text-airbar-success">{metrics?.availableBalance || "$0"}</p>
                    </div>
                    <div className="text-center p-4 bg-airbar-gray-100 rounded-xl">
                      <p className="text-sm text-airbar-gray-500 mb-1">Pending Earnings</p>
                      <p className="text-2xl font-bold text-airbar-warning">{metrics?.pendingEarnings || "$0"}</p>
                    </div>
                    <div className="text-center p-4 bg-airbar-gray-100 rounded-xl">
                      <p className="text-sm text-airbar-gray-500 mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-airbar-primary">{metrics?.totalEarned || "$0"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Earnings chart coming soon</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <Link href="/dashboard/wallet">
                    <Button variant="outline" className="rounded-lg">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Link href="/dashboard/wallet/withdrawals">
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trip Timeline */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2 text-airbar-info" />
                  Trip Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-lg">
                    <TabsTrigger value="upcoming" className="rounded-lg">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="rounded-lg">Past</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {upcomingTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium">{trip.from}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{trip.to}</span>
                          </div>
                          <Badge variant={trip.status === "confirmed" ? "default" : "secondary"} className="rounded-full">
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{trip.date}</span>
                          <Badge variant="outline" className="rounded-full">
                            {trip.matches} matches
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="past" className="mt-6">
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No past trips to display</p>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/dashboard/traveler/trips">
                    <Button variant="outline" className="w-full rounded-lg">
                      View All Trips
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-8">
            {/* To-Do List */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-airbar-primary" />
                  Action Items ({todoItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todoItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All caught up! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todoItems.map((item, index) => (
                      <Link key={index} href={item.href}>
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              item.priority === "high" ? "bg-airbar-danger" :
                              item.priority === "medium" ? "bg-airbar-warning" : "bg-airbar-success"
                            }`} />
                            <span className="text-sm font-medium">{item.text}</span>
                          </div>
                          <Badge variant="outline" className="rounded-full">
                            {item.count}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-airbar-gray-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-airbar-gray-100">
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
