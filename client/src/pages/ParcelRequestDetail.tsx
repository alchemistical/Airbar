import { useState } from "react";
import { useParams } from "wouter";
import { 
  Package, 
  MapPin, 
  Clock, 
  User,
  Star,
  CheckCircle,
  X,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Weight,
  DollarSign,
  Truck,
  AlertCircle,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

type ParcelRequestDetailType = {
  id: number;
  senderId: number;
  tripId: number | null;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  rewardAmount: string;
  status: string;
  deadline: string;
  createdAt: string;
  specialInstructions: string;
  // Sender info
  senderName: string;
  senderRating: number;
  senderIsKycVerified: boolean;
  senderJoinDate: string;
  // Traveler info (if matched)
  travelerName?: string;
  travelerRating?: number;
  travelerIsKycVerified?: boolean;
  // Trip info (if linked)
  tripRoute?: string;
  tripDate?: string;
  tripDepartureTime?: string;
  // Photos
  photos?: string[];
};

export default function ParcelRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  // Mock data - in real app, this would be fetched based on ID
  const parcelRequest: ParcelRequestDetailType = {
    id: parseInt(id || "1"),
    senderId: 2,
    tripId: 1,
    description: "Important Business Documents",
    pickupAddress: "123 Broadway, Suite 1001, New York, NY 10010",
    deliveryAddress: "456 Market Street, San Francisco, CA 94102",
    weight: 0.5,
    rewardAmount: "50.00",
    status: "pending",
    deadline: "2024-02-15T00:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    specialInstructions: "Please handle with extreme care. Contains confidential legal documents that must remain flat and dry. Pickup is available between 9 AM - 5 PM on weekdays. Delivery should be made to the reception desk on the 15th floor.",
    senderName: "Sarah Johnson",
    senderRating: 4.8,
    senderIsKycVerified: true,
    senderJoinDate: "2023-05-15",
    tripRoute: "New York → San Francisco",
    tripDate: "2024-02-10",
    tripDepartureTime: "08:00 AM",
    photos: []
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "declined": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAccept = () => {
    // In real app, this would make an API call
    console.log("Accepting parcel request:", id);
  };

  const handleDecline = () => {
    // In real app, this would make an API call with the reason
    console.log("Declining parcel request:", id, "Reason:", declineReason);
    setShowDeclineDialog(false);
    setDeclineReason("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/parcel-requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Parcel Request Details</h1>
            <p className="text-body text-gray-600">Request ID: #{parcelRequest.id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(parcelRequest.status)}>
          {parcelRequest.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Parcel Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-h4 font-semibold text-airbar-black mb-2">
                  {parcelRequest.description}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-small">
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Weight: {parcelRequest.weight} kg</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Reward: ${parcelRequest.rewardAmount}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pickup and Delivery */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-small font-medium text-gray-700">Pickup Location</span>
                  </div>
                  <p className="text-body text-airbar-black ml-5">{parcelRequest.pickupAddress}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-small font-medium text-gray-700">Delivery Location</span>
                  </div>
                  <p className="text-body text-airbar-black ml-5">{parcelRequest.deliveryAddress}</p>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="text-h5 font-medium text-airbar-black">Important Dates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-small font-medium text-gray-700">Created</p>
                      <p className="text-small text-gray-600">{formatDate(parcelRequest.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-small font-medium text-gray-700">Deadline</p>
                      <p className="text-small text-red-600 font-medium">{formatDate(parcelRequest.deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {parcelRequest.specialInstructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-h5 font-medium text-airbar-black mb-2">Special Instructions</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-small text-yellow-800">{parcelRequest.specialInstructions}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Photos */}
              {parcelRequest.photos && parcelRequest.photos.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-h5 font-medium text-airbar-black mb-2">Parcel Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {parcelRequest.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Trip Information */}
          {parcelRequest.tripRoute && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Linked Trip</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-h4 font-semibold text-airbar-black">{parcelRequest.tripRoute}</h3>
                    <p className="text-small text-gray-600">
                      {formatDate(parcelRequest.tripDate!)} at {parcelRequest.tripDepartureTime}
                    </p>
                  </div>
                  <Link href={`/trip/${parcelRequest.tripId}`}>
                    <Button variant="outline" size="sm">
                      View Trip Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sender Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Sender Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {parcelRequest.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-h5 font-semibold text-airbar-black">{parcelRequest.senderName}</h3>
                    {parcelRequest.senderIsKycVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-small text-gray-600">{parcelRequest.senderRating}</span>
                    </div>
                    <span className="text-small text-gray-600">•</span>
                    <span className="text-small text-gray-600">
                      Member since {new Date(parcelRequest.senderJoinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Sender
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          {parcelRequest.status.toLowerCase() === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleAccept}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Request
                </Button>

                <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4 mr-2" />
                      Decline Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Decline Parcel Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reason">Reason for declining (optional)</Label>
                        <Textarea
                          id="reason"
                          placeholder="Let the sender know why you can't take this parcel..."
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleDecline} variant="destructive" className="flex-1">
                          Decline Request
                        </Button>
                        <Button 
                          onClick={() => setShowDeclineDialog(false)} 
                          variant="outline" 
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Status Timeline (for non-pending statuses) */}
          {parcelRequest.status.toLowerCase() !== "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-small font-medium">Request Created</p>
                      <p className="text-xs text-gray-600">{formatDate(parcelRequest.createdAt)}</p>
                    </div>
                  </div>
                  {parcelRequest.status.toLowerCase() !== "declined" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-small font-medium">Request Accepted</p>
                        <p className="text-xs text-gray-600">by you</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}