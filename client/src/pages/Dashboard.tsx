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
    { id: 1, type: "delivery", message: "Package delivered to Miami", time: "2 hours ago", icon: CheckCircle2, color: "text-green-600" },
    { id: 2, type: "payment", message: "Funds released - $85.00", time: "3 hours ago", icon: DollarSign, color: "text-blue-600" },
    { id: 3, type: "review", message: "New 5-star review received", time: "1 day ago", icon: Star, color: "text-yellow-600" },
    { id: 4, type: "trip", message: "Trip to Chicago confirmed", time: "2 days ago", icon: Plane, color: "text-purple-600" },
    { id: 5, type: "request", message: "New parcel request received", time: "3 days ago", icon: Package, color: "text-orange-600" },
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

    const baseStats = [
      {
        title: role === "sender" ? "Active Deliveries" : "Active Trips",
        value: metrics?.activeTrips?.toString() || "0",
        icon: role === "sender" ? Package : Plane,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: role === "sender" ? "Matches Pending" : "Parcel Requests",
        value: metrics?.parcelRequests?.toString() || "0",
        icon: role === "sender" ? Users : Package,
        color: "text-orange-600", 
        bgColor: "bg-orange-50"
      }
    ];

    const roleSpecificStats = role === "traveler" ? [
      {
        title: "In Escrow",
        value: metrics?.inEscrowAmount || "$0",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Average Rating",
        value: metrics?.averageRating || "0.0",
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        link: "/dashboard/reviews"
      }
    ] : [
      {
        title: "Tracking Active",
        value: metrics?.activeTrips?.toString() || "0",
        icon: MapPin,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      {
        title: "Average Rating",
        value: metrics?.averageRating || "0.0", 
        icon: Star,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        link: "/dashboard/reviews"
      }
    ];

    return [...baseStats, ...roleSpecificStats].map((stat, index) => (
      <div key={index} className="card hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-small mb-2">{stat.title}</p>
            <p className="text-h2">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
        </div>
        {stat.link && (
          <Link href={stat.link}>
            <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto text-sm text-primary hover:text-primary/80">
              View details <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    ));
  };

  const quickActions = [
    { icon: Plus, label: "Add Trip", href: "/dashboard/traveler/trips/addtrip", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: Package, label: "Send Package", href: "/send-package", color: "bg-orange-600 hover:bg-orange-700" },
    { icon: MapPin, label: "Track Parcel", href: "/dashboard/tracking", color: "bg-purple-600 hover:bg-purple-700" },
    { icon: Wallet, label: "Withdraw Funds", href: "/dashboard/wallet", color: "bg-green-600 hover:bg-green-700" },
    { icon: Users, label: "Invite Friends", href: "/dashboard/referrals", color: "bg-pink-600 hover:bg-pink-700" },
  ];

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
        <div className="card">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-h3">Quick Actions</h2>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={`${index === 0 ? 'btn-primary' : 'btn-secondary'} min-w-[140px] hover-lift`}
                      >
                        <action.icon className="h-5 w-5 mr-2" />
                        {action.label}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Wallet Snapshot */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-h3">Wallet Overview</h2>
                </div>
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
              </div>
              {walletView === "summary" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-sm text-green-700 mb-1">Available Balance</p>
                      <p className="text-2xl font-bold text-green-800">{metrics?.availableBalance || "$0"}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <p className="text-sm text-yellow-700 mb-1">Pending Earnings</p>
                      <p className="text-2xl font-bold text-yellow-800">{metrics?.pendingEarnings || "$0"}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700 mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-blue-800">{metrics?.totalEarned || "$0"}</p>
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
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </Link>
                </div>
            </div>

            {/* Trip Timeline */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-h3">Trip Timeline</h2>
              </div>
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-lg">
                    <TabsTrigger value="upcoming" className="rounded-lg">Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="rounded-lg">Past</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="space-y-4 mt-6">
                    {upcomingTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium">{trip.from}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{trip.to}</span>
                          </div>
                          <span className={`badge ${trip.status === "confirmed" ? "badge-success" : "badge-secondary"}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{trip.date}</span>
                          <span className="badge badge-secondary">
                            {trip.matches} matches
                          </span>
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
                    <button className="btn-secondary w-full">
                      View All Trips
                    </button>
                  </Link>
                </div>
            </div>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-8">
            {/* To-Do List */}
            <div className="card">
              <div className="flex items-center mb-6">
                <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-h3">Action Items ({todoItems.length})</h2>
              </div>
                {todoItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All caught up! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todoItems.map((item, index) => (
                      <Link key={index} href={item.href}>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              item.priority === "high" ? "bg-red-500" :
                              item.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`} />
                            <span className="text-sm font-medium">{item.text}</span>
                          </div>
                          <span className="badge badge-secondary">
                            {item.count}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-h3">Recent Activity</h2>
              </div>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-gray-100">
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
