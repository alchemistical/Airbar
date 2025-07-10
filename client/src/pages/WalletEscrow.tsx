import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Lock, 
  Package, 
  MapPin, 
  Calendar, 
  Clock,
  User,
  CheckCircle,
  Star,
  Search,
  Filter,
  Info,
  AlertCircle,
  DollarSign
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type EscrowItem = {
  id: string;
  matchId: string;
  parcelTitle: string;
  parcelDescription: string;
  senderName: string;
  senderRating: number;
  senderIsKyc: boolean;
  route: string;
  fromCity: string;
  toCity: string;
  weight: number;
  amount: number;
  status: "picked-up" | "in-transit" | "awaiting-confirmation" | "disputed";
  deliveryEta: string;
  releaseCondition: string;
  releaseDate: string;
  createdDate: string;
  notes?: string;
};

export default function WalletEscrow() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const mockEscrowItems: EscrowItem[] = [
    {
      id: "ESC-001",
      matchId: "TRK-2025-001",
      parcelTitle: "Business Documents",
      parcelDescription: "Legal contracts and signed agreements",
      senderName: "Sarah Chen",
      senderRating: 4.8,
      senderIsKyc: true,
      route: "New York → San Francisco",
      fromCity: "New York",
      toCity: "San Francisco",
      weight: 0.5,
      amount: 85.00,
      status: "in-transit",
      deliveryEta: "2025-01-12",
      releaseCondition: "Auto-release 24 hours after delivery confirmation",
      releaseDate: "2025-01-13",
      createdDate: "2025-01-09",
      notes: "Priority delivery - high value documents"
    },
    {
      id: "ESC-002",
      matchId: "TRK-2025-002",
      parcelTitle: "Electronics Package",
      parcelDescription: "Smartphone and accessories for family",
      senderName: "Mike Rodriguez",
      senderRating: 4.9,
      senderIsKyc: true,
      route: "Austin → Denver",
      fromCity: "Austin",
      toCity: "Denver",
      weight: 2.3,
      amount: 120.00,
      status: "picked-up",
      deliveryEta: "2025-01-13",
      releaseCondition: "Released after delivery confirmation by sender",
      releaseDate: "2025-01-14",
      createdDate: "2025-01-10"
    },
    {
      id: "ESC-003",
      matchId: "TRK-2025-003",
      parcelTitle: "Gift Package",
      parcelDescription: "Birthday present for daughter",
      senderName: "Lisa Park",
      senderRating: 4.7,
      senderIsKyc: true,
      route: "Seattle → Portland",
      fromCity: "Seattle",
      toCity: "Portland",
      weight: 1.8,
      amount: 65.00,
      status: "awaiting-confirmation",
      deliveryEta: "2025-01-11",
      releaseCondition: "Manual release pending dispute resolution",
      releaseDate: "2025-01-15",
      createdDate: "2025-01-08",
      notes: "Delivery completed but sender disputes condition"
    },
    {
      id: "ESC-004",
      matchId: "TRK-2025-004",
      parcelTitle: "Medical Supplies",
      parcelDescription: "Emergency medication delivery",
      senderName: "Dr. Jennifer Park",
      senderRating: 5.0,
      senderIsKyc: true,
      route: "Boston → Philadelphia",
      fromCity: "Boston",
      toCity: "Philadelphia",
      weight: 0.8,
      amount: 150.00,
      status: "disputed",
      deliveryEta: "2025-01-09",
      releaseCondition: "On hold pending support review",
      releaseDate: "Pending",
      createdDate: "2025-01-08",
      notes: "Package delivered late, compensation under review"
    }
  ];

  const filteredItems = mockEscrowItems.filter(item => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery && !item.parcelTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.matchId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.senderName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "amount":
        return b.amount - a.amount;
      case "eta":
        return new Date(a.deliveryEta).getTime() - new Date(b.deliveryEta).getTime();
      default: // newest
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
  });

  const totalEscrowAmount = mockEscrowItems.reduce((sum, item) => sum + item.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "picked-up":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "awaiting-confirmation":
        return "bg-purple-100 text-purple-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "picked-up":
        return "Picked Up";
      case "in-transit":
        return "In Transit";
      case "awaiting-confirmation":
        return "Awaiting Confirmation";
      case "disputed":
        return "Disputed";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 font-bold text-airbar-black">Escrow Funds</h1>
              <p className="text-gray-600">Monitor funds held in escrow during delivery</p>
            </div>
            
            <Card className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total in Escrow</p>
                <p className="text-2xl font-bold text-yellow-600">${totalEscrowAmount.toFixed(2)}</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by match ID, parcel, or sender..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="picked-up">Picked Up</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="awaiting-confirmation">Awaiting Confirmation</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="amount">By Amount</SelectItem>
                      <SelectItem value="eta">By ETA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-600">
                  {filteredItems.length} of {mockEscrowItems.length} items
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <h3 className="font-medium mb-2">How Escrow Works</h3>
                  <ul className="space-y-1">
                    <li>• Funds are locked in escrow when a delivery is confirmed</li>
                    <li>• Money is released automatically when delivery conditions are met</li>
                    <li>• Disputed deliveries require manual review by support team</li>
                    <li>• Released funds appear in your available balance within 24 hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Items */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Lock className="h-6 w-6 text-yellow-600" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{item.parcelTitle}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusLabel(item.status)}
                            </Badge>
                            {item.status === "disputed" && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{item.parcelDescription}</p>
                          <p className="text-xs text-gray-500">Match ID: {item.matchId}</p>
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{item.senderName}</span>
                              {item.senderIsKyc && <CheckCircle className="h-3 w-3 text-green-500" />}
                              <div className="flex items-center ml-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="ml-1">{item.senderRating}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.route}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Package className="h-4 w-4" />
                              <span>{item.weight}kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600 mb-1">
                          ${item.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Escrowed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>ETA: {new Date(item.deliveryEta).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          Release: {item.releaseDate === "Pending" ? "Pending" : new Date(item.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>Created: {new Date(item.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-sm text-gray-600 flex items-center space-x-1 cursor-help">
                                <Info className="h-4 w-4" />
                                <span>{item.releaseCondition}</span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="max-w-xs">
                                <p className="font-medium mb-1">Release Condition Details</p>
                                <p className="text-sm">{item.releaseCondition}</p>
                                {item.notes && (
                                  <p className="text-sm mt-2 text-gray-600">Note: {item.notes}</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-2 italic">{item.notes}</p>
                          )}
                        </div>
                        
                        {item.status === "disputed" && (
                          <Button variant="outline" size="sm" className="ml-4">
                            Contact Support
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No escrow items found</h3>
                  <p className="text-gray-600">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Your escrow funds will appear here when deliveries are in progress"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}