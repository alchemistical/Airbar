import { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type SenderPayment = {
  id: string;
  parcelId: string;
  parcelTitle: string;
  parcelDescription: string;
  travelerName: string;
  route: string;
  fromCity: string;
  toCity: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "in-escrow" | "refunded" | "processing";
  paymentDate: string;
  deliveryDate?: string;
  refundDate?: string;
  invoiceId: string;
  fees: number;
  notes?: string;
};

export default function WalletSender() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const mockSenderPayments: SenderPayment[] = [
    {
      id: "SP-001",
      parcelId: "PCL-001",
      parcelTitle: "Business Documents",
      parcelDescription: "Legal contracts and agreements",
      travelerName: "Alex Kim",
      route: "New York → San Francisco",
      fromCity: "New York",
      toCity: "San Francisco",
      amount: 85.0,
      paymentMethod: "Credit Card ****1234",
      status: "paid",
      paymentDate: "2025-01-08",
      deliveryDate: "2025-01-10",
      invoiceId: "INV-2025-001",
      fees: 3.4,
    },
    {
      id: "SP-002",
      parcelId: "PCL-002",
      parcelTitle: "Electronics Package",
      parcelDescription: "Smartphone and accessories",
      travelerName: "Sarah Chen",
      route: "Austin → Denver",
      fromCity: "Austin",
      toCity: "Denver",
      amount: 120.0,
      paymentMethod: "PayPal alex@email.com",
      status: "in-escrow",
      paymentDate: "2025-01-09",
      invoiceId: "INV-2025-002",
      fees: 4.8,
      notes: "Package picked up, in transit",
    },
    {
      id: "SP-003",
      parcelId: "PCL-003",
      parcelTitle: "Gift Package",
      parcelDescription: "Birthday present for family",
      travelerName: "Mike Rodriguez",
      route: "Seattle → Portland",
      fromCity: "Seattle",
      toCity: "Portland",
      amount: 65.0,
      paymentMethod: "Credit Card ****5678",
      status: "refunded",
      paymentDate: "2025-01-05",
      refundDate: "2025-01-07",
      invoiceId: "INV-2025-003",
      fees: 2.6,
      notes: "Package damaged during transit",
    },
    {
      id: "SP-004",
      parcelId: "PCL-004",
      parcelTitle: "Medical Supplies",
      parcelDescription: "Emergency medication",
      travelerName: "Dr. Jennifer Park",
      route: "Boston → Philadelphia",
      fromCity: "Boston",
      toCity: "Philadelphia",
      amount: 150.0,
      paymentMethod: "Credit Card ****1234",
      status: "processing",
      paymentDate: "2025-01-10",
      invoiceId: "INV-2025-004",
      fees: 6.0,
      notes: "Payment processing",
    },
    {
      id: "SP-005",
      parcelId: "PCL-005",
      parcelTitle: "Art Supplies",
      parcelDescription: "Professional painting materials",
      travelerName: "Lisa Park",
      route: "Chicago → Minneapolis",
      fromCity: "Chicago",
      toCity: "Minneapolis",
      amount: 95.0,
      paymentMethod: "PayPal alex@email.com",
      status: "paid",
      paymentDate: "2025-01-06",
      deliveryDate: "2025-01-08",
      invoiceId: "INV-2025-005",
      fees: 3.8,
    },
  ];

  const filteredPayments = mockSenderPayments
    .filter(payment => {
      if (statusFilter !== "all" && payment.status !== statusFilter)
        return false;
      if (
        searchQuery &&
        !payment.parcelTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !payment.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !payment.travelerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "status":
          return a.status.localeCompare(b.status);
        default: // newest
          return (
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
          );
      }
    });

  const totalPaid = mockSenderPayments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount + p.fees, 0);
  const inEscrow = mockSenderPayments
    .filter(p => p.status === "in-escrow")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = mockSenderPayments
    .filter(p => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFees = mockSenderPayments.reduce((sum, p) => sum + p.fees, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "in-escrow":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "in-escrow":
        return <Clock className="h-4 w-4" />;
      case "refunded":
        return <AlertCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Delivered & Paid";
      case "in-escrow":
        return "In Escrow";
      case "refunded":
        return "Refunded";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  const downloadInvoice = (payment: SenderPayment) => {
    // In real app, this would download the invoice
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">
              Sender Payments
            </h1>
            <p className="text-gray-600">
              Track your payment history for package deliveries
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${totalPaid.toFixed(2)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Escrow</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    ${inEscrow.toFixed(2)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Refunded</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${totalRefunded.toFixed(2)}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Fees</p>
                  <p className="text-3xl font-bold text-gray-600">
                    ${totalFees.toFixed(2)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
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
                    placeholder="Search by parcel, ID, or traveler..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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
                    <SelectItem value="paid">Delivered & Paid</SelectItem>
                    <SelectItem value="in-escrow">In Escrow</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="amount">By Amount</SelectItem>
                    <SelectItem value="status">By Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                {filteredPayments.length} of {mockSenderPayments.length}{" "}
                payments
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map(payment => (
              <Card
                key={payment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {payment.parcelTitle}
                          </h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">
                              {getStatusLabel(payment.status)}
                            </span>
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {payment.parcelDescription}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Parcel ID: {payment.parcelId} • Invoice:{" "}
                          {payment.invoiceId}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{payment.route}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span>Traveler: {payment.travelerName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 mb-1">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        + ${payment.fees.toFixed(2)} fees
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        Paid:{" "}
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </span>
                    </div>

                    {payment.deliveryDate && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span>
                          Delivered:{" "}
                          {new Date(payment.deliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {payment.refundDate && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span>
                          Refunded:{" "}
                          {new Date(payment.refundDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span>{payment.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {payment.notes && (
                          <p className="text-sm text-gray-600 italic">
                            {payment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(payment)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Invoice
                        </AnimatedButton>

                        <AnimatedButton variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No payments found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Your payment history will appear here when you send packages"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <h3 className="font-medium mb-2">Payment Process</h3>
                <ul className="space-y-1">
                  <li>
                    • Payments are charged when your package is picked up by the
                    traveler
                  </li>
                  <li>
                    • Funds are held in escrow until delivery is confirmed
                  </li>
                  <li>
                    • Refunds are processed automatically if delivery fails
                  </li>
                  <li>• Invoices and receipts are available for download</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
