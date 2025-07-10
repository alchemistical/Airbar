import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  ArrowUpRight, 
  Plus,
  CreditCard,
  Landmark,
  Wallet as WalletIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Shield
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type WithdrawalHistory = {
  id: string;
  amount: number;
  method: string;
  methodType: "bank" | "paypal" | "crypto";
  status: "pending" | "completed" | "failed" | "processing";
  requestDate: string;
  completedDate?: string;
  transactionId?: string;
  fees: number;
  notes?: string;
};

type PayoutMethod = {
  id: string;
  type: "bank" | "paypal" | "crypto";
  name: string;
  identifier: string;
  isDefault: boolean;
  isVerified: boolean;
  addedDate: string;
  lastUsed?: string;
};

export default function WalletWithdrawals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PayoutMethod | null>(null);

  const mockWithdrawalHistory: WithdrawalHistory[] = [
    {
      id: "WD-001",
      amount: 500.00,
      method: "Chase Bank ****1234",
      methodType: "bank",
      status: "completed",
      requestDate: "2025-01-09",
      completedDate: "2025-01-11",
      transactionId: "TXN-ABC123",
      fees: 2.50
    },
    {
      id: "WD-002",
      amount: 250.00,
      method: "PayPal alex@email.com",
      methodType: "paypal",
      status: "completed",
      requestDate: "2025-01-05",
      completedDate: "2025-01-05",
      transactionId: "PP-XYZ789",
      fees: 0.00
    },
    {
      id: "WD-003",
      amount: 100.00,
      method: "USDC Wallet 0x1234...5678",
      methodType: "crypto",
      status: "processing",
      requestDate: "2025-01-10",
      fees: 1.00,
      notes: "Processing on blockchain"
    },
    {
      id: "WD-004",
      amount: 75.00,
      method: "Wells Fargo ****5678",
      methodType: "bank",
      status: "failed",
      requestDate: "2025-01-08",
      fees: 2.50,
      notes: "Account verification failed"
    },
    {
      id: "WD-005",
      amount: 300.00,
      method: "Chase Bank ****1234",
      methodType: "bank",
      status: "pending",
      requestDate: "2025-01-10",
      fees: 2.50,
      notes: "Business day processing"
    }
  ];

  const mockPayoutMethods: PayoutMethod[] = [
    {
      id: "PM-001",
      type: "bank",
      name: "Chase Bank",
      identifier: "****1234",
      isDefault: true,
      isVerified: true,
      addedDate: "2024-12-15",
      lastUsed: "2025-01-09"
    },
    {
      id: "PM-002",
      type: "paypal",
      name: "PayPal",
      identifier: "alex@email.com",
      isDefault: false,
      isVerified: true,
      addedDate: "2024-12-20",
      lastUsed: "2025-01-05"
    },
    {
      id: "PM-003",
      type: "crypto",
      name: "USDC Wallet",
      identifier: "0x1234...5678",
      isDefault: false,
      isVerified: false,
      addedDate: "2025-01-01"
    },
    {
      id: "PM-004",
      type: "bank",
      name: "Wells Fargo",
      identifier: "****5678",
      isDefault: false,
      isVerified: false,
      addedDate: "2025-01-08"
    }
  ];

  const filteredHistory = mockWithdrawalHistory.filter(item => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery && !item.method.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodIcon = (type: string) => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Withdrawals & Methods</h1>
            <p className="text-gray-600">Manage your withdrawal history and payout methods</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowAddMethod(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
            <Button onClick={() => setShowWithdrawModal(true)} className="bg-green-600 hover:bg-green-700">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Withdrawn</p>
                <p className="text-2xl font-bold text-blue-600">$1,225.00</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-green-600">$600.00</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">$400.00</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Fees</p>
                <p className="text-2xl font-bold text-gray-600">$8.50</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payout Methods</span>
              <Button variant="outline" size="sm" onClick={() => setShowAddMethod(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPayoutMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getMethodIcon(method.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{method.name}</span>
                          {method.isDefault && (
                            <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                          )}
                          {method.isVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {!method.isVerified && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.identifier}</p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(method.addedDate).toLocaleDateString()}
                          {method.lastUsed && ` • Last used ${new Date(method.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingMethod(method)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!method.isDefault && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!method.isVerified && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-800">Verification required for withdrawals</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Withdrawal History</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search withdrawals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
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
              {filteredHistory.length > 0 ? (
                filteredHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getMethodIcon(withdrawal.methodType)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">${withdrawal.amount.toFixed(2)}</span>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {withdrawal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{withdrawal.method}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{withdrawal.id}</span>
                          <span>•</span>
                          <span>Requested {new Date(withdrawal.requestDate).toLocaleDateString()}</span>
                          {withdrawal.completedDate && (
                            <>
                              <span>•</span>
                              <span>Completed {new Date(withdrawal.completedDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                        {withdrawal.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">{withdrawal.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Fee: ${withdrawal.fees.toFixed(2)}</p>
                      {withdrawal.transactionId && (
                        <p className="text-xs text-gray-500">{withdrawal.transactionId}</p>
                      )}
                      {withdrawal.status === "failed" && (
                        <Button variant="outline" size="sm" className="mt-2">
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ArrowUpRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawals found</h3>
                  <p className="text-gray-600">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Your withdrawal history will appear here"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Method Modal */}
        <Dialog open={showAddMethod} onOpenChange={setShowAddMethod}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payout Method</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label>Method Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose method type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Account Details</Label>
                <Input placeholder="Enter account information" />
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowAddMethod(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">
                  Add Method
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdraw Modal */}
        <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
                <p className="text-sm text-gray-600 mt-1">Available: $1,247.50</p>
              </div>

              <div>
                <Label>Payout Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose payout method" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPayoutMethods.filter(m => m.isVerified).map(method => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name} {method.identifier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowWithdrawModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Withdraw
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}