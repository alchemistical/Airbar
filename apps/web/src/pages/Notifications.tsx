import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  Check,
  Settings,
  Package,
  Plane,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type NotificationType = "parcel" | "trip" | "payment" | "system" | "match";
type NotificationPriority = "high" | "medium" | "low";

type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "parcel",
      priority: "high",
      title: "Package Delivery Confirmed",
      message:
        "Your package to Miami has been successfully delivered to Sarah Johnson.",
      timestamp: "2024-12-28 4:30 PM",
      isRead: false,
      actionUrl: "/dashboard/history/view/H001",
    },
    {
      id: "2",
      type: "payment",
      priority: "medium",
      title: "Payment Received",
      message:
        "You've received $85.00 for your delivery to Miami. Funds are now available.",
      timestamp: "2024-12-28 4:15 PM",
      isRead: false,
      actionUrl: "/dashboard/wallet",
    },
    {
      id: "3",
      type: "match",
      priority: "medium",
      title: "New Package Request",
      message: "A new package request matches your upcoming trip to Chicago.",
      timestamp: "2024-12-27 2:30 PM",
      isRead: true,
      actionUrl: "/dashboard/parcel-requests",
    },
    {
      id: "4",
      type: "trip",
      priority: "low",
      title: "Trip Reminder",
      message: "Don't forget your upcoming trip to Boston tomorrow at 8:00 AM.",
      timestamp: "2024-12-26 6:00 PM",
      isRead: true,
      actionUrl: "/dashboard/traveler/trips",
    },
    {
      id: "5",
      type: "system",
      priority: "medium",
      title: "KYC Verification Complete",
      message:
        "Your identity verification has been approved. You can now carry higher value packages.",
      timestamp: "2024-12-25 10:15 AM",
      isRead: true,
      actionUrl: "/dashboard/profile",
    },
  ];

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "parcel":
        return Package;
      case "trip":
        return Plane;
      case "payment":
        return DollarSign;
      case "match":
        return User;
      case "system":
        return Settings;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "parcel":
        return "bg-blue-100 text-blue-800";
      case "trip":
        return "bg-green-100 text-green-800";
      case "payment":
        return "bg-purple-100 text-purple-800";
      case "match":
        return "bg-orange-100 text-orange-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    // In real app, would make API call
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">
              Notifications
            </h1>
            <p className="text-gray-600">
              Stay updated with your delivery activity and system alerts
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unread</p>
                  <p className="text-3xl font-bold text-red-600">
                    {unreadCount}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {mockNotifications.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {
                      mockNotifications.filter(n => n.priority === "high")
                        .length
                    }
                  </p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Read</p>
                  <p className="text-3xl font-bold text-green-600">
                    {mockNotifications.filter(n => n.isRead).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="parcel">Package Updates</SelectItem>
                  <SelectItem value="trip">Trip Reminders</SelectItem>
                  <SelectItem value="payment">Payment Notifications</SelectItem>
                  <SelectItem value="match">New Matches</SelectItem>
                  <SelectItem value="system">System Alerts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Notifications ({filteredNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No notifications found
                </h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map(notification => {
                  const TypeIcon = getTypeIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`border-l-4 ${getPriorityColor(notification.priority)} bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${
                        !notification.isRead ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div
                            className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}
                          >
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`font-semibold ${!notification.isRead ? "text-airbar-black" : "text-gray-700"}`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Badge
                                variant="secondary"
                                className={getTypeColor(notification.type)}
                              >
                                {notification.type.charAt(0).toUpperCase() +
                                  notification.type.slice(1)}
                              </Badge>
                            </div>

                            <p className="text-gray-600 mb-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.timestamp}
                              </span>
                              {notification.actionUrl && (
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
