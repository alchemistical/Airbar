import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  ArrowLeft,
  Package,
  CreditCard,
  Calendar,
  Star,
  MapPin,
  ArrowRight,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type SenderHistoryRecord = {
  id: string;
  matchId: string;
  packageTitle: string;
  packageDescription: string;
  fromCity: string;
  toCity: string;
  status: "delivered" | "cancelled" | "declined" | "refunded";
  travelerName: string;
  travelerRating: number;
  weight: number;
  size: string;
  amountPaid: number;
  completedDate: string;
  hasDispute: boolean;
};

export default function HistorySender() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const mockSenderRecords: SenderHistoryRecord[] = [
    {
      id: "H002",
      matchId: "M-2024-143",
      packageTitle: "Holiday Gifts",
      packageDescription: "Christmas presents for family",
      fromCity: "Boston",
      toCity: "Chicago",
      status: "delivered",
      travelerName: "Michael Chen",
      travelerRating: 4.9,
      weight: 2.1,
      size: "Large",
      amountPaid: 120.00,
      completedDate: "2024-12-22",
      hasDispute: false
    },
    {
      id: "H004",
      matchId: "M-2024-112",
      packageTitle: "Medical Supplies",
      packageDescription: "Prescription medications for elderly parent",
      fromCity: "Seattle",
      toCity: "Portland",
      status: "declined",
      travelerName: "David Kim",
      travelerRating: 4.7,
      weight: 1.2,
      size: "Small",
      amountPaid: 60.00,
      completedDate: "2024-12-14",
      hasDispute: false
    },
    {
      id: "H005",
      matchId: "M-2024-098",
      packageTitle: "Art Supplies",
      packageDescription: "Painting materials for art class",
      fromCity: "Austin",
      toCity: "Dallas",
      status: "refunded",
      travelerName: "Lisa Thompson",
      travelerRating: 4.4,
      weight: 4.2,
      size: "Large",
      amountPaid: 95.00,
      completedDate: "2024-12-10",
      hasDispute: true
    }
  ];

  const filteredRecords = mockSenderRecords.filter(record => {
    const matchesSearch = 
      record.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.packageDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.matchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${record.fromCity} ${record.toCity}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
      case "oldest":
        return new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime();
      case "amount":
        return b.amountPaid - a.amountPaid;
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
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalStats = () => {
    const delivered = filteredRecords.filter(r => r.status === "delivered").length;
    const totalPaid = filteredRecords
      .filter(r => r.status === "delivered")
      .reduce((sum, r) => sum + r.amountPaid, 0);
    const totalRefunded = filteredRecords
      .filter(r => r.status === "refunded")
      .reduce((sum, r) => sum + r.amountPaid, 0);
    const avgRating = filteredRecords.length > 0 
      ? filteredRecords.reduce((sum, r) => sum + r.travelerRating, 0) / filteredRecords.length 
      : 0;

    return { delivered, totalPaid, totalRefunded, avgRating };
  };

  const stats = getTotalStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/history">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 font-bold text-airbar-black">Sender Package History</h1>
              <p className="text-gray-600">Your record as a package sender</p>
            </div>
          </div>
        </div>

        {/* Sender Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Packages Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-blue-600">${stats.totalPaid.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Refunded</p>
                  <p className="text-3xl font-bold text-purple-600">${stats.totalRefunded.toFixed(2)}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Traveler Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("newest");
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sender History Records */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Package Records ({sortedRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No sender records found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{record.packageTitle}</h3>
                            <p className="text-sm text-gray-600">{record.matchId} • {record.packageDescription}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {record.hasDispute && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Dispute
                              </Badge>
                            )}
                            <Badge variant="secondary" className={getStatusColor(record.status)}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
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

                        {/* Traveler Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Traveler:</span>
                            <span className="text-sm font-medium">{record.travelerName}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">{record.travelerRating}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">Completed: {record.completedDate}</span>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="ml-6 text-right space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {record.status === "refunded" ? "Refunded" : "Paid"}
                          </p>
                          <p className={`text-2xl font-bold ${
                            record.status === "refunded" ? "text-purple-600" : "text-blue-600"
                          }`}>
                            {record.status === "refunded" ? "+" : "-"}${record.amountPaid.toFixed(2)}
                          </p>
                        </div>
                        <Link href={`/dashboard/history/view/${record.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
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