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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Search,
  Filter,
  Download,
  Printer,
  Package,
  ArrowRight,
  Calendar,
  User,
  MapPin,
  Eye,
  Archive,
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DateRange } from "react-day-picker";

type HistoryRecord = {
  id: string;
  matchId: string;
  packageTitle: string;
  packageDescription: string;
  fromCity: string;
  toCity: string;
  status: "delivered" | "cancelled" | "declined" | "refunded";
  userRole: "sender" | "traveler";
  otherUserName: string;
  otherUserRating: number;
  weight: number;
  size: string;
  rewardAmount: number;
  completedDate: string;
  createdDate: string;
  hasDispute: boolean;
  archived: boolean;
};

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards");

  const mockHistoryRecords: HistoryRecord[] = [
    {
      id: "H001",
      matchId: "M-2024-156",
      packageTitle: "Electronics Package",
      packageDescription: "Laptop and accessories for business meeting",
      fromCity: "New York",
      toCity: "Miami",
      status: "delivered",
      userRole: "traveler",
      otherUserName: "Sarah Johnson",
      otherUserRating: 4.8,
      weight: 3.5,
      size: "Medium",
      rewardAmount: 85.0,
      completedDate: "2024-12-28",
      createdDate: "2024-12-20",
      hasDispute: false,
      archived: false,
    },
    {
      id: "H002",
      matchId: "M-2024-143",
      packageTitle: "Holiday Gifts",
      packageDescription: "Christmas presents for family",
      fromCity: "Boston",
      toCity: "Chicago",
      status: "delivered",
      userRole: "sender",
      otherUserName: "Michael Chen",
      otherUserRating: 4.9,
      weight: 2.1,
      size: "Large",
      rewardAmount: 120.0,
      completedDate: "2024-12-22",
      createdDate: "2024-12-15",
      hasDispute: false,
      archived: false,
    },
    {
      id: "H003",
      matchId: "M-2024-128",
      packageTitle: "Business Documents",
      packageDescription: "Legal contracts and paperwork",
      fromCity: "Los Angeles",
      toCity: "San Francisco",
      status: "cancelled",
      userRole: "traveler",
      otherUserName: "Emma Rodriguez",
      otherUserRating: 4.6,
      weight: 0.5,
      size: "Small",
      rewardAmount: 45.0,
      completedDate: "2024-12-18",
      createdDate: "2024-12-10",
      hasDispute: true,
      archived: false,
    },
    {
      id: "H004",
      matchId: "M-2024-112",
      packageTitle: "Medical Supplies",
      packageDescription: "Prescription medications for elderly parent",
      fromCity: "Seattle",
      toCity: "Portland",
      status: "declined",
      userRole: "sender",
      otherUserName: "David Kim",
      otherUserRating: 4.7,
      weight: 1.2,
      size: "Small",
      rewardAmount: 60.0,
      completedDate: "2024-12-14",
      createdDate: "2024-12-08",
      hasDispute: false,
      archived: false,
    },
    {
      id: "H005",
      matchId: "M-2024-098",
      packageTitle: "Art Supplies",
      packageDescription: "Painting materials for art class",
      fromCity: "Austin",
      toCity: "Dallas",
      status: "refunded",
      userRole: "sender",
      otherUserName: "Lisa Thompson",
      otherUserRating: 4.4,
      weight: 4.2,
      size: "Large",
      rewardAmount: 95.0,
      completedDate: "2024-12-10",
      createdDate: "2024-12-01",
      hasDispute: true,
      archived: false,
    },
    {
      id: "H006",
      matchId: "M-2024-087",
      packageTitle: "Books Collection",
      packageDescription: "Rare books for university library",
      fromCity: "Denver",
      toCity: "Salt Lake City",
      status: "delivered",
      userRole: "traveler",
      otherUserName: "Robert Wilson",
      otherUserRating: 5.0,
      weight: 5.8,
      size: "Large",
      rewardAmount: 110.0,
      completedDate: "2024-12-05",
      createdDate: "2024-11-28",
      hasDispute: false,
      archived: false,
    },
  ];

  const filteredRecords = mockHistoryRecords.filter(record => {
    const matchesSearch =
      record.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.packageDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.matchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${record.fromCity} ${record.toCity}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || record.userRole === roleFilter;
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    // Simple date filtering - in real app would use proper date comparison
    const matchesDate =
      !dateRange?.from || new Date(record.completedDate) >= dateRange.from;

    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "declined":
        return "bg-orange-100 text-orange-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    return role === "traveler"
      ? "bg-blue-100 text-blue-800"
      : "bg-indigo-100 text-indigo-800";
  };

  const getTotalStats = () => {
    const delivered = filteredRecords.filter(
      r => r.status === "delivered"
    ).length;
    const cancelled = filteredRecords.filter(
      r => r.status === "cancelled"
    ).length;
    const totalEarned = filteredRecords
      .filter(r => r.userRole === "traveler" && r.status === "delivered")
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    const totalPaid = filteredRecords
      .filter(r => r.userRole === "sender" && r.status === "delivered")
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    return { delivered, cancelled, totalEarned, totalPaid };
  };

  const stats = getTotalStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">
              Delivery History
            </h1>
            <p className="text-gray-600">
              Complete record of your delivery activity and transactions
            </p>
          </div>
          <div className="flex space-x-3">
            <AnimatedButton variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </AnimatedButton>
            <AnimatedButton variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </AnimatedButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Delivered</p>
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
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${stats.totalPaid.toFixed(2)}
                  </p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages, routes, users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="traveler">As Traveler</SelectItem>
                  <SelectItem value="sender">As Sender</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
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
                placeholder="Select date range"
              />

              <AnimatedButton
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                  setDateRange(undefined);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <div className="flex space-x-4">
          <Link href="/dashboard/history/traveler">
            <AnimatedButton variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Traveler History</span>
            </AnimatedButton>
          </Link>
          <Link href="/dashboard/history/sender">
            <AnimatedButton variant="outline" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Sender History</span>
            </AnimatedButton>
          </Link>
        </div>

        {/* History Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>History Records ({filteredRecords.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <AnimatedButton
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  Cards
                </AnimatedButton>
                <AnimatedButton
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </AnimatedButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No history records found
                </h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "cards"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {filteredRecords.map(record => (
                  <div
                    key={record.id}
                    className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                      viewMode === "list"
                        ? "flex items-center justify-between"
                        : ""
                    }`}
                  >
                    <div
                      className={
                        viewMode === "cards"
                          ? "space-y-4"
                          : "flex-1 grid grid-cols-6 gap-4 items-center"
                      }
                    >
                      {/* Header */}
                      <div
                        className={
                          viewMode === "cards"
                            ? "flex items-start justify-between"
                            : "col-span-2"
                        }
                      >
                        <div>
                          <h3 className="font-semibold text-lg">
                            {record.packageTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {record.matchId}
                          </p>
                          {viewMode === "cards" && (
                            <p className="text-sm text-gray-500 mt-1">
                              {record.packageDescription}
                            </p>
                          )}
                        </div>
                        {viewMode === "cards" && record.hasDispute && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            Dispute
                          </Badge>
                        )}
                      </div>

                      {/* Route */}
                      <div
                        className={
                          viewMode === "cards"
                            ? "flex items-center space-x-2 text-gray-600"
                            : ""
                        }
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{record.fromCity}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-sm">{record.toCity}</span>
                      </div>

                      {/* User and Role */}
                      <div
                        className={
                          viewMode === "list"
                            ? ""
                            : "flex items-center justify-between"
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {record.otherUserName}
                          </span>
                          <span className="text-xs text-gray-500">
                            ★ {record.otherUserRating}
                          </span>
                        </div>
                        {viewMode === "cards" && (
                          <Badge
                            variant="secondary"
                            className={getRoleColor(record.userRole)}
                          >
                            {record.userRole === "traveler"
                              ? "As Traveler"
                              : "As Sender"}
                          </Badge>
                        )}
                      </div>

                      {/* Details */}
                      <div
                        className={
                          viewMode === "list"
                            ? "text-sm text-gray-600"
                            : "text-sm text-gray-600 space-y-1"
                        }
                      >
                        <div>
                          Weight: {record.weight}kg • Size: {record.size}
                        </div>
                        {viewMode === "cards" && (
                          <div>Completed: {record.completedDate}</div>
                        )}
                      </div>

                      {/* Amount and Status */}
                      <div
                        className={
                          viewMode === "list"
                            ? "text-right"
                            : "flex items-center justify-between"
                        }
                      >
                        <div>
                          <p className="font-semibold text-lg">
                            {record.userRole === "traveler" ? "+" : "-"}$
                            {record.rewardAmount.toFixed(2)}
                          </p>
                          {viewMode === "list" && (
                            <p className="text-xs text-gray-500">
                              {record.completedDate}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(record.status)}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Role Badge for List View */}
                      {viewMode === "list" && (
                        <div>
                          <Badge
                            variant="secondary"
                            className={getRoleColor(record.userRole)}
                          >
                            {record.userRole === "traveler"
                              ? "Traveler"
                              : "Sender"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      className={
                        viewMode === "cards"
                          ? "flex items-center justify-between pt-4 border-t"
                          : "ml-4"
                      }
                    >
                      {viewMode === "cards" && record.hasDispute && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800"
                        >
                          Dispute
                        </Badge>
                      )}
                      <Link href={`/dashboard/history/view/${record.id}`}>
                        <AnimatedButton variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </AnimatedButton>
                      </Link>
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
