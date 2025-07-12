import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Clock, MessageSquare, Plus, Search, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type DisputeStatus = "open" | "waiting" | "review" | "offer" | "resolved" | "escalated" | "closed";

type Dispute = {
  id: number;
  matchId: number;
  status: DisputeStatus;
  reason: string;
  description: string;
  timeline: Array<{
    timestamp: string;
    actor: string;
    actorRole: string;
    type: string;
    message?: string;
  }>;
  firstReplyDue: string;
  resolutionDue: string;
  createdAt: string;
  updatedAt: string;
  otherPartyName?: string;
  packageDescription?: string;
};

export default function DisputeList() {
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const userId = 1; // TODO: Get from auth context

  const { data: disputes = [], isLoading } = useQuery<Dispute[]>({
    queryKey: [`/api/disputes/user/${userId}`],
  });

  const getStatusColor = (status: DisputeStatus) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800 border-yellow-200",
      waiting: "bg-orange-100 text-orange-800 border-orange-200",
      review: "bg-blue-100 text-blue-800 border-blue-200",
      offer: "bg-purple-100 text-purple-800 border-purple-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      escalated: "bg-red-100 text-red-800 border-red-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status];
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case "lost": return <AlertCircle className="h-4 w-4" />;
      case "damaged": return <AlertTriangle className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      case "payment": return <TrendingUp className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredDisputes = disputes.filter(dispute => {
    if (statusFilter !== "all" && dispute.status !== statusFilter) return false;
    if (searchQuery && !dispute.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !dispute.packageDescription?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeDisputes = filteredDisputes.filter(d => !["resolved", "closed"].includes(d.status));
  const closedDisputes = filteredDisputes.filter(d => ["resolved", "closed"].includes(d.status));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-airbar-blue mx-auto mb-4"></div>
          <p className="text-gray-500">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-airbar-black">Disputes & Resolution</h1>
          <p className="text-gray-600 mt-1">Manage and resolve delivery issues</p>
        </div>
        <Link href="/support/disputes/new">
          <Button className="bg-airbar-blue hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search disputes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="waiting">Waiting Reply</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="offer">Offer Issued</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedDisputes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDisputes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active disputes</p>
              </CardContent>
            </Card>
          ) : (
            activeDisputes.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} />
            ))
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {closedDisputes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No closed disputes</p>
              </CardContent>
            </Card>
          ) : (
            closedDisputes.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  function DisputeCard({ dispute }: { dispute: Dispute }) {
    const lastUpdate = dispute.timeline[dispute.timeline.length - 1];
    const isUrgent = isOverdue(dispute.firstReplyDue) && dispute.status === "open";

    return (
      <Link href={`/support/disputes/${dispute.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(dispute.status).split(' ')[0]}`}>
                  {getReasonIcon(dispute.reason)}
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Dispute #{dispute.id}
                    {isUrgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {dispute.packageDescription || dispute.description.substring(0, 100)}...
                  </CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-600">
                <span>Match #{dispute.matchId}</span>
                <span>•</span>
                <span className="capitalize">{dispute.reason} item</span>
                <span>•</span>
                <span>Opened {formatDistanceToNow(new Date(dispute.createdAt))} ago</span>
              </div>
              {lastUpdate && (
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="h-4 w-4" />
                  <span>Last update: {formatDistanceToNow(new Date(lastUpdate.timestamp))} ago</span>
                </div>
              )}
            </div>
            {isUrgent && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Response overdue - please respond immediately to avoid escalation
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }
}