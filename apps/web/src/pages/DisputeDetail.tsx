import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Send,
  Shield,
  User,
  AlertTriangle,
  DollarSign,
  X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type DisputeStatus =
  | "open"
  | "waiting"
  | "review"
  | "offer"
  | "resolved"
  | "escalated"
  | "closed";

type TimelineEntry = {
  timestamp: string;
  actor: string;
  actorRole: string;
  type: string;
  message?: string;
  payload?: any;
};

type Dispute = {
  id: number;
  matchId: number;
  senderId: number;
  travelerId: number;
  status: DisputeStatus;
  reason: string;
  description: string;
  preferredOutcome: string;
  evidence: Array<{ url: string; type: string; uploadedAt: string }>;
  timeline: TimelineEntry[];
  firstReplyDue: string;
  resolutionDue: string;
  createdAt: string;
  updatedAt: string;
};

export default function DisputeDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [replyText, setReplyText] = useState("");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionAction, setResolutionAction] = useState<
    "accept" | "decline" | null
  >(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const { data: dispute, isLoading } = useQuery<Dispute>({
    queryKey: [`/api/disputes/${id}`],
    enabled: !!id,
  });

  const addTimelineMutation = useMutation({
    mutationFn: (timelineEntry: Partial<TimelineEntry>) =>
      apiRequest(`/api/disputes/${id}/timeline`, {
        method: "POST",
        body: JSON.stringify(timelineEntry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/disputes/${id}`] });
      setReplyText("");
      toast({
        title: "Reply sent",
        description: "Your message has been added to the dispute.",
      });
    },
  });

  const handleReply = () => {
    if (!replyText.trim()) return;

    addTimelineMutation.mutate({
      actor: `User ${user.id}`,
      actorRole: user.id === dispute?.senderId ? "sender" : "traveler",
      type: "reply",
      message: replyText,
    });
  };

  const handleResolution = (action: "accept" | "decline") => {
    setResolutionAction(action);
    setShowResolutionModal(true);
  };

  const confirmResolution = () => {
    addTimelineMutation.mutate({
      actor: `User ${user.id}`,
      actorRole: user.id === dispute?.senderId ? "sender" : "traveler",
      type:
        resolutionAction === "accept"
          ? "resolution_accepted"
          : "resolution_declined",
      message: `${resolutionAction === "accept" ? "Accepted" : "Declined"} the proposed resolution`,
    });
    setShowResolutionModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dispute...</p>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Dispute not found</p>
      </div>
    );
  }

  const getStatusColor = (status: DisputeStatus) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800 border-yellow-200",
      waiting: "bg-orange-100 text-orange-800 border-orange-200",
      review: "bg-blue-100 text-blue-800 border-blue-200",
      offer: "bg-purple-100 text-purple-800 border-purple-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      escalated: "bg-red-100 text-red-800 border-red-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status];
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "created":
        return <AlertCircle className="h-4 w-4" />;
      case "reply":
        return <MessageSquare className="h-4 w-4" />;
      case "offer":
        return <DollarSign className="h-4 w-4" />;
      case "resolution_accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "resolution_declined":
        return <X className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const deadlineStatus = () => {
    const now = new Date();
    const firstReplyDue = new Date(dispute.firstReplyDue);
    const resolutionDue = new Date(dispute.resolutionDue);

    if (now > resolutionDue) {
      return {
        text: "Resolution overdue",
        color: "text-red-600",
        icon: AlertTriangle,
      };
    } else if (now > firstReplyDue && dispute.status === "open") {
      return { text: "Reply overdue", color: "text-orange-600", icon: Clock };
    } else {
      const nextDeadline =
        dispute.status === "open" ? firstReplyDue : resolutionDue;
      return {
        text: `Due in ${formatDistanceToNow(nextDeadline)}`,
        color: "text-gray-600",
        icon: Clock,
      };
    }
  };

  const deadline = deadlineStatus();
  const hasOffer = dispute.timeline.some(t => t.type === "offer");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/support/disputes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Disputes
          </Button>
          <h1 className="text-h1 text-airbar-black">Dispute #{dispute.id}</h1>
          <Badge className={getStatusColor(dispute.status)}>
            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
          </Badge>
        </div>
        <div className={`flex items-center gap-2 ${deadline.color}`}>
          <deadline.icon className="h-4 w-4" />
          <span className="text-sm font-medium">{deadline.text}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Match #{dispute.matchId} • Reported{" "}
                {formatDistanceToNow(new Date(dispute.createdAt))} ago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="font-medium capitalize">{dispute.reason} item</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="whitespace-pre-wrap">{dispute.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Preferred Resolution
                </p>
                <p className="font-medium capitalize">
                  {dispute.preferredOutcome}
                </p>
              </div>
              {dispute.evidence.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Evidence</p>
                  <div className="flex gap-2">
                    {dispute.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                      >
                        {file.type.startsWith("image/") ? (
                          <Camera className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="text-sm">File {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dispute.timeline.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.actorRole === "support"
                            ? "bg-purple-100"
                            : entry.actorRole === "sender"
                              ? "bg-blue-100"
                              : "bg-green-100"
                        }`}
                      >
                        {getTimelineIcon(entry.type)}
                      </div>
                      {index < dispute.timeline.length - 1 && (
                        <div className="absolute top-10 left-5 w-0.5 h-full -translate-x-1/2 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{entry.actor}</p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                        </span>
                      </div>
                      {entry.message && (
                        <p className="text-sm text-gray-700">{entry.message}</p>
                      )}
                      {entry.type === "offer" && entry.payload && (
                        <Card className="mt-2 bg-purple-50 border-purple-200">
                          <CardContent className="p-4">
                            <p className="font-medium text-sm mb-2">
                              Resolution Offer
                            </p>
                            <p className="text-sm">
                              {entry.payload.description}
                            </p>
                            {entry.payload.amount && (
                              <p className="text-lg font-bold text-purple-600 mt-2">
                                ${entry.payload.amount}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reply Box */}
          {!["resolved", "closed"].includes(dispute.status) && (
            <Card>
              <CardHeader>
                <CardTitle>Add Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={
                      !replyText.trim() || addTimelineMutation.isPending
                    }
                    className="bg-airbar-blue hover:bg-blue-600 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-6">
          {/* Resolution Actions */}
          {dispute.status === "offer" && hasOffer && (
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-lg">
                  Resolution Offer Available
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have 48 hours to respond to this offer
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleResolution("accept")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept Offer
                  </Button>
                  <Button
                    onClick={() => handleResolution("decline")}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Decline Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <Badge className={`${getStatusColor(dispute.status)} mt-1`}>
                  {dispute.status.charAt(0).toUpperCase() +
                    dispute.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">First Reply Due</p>
                <p className="font-medium text-sm">
                  {format(
                    new Date(dispute.firstReplyDue),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolution Due</p>
                <p className="font-medium text-sm">
                  {format(
                    new Date(dispute.resolutionDue),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Sender</p>
                  <p className="text-xs text-gray-600">
                    User #{dispute.senderId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Traveler</p>
                  <p className="text-xs text-gray-600">
                    User #{dispute.travelerId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Support Agent</p>
                  <p className="text-xs text-gray-600">Automated mediation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolution Modal */}
      <Dialog open={showResolutionModal} onOpenChange={setShowResolutionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resolutionAction === "accept"
                ? "Accept Resolution Offer"
                : "Decline Resolution Offer"}
            </DialogTitle>
            <DialogDescription>
              {resolutionAction === "accept"
                ? "By accepting this offer, the dispute will be resolved and any agreed payments will be processed."
                : "By declining this offer, the dispute may be escalated for further review."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolutionModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmResolution}
              className={
                resolutionAction === "accept"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              Confirm {resolutionAction === "accept" ? "Accept" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
