import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Calendar,
  Package,
  DollarSign,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  AlertCircle,
  User,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Match {
  id: number;
  tripId: number;
  parcelId: number;
  senderId: number;
  travelerId: number;
  senderName: string;
  travelerName: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  weight: number;
  reward: number;
  category: string;
  message?: string;
  status:
    | "pending"
    | "accepted"
    | "paid"
    | "confirmed"
    | "in_transit"
    | "delivered"
    | "disputed"
    | "cancelled";
  paymentStatus?: string;
  escrowStatus?: string;
  escrowAmount?: number;
  trackingStep?: "picked_up" | "in_transit" | "delivered";
  createdAt: string;
  acceptedAt?: string;
  paidAt?: string;
  deliveredAt?: string;
  rating?: number;
  hasNewMessage?: boolean;
  disputeId?: number;
}

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  accepted: "bg-purple-100 text-purple-800 border-purple-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  confirmed: "bg-indigo-100 text-indigo-800 border-indigo-300",
  in_transit: "bg-cyan-100 text-cyan-800 border-cyan-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  disputed: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  paid: CreditCard,
  confirmed: CheckCircle,
  in_transit: Truck,
  delivered: CheckCircle,
  disputed: AlertCircle,
  cancelled: XCircle,
};

export default function MatchesHub() {
  const [location, navigate] = useLocation();
  const currentUserId = 1; // Would come from auth context

  // Parse query params for tab selection
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const tabFromUrl = searchParams.get("tab") || "pending";
  const [activeTab, setActiveTab] = useState<
    "pending" | "active" | "completed"
  >(tabFromUrl as "pending" | "active" | "completed");

  // View preferences
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [roleFilter, setRoleFilter] = useState<"all" | "sender" | "traveler">(
    "all"
  );
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as "pending" | "active" | "completed";
    setActiveTab(newTab);
    navigate(`/dashboard/matches?tab=${newTab}`);
  };

  // Fetch all matches
  const { data: allMatches = [] } = useQuery<Match[]>({
    queryKey: ["/api/user/matches", { status: "all" }],
  });

  // Filter matches by tab
  const pendingMatches = allMatches.filter(
    m => ["pending", "accepted"].includes(m.status) && m.status !== "paid"
  );

  const activeMatches = allMatches.filter(m =>
    ["paid", "confirmed", "in_transit", "disputed"].includes(m.status)
  );

  const completedMatches = allMatches.filter(m =>
    ["delivered", "cancelled"].includes(m.status)
  );

  // Apply additional filters
  const filterMatches = (matches: Match[]) => {
    return matches.filter(match => {
      // Role filter
      if (roleFilter !== "all") {
        const isSender = match.senderId === currentUserId;
        if (roleFilter === "sender" && !isSender) return false;
        if (roleFilter === "traveler" && isSender) return false;
      }

      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        const matchDate = new Date(match.departureDate);
        if (dateRange.from && matchDate < dateRange.from) return false;
        if (dateRange.to && matchDate > dateRange.to) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          match.fromCity.toLowerCase().includes(query) ||
          match.toCity.toLowerCase().includes(query) ||
          match.senderName.toLowerCase().includes(query) ||
          match.travelerName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  const getMatchesForTab = () => {
    switch (activeTab) {
      case "pending":
        return filterMatches(pendingMatches);
      case "active":
        return filterMatches(activeMatches);
      case "completed":
        return filterMatches(completedMatches);
      default:
        return [];
    }
  };

  const currentMatches = getMatchesForTab();

  // Calculate stats
  const stats = {
    pending: pendingMatches.length,
    active: activeMatches.length,
    completed: completedMatches.length,
    requiresAction: pendingMatches.filter(
      m =>
        (m.senderId === currentUserId && m.status === "accepted") ||
        (m.travelerId === currentUserId && m.status === "pending")
    ).length,
  };

  const renderMatchCard = (match: Match) => {
    const isSender = match.senderId === currentUserId;
    const StatusIcon = statusIcons[match.status];
    const requiresPayment =
      isSender && match.status === "accepted" && !match.paymentStatus;
    const canAccept = !isSender && match.status === "pending";

    return (
      <Card
        key={match.id}
        className={cn(
          "hover:shadow-md transition-shadow cursor-pointer",
          match.hasNewMessage && "ring-2 ring-blue-500"
        )}
        onClick={() => navigate(`/dashboard/matches/${match.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[match.status])}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {match.status.replace("_", " ")}
              </Badge>
              {match.hasNewMessage && (
                <Badge variant="default" className="bg-blue-500">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  New
                </Badge>
              )}
            </div>
            <Badge variant="outline">{isSender ? "Sender" : "Traveler"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Route */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{match.fromCity}</span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <span className="font-medium">{match.toCity}</span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span>{format(new Date(match.departureDate), "MMM d")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-gray-400" />
              <span>{match.weight} kg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-medium">${match.reward}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-gray-400" />
              <span>{isSender ? match.travelerName : match.senderName}</span>
            </div>
          </div>

          {/* Actions based on status and role */}
          <div className="flex gap-2 pt-2">
            {requiresPayment && (
              <AnimatedButton
                size="sm"
                className="flex-1"
                onClick={e => {
                  e.stopPropagation();
                  navigate(
                    `/dashboard/payment/checkout?matchRequestId=${match.id}`
                  );
                }}
              >
                <CreditCard className="h-3.5 w-3.5 mr-1" />
                Pay ${match.reward}
              </AnimatedButton>
            )}
            {canAccept && (
              <>
                <AnimatedButton
                  size="sm"
                  className="flex-1"
                  onClick={e => {
                    e.stopPropagation();
                    // Handle accept
                  }}
                >
                  Accept
                </AnimatedButton>
                <AnimatedButton
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={e => {
                    e.stopPropagation();
                    // Handle reject
                  }}
                >
                  Decline
                </AnimatedButton>
              </>
            )}
            {match.status === "in_transit" && (
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                Update Status
              </AnimatedButton>
            )}
            {match.status === "delivered" && !match.rating && (
              <AnimatedButton size="sm" variant="outline" className="flex-1">
                Rate & Review
              </AnimatedButton>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = () => {
    const emptyStates = {
      pending: {
        icon: Clock,
        title: "No pending requests",
        description: (isSender: boolean) =>
          isSender
            ? "Browse trips to send your packages"
            : "Check parcel requests to find packages to carry",
        action: (isSender: boolean) =>
          isSender
            ? { label: "Browse Trips", href: "/marketplace/trips" }
            : {
                label: "View Parcel Requests",
                href: "/dashboard/parcel-requests",
              },
      },
      active: {
        icon: Truck,
        title: "No active deliveries",
        description: () => "Your accepted matches will appear here",
        action: () => null,
      },
      completed: {
        icon: CheckCircle,
        title: "No completed deliveries yet",
        description: () => "Your delivery history will appear here",
        action: () => null,
      },
    };

    const state = emptyStates[activeTab];
    const Icon = state.icon;
    const action = state.action(roleFilter === "sender");

    return (
      <Card className="p-12 text-center">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{state.title}</h3>
        <p className="text-gray-600 mb-6">
          {state.description(roleFilter === "sender")}
        </p>
        {action && (
          <AnimatedButton onClick={() => navigate(action.href)}>{action.label}</AnimatedButton>
        )}
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Matches Hub</h1>
            <p className="text-gray-600 mt-1">
              Manage all your deliveries in one place
            </p>
          </div>

          {/* Global Action */}
          <AnimatedButton
            onClick={() =>
              navigate(
                roleFilter === "traveler"
                  ? "/dashboard/parcel-requests"
                  : "/marketplace/trips"
              )
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Find New {roleFilter === "traveler" ? "Parcels" : "Trips"}
          </AnimatedButton>
        </div>

        {/* Stats Overview */}
        {stats.requiresAction > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-900">
                  {stats.requiresAction}{" "}
                  {stats.requiresAction === 1
                    ? "match requires"
                    : "matches require"}{" "}
                  your attention
                </span>
              </div>
              <AnimatedButton
                size="sm"
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-100"
                onClick={() => handleTabChange("pending")}
              >
                View Now
              </AnimatedButton>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="pending" className="relative">
                <Clock className="h-4 w-4 mr-2" />
                Pending
                {stats.pending > 0 && (
                  <Badge
                    className="ml-2 h-5 px-1.5 min-w-[20px]"
                    variant="secondary"
                  >
                    {stats.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">
                <Truck className="h-4 w-4 mr-2" />
                Active
                {stats.active > 0 && (
                  <Badge
                    className="ml-2 h-5 px-1.5 min-w-[20px]"
                    variant="secondary"
                  >
                    {stats.active}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </TabsTrigger>
            </TabsList>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <AnimatedButton
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </AnimatedButton>
              <AnimatedButton
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </AnimatedButton>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search routes, users..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={roleFilter}
                  onValueChange={v => setRoleFilter(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="sender">As Sender</SelectItem>
                    <SelectItem value="traveler">As Traveler</SelectItem>
                  </SelectContent>
                </Select>

                <DateRangePicker
                  startDate={dateRange?.from}
                  endDate={dateRange?.to}
                  onStartDateChange={date =>
                    setDateRange(prev => ({ ...prev, from: date }))
                  }
                  onEndDateChange={date =>
                    setDateRange(prev => ({ ...prev, to: date }))
                  }
                  placeholder="Date range"
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={checked =>
                      setVerifiedOnly(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Verified only
                  </label>
                </div>

                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                    setDateRange(undefined);
                    setVerifiedOnly(false);
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <TabsContent value="pending" className="mt-0">
            {currentMatches.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
                {currentMatches.map(renderMatchCard)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {currentMatches.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
                {currentMatches.map(renderMatchCard)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {currentMatches.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                )}
              >
                {currentMatches.map(renderMatchCard)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
