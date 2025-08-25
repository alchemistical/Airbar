import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowLeft,
  Package,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type TravelerHistoryRecord = {
  id: string;
  matchId: string;
  packageTitle: string;
  packageDescription: string;
  fromCity: string;
  toCity: string;
  status: "delivered" | "cancelled" | "declined";
  senderName: string;
  senderRating: number;
  weight: number;
  size: string;
  rewardEarned: number;
  completedDate: string;
  hasDispute: boolean;
};

export default function HistoryTraveler() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const mockTravelerRecords: TravelerHistoryRecord[] = [
    {
      id: "H001",
      matchId: "M-2024-156",
      packageTitle: "Electronics Package",
      packageDescription: "Laptop and accessories for business meeting",
      fromCity: "New York",
      toCity: "Miami",
      status: "delivered",
      senderName: "Sarah Johnson",
      senderRating: 4.8,
      weight: 3.5,
      size: "Medium",
      rewardEarned: 85.0,
      completedDate: "2024-12-28",
      hasDispute: false,
    },
    {
      id: "H003",
      matchId: "M-2024-128",
      packageTitle: "Business Documents",
      packageDescription: "Legal contracts and paperwork",
      fromCity: "Los Angeles",
      toCity: "San Francisco",
      status: "cancelled",
      senderName: "Emma Rodriguez",
      senderRating: 4.6,
      weight: 0.5,
      size: "Small",
      rewardEarned: 45.0,
      completedDate: "2024-12-18",
      hasDispute: true,
    },
    {
      id: "H006",
      matchId: "M-2024-087",
      packageTitle: "Books Collection",
      packageDescription: "Rare books for university library",
      fromCity: "Denver",
      toCity: "Salt Lake City",
      status: "delivered",
      senderName: "Robert Wilson",
      senderRating: 5.0,
      weight: 5.8,
      size: "Large",
      rewardEarned: 110.0,
      completedDate: "2024-12-05",
      hasDispute: false,
    },
  ];

  const filteredRecords = mockTravelerRecords.filter(record => {
    const matchesSearch =
      record.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.packageDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.matchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${record.fromCity} ${record.toCity}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.completedDate).getTime() -
          new Date(a.completedDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.completedDate).getTime() -
          new Date(b.completedDate).getTime()
        );
      case "earnings":
        return b.rewardEarned - a.rewardEarned;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "declined":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalStats = () => {
    const delivered = filteredRecords.filter(
      r => r.status === "delivered"
    ).length;
    const totalEarned = filteredRecords
      .filter(r => r.status === "delivered")
      .reduce((sum, r) => sum + r.rewardEarned, 0);
    const avgRating =
      filteredRecords.length > 0
        ? filteredRecords.reduce((sum, r) => sum + r.senderRating, 0) /
          filteredRecords.length
        : 0;

    return { delivered, totalEarned, avgRating };
  };

  const stats = getTotalStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/history">
              <AnimatedButton variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </AnimatedButton>
            </Link>
            <div>
              <h1 className="text-h1 font-bold text-airbar-black">
                Traveler Delivery History
              </h1>
              <p className="text-gray-600">Your record as a package carrier</p>
            </div>
          </div>
        </div>

        {/* Traveler Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Deliveries Completed
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.delivered}
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${stats.totalEarned.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Avg Sender Rating
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.avgRating.toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Records</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {filteredRecords.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="earnings">Highest Earnings</SelectItem>
                </SelectContent>
              </Select>

              <AnimatedButton
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("newest");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>

        {/* Traveler History Records */}
        <Card>
          <CardHeader>
            <CardTitle>
              Traveler Delivery Records ({sortedRecords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No traveler records found
                </h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedRecords.map(record => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {record.packageTitle}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {record.matchId} • {record.packageDescription}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {record.hasDispute && (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800"
                              >
                                Dispute
                              </Badge>
                            )}
                            <Badge
                              variant="secondary"
                              className={getStatusColor(record.status)}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Route and Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{record.fromCity}</span>
                            <ArrowRight className="h-4 w-4" />
                            <span className="text-sm">{record.toCity}</span>
                          </div>

                          <div className="text-sm text-gray-600">
                            Weight: {record.weight}kg • Size: {record.size}
                          </div>
                        </div>

                        {/* Sender Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Sender:
                            </span>
                            <span className="text-sm font-medium">
                              {record.senderName}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">
                                {record.senderRating}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            Completed: {record.completedDate}
                          </span>
                        </div>
                      </div>

                      {/* Earnings and Actions */}
                      <div className="ml-6 text-right space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Earned</p>
                          <p className="text-2xl font-bold text-green-600">
                            +${record.rewardEarned.toFixed(2)}
                          </p>
                        </div>
                        <Link href={`/dashboard/history/view/${record.id}`}>
                          <AnimatedButton variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </AnimatedButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
