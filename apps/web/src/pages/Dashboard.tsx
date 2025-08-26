import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import UnifiedDashboard from "@/components/dashboard/UnifiedDashboard";
// Legacy button replaced with AnimatedButton
import {
  AnimatedCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  ArrowRight,
  Calendar,
  Eye,
  BarChart3,
  Shield,
  Award,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardData } from "../../../api/src/shared/schema";
import { dashboardApi } from "@/lib/api";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardErrorBoundary } from "@/components/ui/error-boundary";
import { QueryStateWrapper, ErrorState, EmptyState } from "@/components/ui/loading-states";

export default function Dashboard() {
  const [walletView, setWalletView] = useState<"summary" | "graph">("summary");
  const [dashboardView, setDashboardView] = useState<"classic" | "unified">("unified");
  const { user, isAuthenticated } = useAuth();
  const { role, toggleRole } = useUserRole();

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard', 'data', user?.id],
    queryFn: () => dashboardApi.getDashboardData(user?.id || ''),
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated && !!user?.id,
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Show unified dashboard if selected
  if (dashboardView === 'unified') {
    return (
      <DashboardErrorBoundary>
        <DashboardLayout>
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Label htmlFor="dashboard-toggle" className="text-sm">Classic</Label>
              <Switch
                id="dashboard-toggle"
                checked={dashboardView === 'unified'}
                onCheckedChange={(checked) => setDashboardView(checked ? 'unified' : 'classic')}
              />
              <Label htmlFor="dashboard-toggle" className="text-sm">Unified ✨</Label>
            </div>
          </div>
          <UnifiedDashboard />
        </DashboardLayout>
      </DashboardErrorBoundary>
    );
  }

  // Extract data parts for easier use
  const metrics = dashboardData;
  const recentActivity = dashboardData?.recentActivity || [];
  const upcomingTrips = dashboardData?.upcomingTrips || [];

  // Icon mapping for activity items
  const iconMap: Record<string, React.ComponentType<any>> = {
    CheckCircle2,
    DollarSign,
    Star,
    Plane,
    Package,
  };

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
        bgColor: "bg-blue-50",
      },
      {
        title: role === "sender" ? "Matches Pending" : "Parcel Requests",
        value: metrics?.parcelRequests?.toString() || "0",
        icon: role === "sender" ? Users : Package,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ];

    const roleSpecificStats =
      role === "traveler"
        ? [
            {
              title: "In Escrow",
              value: metrics?.inEscrowAmount || "$0",
              icon: DollarSign,
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              title: "Average Rating",
              value: metrics?.averageRating || "0.0",
              icon: Star,
              color: "text-yellow-600",
              bgColor: "bg-yellow-50",
              link: "/dashboard/reviews",
            },
          ]
        : [
            {
              title: "Tracking Active",
              value: metrics?.activeTrips?.toString() || "0",
              icon: MapPin,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
            {
              title: "Average Rating",
              value: metrics?.averageRating || "0.0",
              icon: Star,
              color: "text-yellow-600",
              bgColor: "bg-yellow-50",
              link: "/dashboard/reviews",
            },
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
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="mt-3 p-0 h-auto text-sm text-primary hover:text-primary/80"
            >
              View details <ArrowRight className="h-3 w-3 ml-1" />
            </AnimatedButton>
          </Link>
        )}
      </div>
    ));
  };

  const quickActions =
    role === "sender"
      ? [
          {
            icon: Package,
            label: "Send Package",
            href: "/send-package",
            color: "bg-orange-600 hover:bg-orange-700",
          },
          {
            icon: MapPin,
            label: "Track Package",
            href: "/dashboard/my-parcels",
            color: "bg-purple-600 hover:bg-purple-700",
          },
          {
            icon: Send,
            label: "Browse Travelers",
            href: "/dashboard/new-delivery",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            icon: Wallet,
            label: "View Payments",
            href: "/dashboard/wallet",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            icon: Users,
            label: "Invite Friends",
            href: "/dashboard/referrals",
            color: "bg-pink-600 hover:bg-pink-700",
          },
        ]
      : [
          {
            icon: Plus,
            label: "Add Trip",
            href: "/dashboard/traveler/trips/addtrip",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            icon: Package,
            label: "View Requests",
            href: "/dashboard/my-parcels",
            color: "bg-orange-600 hover:bg-orange-700",
          },
          {
            icon: Plane,
            label: "My Trips",
            href: "/dashboard/my-trips",
            color: "bg-purple-600 hover:bg-purple-700",
          },
          {
            icon: Wallet,
            label: "Withdraw Funds",
            href: "/dashboard/wallet",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            icon: Users,
            label: "Invite Friends",
            href: "/dashboard/referrals",
            color: "bg-pink-600 hover:bg-pink-700",
          },
        ];

  const todoItems = [
    {
      text: "Accept 2 new parcel matches",
      count: metrics?.unacceptedMatches || 2,
      priority: "high",
      href: "/dashboard/matches",
    },
    {
      text: "Confirm delivery completion",
      count: metrics?.pendingConfirmations || 1,
      priority: "medium",
      href: "/dashboard/tracking",
    },
    {
      text: "Upload receipt for verification",
      count: metrics?.receiptsRequired || 1,
      priority: "medium",
      href: "/dashboard/tracking",
    },
    ...(metrics?.kycComplete === false
      ? [
          {
            text: "Complete KYC verification",
            count: 1,
            priority: "high" as const,
            href: "/dashboard/profile",
          },
        ]
      : []),
    {
      text: "Process pending payouts",
      count: metrics?.payoutsPending || 0,
      priority: "low",
      href: "/dashboard/wallet",
    },
  ].filter(item => item.count > 0);

  return (
    <DashboardErrorBoundary>
      <DashboardLayout>
        <QueryStateWrapper
          isLoading={isLoading}
          error={error}
          data={dashboardData}
          onRetry={() => window.location.reload()}
        >
          <div className="space-y-8">
        {/* Dashboard & Role Toggle */}
        <AnimatedCard variant="interactive" className="mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-gray-600">
                  {role === "sender"
                    ? "Manage your package deliveries"
                    : "Track your trips and earnings"}
                </p>
              </div>
              <div className="flex items-center space-x-6">
                {/* Dashboard Toggle */}
                <div className="flex items-center space-x-2 bg-purple-50 rounded-xl p-2">
                  <Label htmlFor="dashboard-view-toggle" className="text-sm">Classic</Label>
                  <Switch
                    id="dashboard-view-toggle"
                    checked={dashboardView === 'unified'}
                    onCheckedChange={(checked) => setDashboardView(checked ? 'unified' : 'classic')}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="dashboard-view-toggle" className="text-sm">Unified ✨</Label>
                </div>
                
                {/* Role Toggle */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                  <Label htmlFor="role-toggle" variant="premium" size="sm">
                    Sender
                  </Label>
                  <Switch
                    id="role-toggle"
                    checked={role === "traveler"}
                    onCheckedChange={toggleRole}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="role-toggle" variant="premium" size="sm">
                    Traveler
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {renderTopStats()}
        </div>

        {/* Quick Actions */}
        <AnimatedCard variant="elevated">
          <CardHeader>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex space-x-4 pb-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AnimatedButton
                          variant={index === 0 ? "premium" : "secondary"}
                          className="min-w-[140px]"
                        >
                          <action.icon className="h-5 w-5 mr-2" />
                          {action.label}
                        </AnimatedButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </AnimatedCard>

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
                  <AnimatedButton
                    variant={walletView === "summary" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWalletView("summary")}
                    className="rounded-lg"
                  >
                    Summary
                  </AnimatedButton>
                  <AnimatedButton
                    variant={walletView === "graph" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWalletView("graph")}
                    className="rounded-lg"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Graph
                  </AnimatedButton>
                </div>
              </div>
              {walletView === "summary" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-700 mb-1">
                      Available Balance
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {metrics?.availableBalance || "$0"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-yellow-700 mb-1">
                      Pending Earnings
                    </p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {metrics?.pendingEarnings || "$0"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-700 mb-1">Total Earned</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {metrics?.totalEarned || "$0"}
                    </p>
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
                  <AnimatedButton variant="outline" className="rounded-lg">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </AnimatedButton>
                </Link>
                <Link href="/dashboard/wallet/withdrawals">
                  <AnimatedButton variant="premium" className="rounded-lg">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </AnimatedButton>
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
                  <TabsTrigger value="upcoming" className="rounded-lg">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="past" className="rounded-lg">
                    Past
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4 mt-6">
                  {upcomingTrips.map(trip => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">{trip.from}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{trip.to}</span>
                        </div>
                        <span
                          className={`badge ${trip.status === "confirmed" ? "badge-success" : "badge-secondary"}`}
                        >
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {trip.date}
                        </span>
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
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.priority === "high"
                                ? "bg-red-500"
                                : item.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {item.text}
                          </span>
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
                  {recentActivity.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-2 rounded-full bg-gray-100">
                        {(() => {
                          const IconComponent = iconMap[activity.icon] || Package;
                          return <IconComponent className={`h-4 w-4 ${activity.color}`} />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Community Stats */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-h3">Airbar Community</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Verified Users</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    15,420
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      On-Time Delivery
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    96.8%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Avg Rating</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    4.8/5
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Join thousands of verified users shipping worldwide
                </p>
              </div>
            </div>

            {/* Progress/Gamification */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-h3">Your Progress</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Trust Level</span>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Gold Member
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    2 more trips to Platinum
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs font-medium">23</p>
                    <p className="text-xs text-gray-500">Deliveries</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Plane className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs font-medium">12</p>
                    <p className="text-xs text-gray-500">Trips</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs font-medium">4.8</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </QueryStateWrapper>
      </DashboardLayout>
    </DashboardErrorBoundary>
  );
}
