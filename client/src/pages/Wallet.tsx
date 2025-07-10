import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  Clock, 
  Shield,
  TrendingUp,
  ArrowUpRight,
  Package,
  Download,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type WalletData = {
  availableBalance: number;
  pendingEarnings: number;
  escrowBalance: number;
  totalEarned: number;
};

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

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Mock data - in real app this would come from API
  const mockWalletData: WalletData = {
    availableBalance: 1247.50,
    pendingEarnings: 185.00,
    escrowBalance: 320.00,
    totalEarned: 3420.75
  };

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
    }
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (activeTab === "all") return true;
    if (activeTab === "earnings") return transaction.type === "delivery-earning" || transaction.type === "escrow-release";
    if (activeTab === "withdrawals") return transaction.type === "withdrawal";
    return true;
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Wallet Dashboard</h1>
            <p className="text-gray-600">Track your earnings, withdrawals, and financial activity</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/dashboard/wallet/transactions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${mockWalletData.availableBalance.toFixed(2)}
                    </p>
                  </div>
                  <WalletIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-3 flex items-center text-sm text-green-600">
                  <span>Ready to withdraw</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/wallet/transactions?filter=pending">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Earnings</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      ${mockWalletData.pendingEarnings.toFixed(2)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="mt-3 flex items-center text-sm text-yellow-600">
                  <span>Awaiting delivery confirmation</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/wallet/escrow">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">In Escrow</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${mockWalletData.escrowBalance.toFixed(2)}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-3 flex items-center text-sm text-blue-600">
                  <span>Held during delivery</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/wallet/transactions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ${mockWalletData.totalEarned.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-3 flex items-center text-sm text-purple-600">
                  <span>Lifetime earnings</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/wallet/withdrawals">
            <Button className="w-full h-16 bg-green-600 hover:bg-green-700">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                <span>Withdraw Funds</span>
              </div>
            </Button>
          </Link>
          
          <Link href="/dashboard/wallet/escrow">
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-1" />
                <span>View Escrow</span>
              </div>
            </Button>
          </Link>
          
          <Link href="/dashboard/wallet/transactions">
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-1" />
                <span>View All Transactions</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="earnings">Delivery Earnings</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No transactions found for this category.
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-start space-x-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            transaction.type === "delivery-earning" || transaction.type === "escrow-release" 
                              ? "bg-green-100 text-green-600" 
                              : "bg-blue-100 text-blue-600"
                          }`}>
                            {transaction.type === "withdrawal" ? (
                              <TrendingUp className="h-6 w-6" />
                            ) : (
                              <Package className="h-6 w-6" />
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <p className="text-sm text-gray-600">
                              {transaction.matchId && `Match: ${transaction.matchId} • `}
                              {transaction.withdrawalMethod && `${transaction.withdrawalMethod} • `}
                              {transaction.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Financial Pages Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/wallet/escrow">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Escrow Management</h3>
                    <p className="text-sm text-gray-600">Monitor funds held during delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/wallet/withdrawals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Withdrawals & Methods</h3>
                    <p className="text-sm text-gray-600">Manage payout methods and history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/wallet/transactions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Transaction History</h3>
                    <p className="text-sm text-gray-600">Complete financial activity log</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}