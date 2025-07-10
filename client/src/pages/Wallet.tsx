import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownLeft,
  Clock, 
  CreditCard,
  Landmark,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Gift,
  Users,
  MapPin,
  Package,
  Calendar,
  Info
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";

type UserRole = "traveler" | "sender";
type TransactionType = "earning" | "payout" | "bonus" | "payment" | "refund";
type TransactionStatus = "pending" | "completed" | "failed" | "processing";
type PayoutMethod = "bank" | "paypal" | "crypto";

type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  tripId?: string;
  parcelId?: string;
  method?: string;
};

type EscrowItem = {
  id: string;
  type: "trip" | "parcel";
  referenceId: string;
  description: string;
  amount: number;
  status: "picked-up" | "in-transit" | "awaiting-confirmation";
  eta: string;
  releaseCondition: string;
};

type PayoutMethodType = {
  id: string;
  type: PayoutMethod;
  name: string;
  identifier: string; // account number, email, wallet address
  isDefault: boolean;
  isVerified: boolean;
};

type WalletData = {
  availableBalance: number;
  pendingEarnings: number;
  escrowBalance: number;
  withdrawableBalance: number;
  totalEarned: number;
  totalPaid: number;
  referralBonus: number;
  referralCount: number;
};

export default function Wallet() {
  const [activeRole, setActiveRole] = useState<UserRole>("traveler");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPayoutSetup, setShowPayoutSetup] = useState(false);
  const [showEscrowDetails, setShowEscrowDetails] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from API
  const mockWalletData: WalletData = {
    availableBalance: 1247.50,
    pendingEarnings: 185.00,
    escrowBalance: 320.00,
    withdrawableBalance: 1247.50,
    totalEarned: 3420.75,
    totalPaid: 890.25,
    referralBonus: 125.00,
    referralCount: 5
  };

  const mockTransactions: Transaction[] = [
    {
      id: "TXN-001",
      type: "earning",
      description: "Delivery: Electronics → San Francisco",
      amount: 85.00,
      status: "completed",
      date: "2025-01-10",
      tripId: "TRP-001",
      parcelId: "PCL-001"
    },
    {
      id: "TXN-002",
      type: "payout",
      description: "Withdrawal to Bank Account",
      amount: -500.00,
      status: "completed",
      date: "2025-01-09",
      method: "Chase Bank ****1234"
    },
    {
      id: "TXN-003",
      type: "bonus",
      description: "Referral Bonus - Sarah Chen",
      amount: 25.00,
      status: "completed",
      date: "2025-01-08"
    },
    {
      id: "TXN-004",
      type: "earning",
      description: "Delivery: Documents → Boston",
      amount: 45.00,
      status: "pending",
      date: "2025-01-07",
      tripId: "TRP-002",
      parcelId: "PCL-002"
    },
    {
      id: "TXN-005",
      type: "payment",
      description: "Package Sent: Medical Supplies",
      amount: -120.00,
      status: "completed",
      date: "2025-01-06",
      parcelId: "PCL-003",
      method: "Credit Card ****5678"
    }
  ];

  const mockEscrowItems: EscrowItem[] = [
    {
      id: "ESC-001",
      type: "parcel",
      referenceId: "PCL-004",
      description: "Business Documents → New York",
      amount: 85.00,
      status: "in-transit",
      eta: "2025-01-12",
      releaseCondition: "Released after delivery confirmation"
    },
    {
      id: "ESC-002",
      type: "parcel",
      referenceId: "PCL-005",
      description: "Electronics → Los Angeles",
      amount: 120.00,
      status: "picked-up",
      eta: "2025-01-13",
      releaseCondition: "Released 24 hours after pickup"
    },
    {
      id: "ESC-003",
      type: "parcel",
      referenceId: "PCL-006",
      description: "Gift Package → Miami",
      amount: 65.00,
      status: "awaiting-confirmation",
      eta: "2025-01-11",
      releaseCondition: "Awaiting sender confirmation"
    }
  ];

  const mockPayoutMethods: PayoutMethodType[] = [
    {
      id: "PM-001",
      type: "bank",
      name: "Chase Bank",
      identifier: "****1234",
      isDefault: true,
      isVerified: true
    },
    {
      id: "PM-002",
      type: "paypal",
      name: "PayPal",
      identifier: "alex@email.com",
      isDefault: false,
      isVerified: true
    },
    {
      id: "PM-003",
      type: "crypto",
      name: "USDC Wallet",
      identifier: "0x1234...5678",
      isDefault: false,
      isVerified: false
    }
  ];

  const isKycVerified = true; // In real app, get from user data

  const filteredTransactions = mockTransactions.filter(transaction => {
    // Role-based filtering
    if (activeRole === "traveler") {
      if (!["earning", "payout", "bonus"].includes(transaction.type)) return false;
    } else {
      if (!["payment", "refund"].includes(transaction.type)) return false;
    }

    // Status filtering
    if (transactionFilter !== "all" && transaction.status !== transactionFilter) return false;

    // Search filtering
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "earning":
      case "bonus":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "payout":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case "payment":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case "picked-up":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "awaiting-confirmation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPayoutMethodIcon = (type: PayoutMethod) => {
    switch (type) {
      case "bank":
        return <Landmark className="h-4 w-4" />;
      case "paypal":
        return <CreditCard className="h-4 w-4" />;
      case "crypto":
        return <WalletIcon className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const handleWithdraw = () => {
    // In real app, this would make an API call
    console.log("Withdrawing:", { amount: withdrawAmount, method: selectedPayoutMethod });
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const renderBalanceSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Available Balance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ${mockWalletData.availableBalance.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <WalletIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          {activeRole === "traveler" && (
            <div className="mt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowWithdrawModal(true)}
                disabled={!isKycVerified || mockWalletData.withdrawableBalance === 0}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
              {!isKycVerified && (
                <p className="text-xs text-red-600 mt-2 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  KYC verification required
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending/Escrow Balance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {activeRole === "traveler" ? "Pending Earnings" : "Escrow Balance"}
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                ${activeRole === "traveler" ? mockWalletData.pendingEarnings.toFixed(2) : mockWalletData.escrowBalance.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowEscrowDetails(!showEscrowDetails)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Total Earned/Paid */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {activeRole === "traveler" ? "Total Earned" : "Total Paid"}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ${activeRole === "traveler" ? mockWalletData.totalEarned.toFixed(2) : mockWalletData.totalPaid.toFixed(2)}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          {activeRole === "traveler" && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Gift className="h-4 w-4 mr-2" />
              <span>+${mockWalletData.referralBonus} from {mockWalletData.referralCount} referrals</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEscrowDetails = () => (
    <Collapsible open={showEscrowDetails} onOpenChange={setShowEscrowDetails}>
      <CollapsibleContent>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Escrow Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEscrowItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{item.description}</h4>
                      <p className="text-sm text-gray-600">ID: {item.referenceId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${item.amount.toFixed(2)}</p>
                      <Badge className={getEscrowStatusColor(item.status)}>
                        {item.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>ETA: {new Date(item.eta).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-gray-400" />
                      <span>{item.releaseCondition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">How Escrow Works</p>
                  <p>Funds are held in escrow during delivery and automatically released to your available balance when delivery conditions are met.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderTransactionHistory = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{transaction.id}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      {transaction.method && (
                        <>
                          <span>•</span>
                          <span>{transaction.method}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                {searchQuery ? "Try adjusting your search or filters" : "Your transaction history will appear here"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderWithdrawModal = () => (
    <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowUpRight className="h-5 w-5" />
            <span>Withdraw Funds</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="text-lg"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Available: ${mockWalletData.withdrawableBalance.toFixed(2)}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0"
                onClick={() => setWithdrawAmount(mockWalletData.withdrawableBalance.toString())}
              >
                Withdraw All
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="method">Payout Method</Label>
            <Select value={selectedPayoutMethod} onValueChange={setSelectedPayoutMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Choose payout method" />
              </SelectTrigger>
              <SelectContent>
                {mockPayoutMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center space-x-2">
                      {getPayoutMethodIcon(method.type)}
                      <span>{method.name} {method.identifier}</span>
                      {method.isDefault && <Badge className="ml-2">Default</Badge>}
                      {method.isVerified && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2"
              onClick={() => setShowPayoutSetup(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Method
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Processing Time</p>
                <ul className="space-y-1">
                  <li>• Bank transfers: 1-3 business days</li>
                  <li>• PayPal: Instant</li>
                  <li>• Crypto: 10-30 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowWithdrawModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={!withdrawAmount || !selectedPayoutMethod}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Role Tabs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Wallet</h1>
            <p className="text-gray-600">Manage your earnings, payments, and withdrawals</p>
          </div>
        </div>

        {/* Role Selection */}
        <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as UserRole)}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="traveler">Traveler Wallet</TabsTrigger>
            <TabsTrigger value="sender">Sender Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="traveler" className="space-y-6">
            {renderBalanceSummary()}
            {renderEscrowDetails()}
            {renderTransactionHistory()}
          </TabsContent>

          <TabsContent value="sender" className="space-y-6">
            {renderBalanceSummary()}
            {renderTransactionHistory()}
          </TabsContent>
        </Tabs>

        {/* Referral Bonus Panel for Travelers */}
        {activeRole === "traveler" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Referral Program</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{mockWalletData.referralCount}</p>
                  <p className="text-sm text-gray-600">Successful Referrals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${mockWalletData.referralBonus}</p>
                  <p className="text-sm text-gray-600">Bonus Earned</p>
                </div>
                <div className="text-center">
                  <Button variant="outline">
                    <Gift className="h-4 w-4 mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Modal */}
        {renderWithdrawModal()}
      </div>
    </DashboardLayout>
  );
}