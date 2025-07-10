import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  Download,
  TrendingUp,
  Package,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type Transaction = {
  id: string;
  type: "delivery-earning" | "withdrawal" | "escrow-release";
  description: string;
  amount: number;
  status: "pending" | "completed" | "processing";
  date: string;
  matchId?: string;
  withdrawalMethod?: string;
};

export default function WalletTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "delivery-earning",
      description: "Package delivery to Miami",
      amount: 85.00,
      status: "completed",
      date: "2025-01-09",
      matchId: "M-2025-001"
    },
    {
      id: "2",
      type: "escrow-release",
      description: "Escrow release - NYC to Boston",
      amount: 120.00,
      status: "completed",
      date: "2025-01-08",
      matchId: "M-2025-002"
    },
    {
      id: "3",
      type: "withdrawal",
      description: "Bank transfer withdrawal",
      amount: -500.00,
      status: "processing",
      date: "2025-01-07",
      withdrawalMethod: "Bank Transfer"
    },
    {
      id: "4",
      type: "delivery-earning",
      description: "Package delivery to Chicago",
      amount: 65.00,
      status: "pending",
      date: "2025-01-06",
      matchId: "M-2025-003"
    },
    {
      id: "5",
      type: "delivery-earning",
      description: "Package delivery to Los Angeles",
      amount: 95.00,
      status: "completed",
      date: "2025-01-05",
      matchId: "M-2025-004"
    },
    {
      id: "6",
      type: "withdrawal",
      description: "PayPal withdrawal",
      amount: -200.00,
      status: "completed",
      date: "2025-01-04",
      withdrawalMethod: "PayPal"
    },
    {
      id: "7",
      type: "escrow-release",
      description: "Escrow release - San Francisco to Seattle",
      amount: 140.00,
      status: "completed",
      date: "2025-01-03",
      matchId: "M-2025-005"
    },
    {
      id: "8",
      type: "delivery-earning",
      description: "Package delivery to Denver",
      amount: 75.00,
      status: "pending",
      date: "2025-01-02",
      matchId: "M-2025-006"
    }
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.matchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.withdrawalMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "withdrawal" ? TrendingUp : Package;
  };

  const totalEarnings = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = Math.abs(filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/wallet">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wallet
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 font-bold text-airbar-black">Transaction History</h1>
              <p className="text-gray-600">Complete record of your financial activity</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">
                    +${totalEarnings.toFixed(2)}
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
                  <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-blue-600">
                    -${totalWithdrawals.toFixed(2)}
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
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredTransactions.length}
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
                  placeholder="Search transactions..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="delivery-earning">Delivery Earnings</SelectItem>
                  <SelectItem value="escrow-release">Escrow Release</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  const IconComponent = getTypeIcon(transaction.type);
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          transaction.type === "delivery-earning" || transaction.type === "escrow-release" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{transaction.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {transaction.date}
                            </span>
                            {transaction.matchId && (
                              <span>Match: {transaction.matchId}</span>
                            )}
                            {transaction.withdrawalMethod && (
                              <span>{transaction.withdrawalMethod}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}