import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import type { Notification } from "@shared/schema";

interface NotificationsProps {
  userId: number;
}

export default function Notifications({ userId }: NotificationsProps) {
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: [`/api/dashboard/notifications/${userId}`],
  });

  const formatTime = (date: string | Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - notificationDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "bg-gray-300";
    
    switch (type) {
      case "info":
        return "bg-airbar-blue";
      case "success":
        return "bg-airbar-green";
      case "warning":
        return "bg-airbar-orange";
      case "error":
        return "bg-airbar-red";
      default:
        return "bg-airbar-blue";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-h3 text-airbar-black">Notifications</h2>
        <span className="text-small text-airbar-dark-gray">Today</span>
      </div>

      <div className="space-y-4">
        {notifications?.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3">
            <div
              className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${getNotificationColor(
                notification.type,
                notification.isRead
              )}`}
            />
            <div className="flex-1">
              <p className="text-body text-airbar-black">{notification.message}</p>
              <p className="text-small text-airbar-dark-gray">
                {formatTime(notification.createdAt!)}
              </p>
            </div>
            <button className="text-airbar-dark-gray hover:text-airbar-black">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}

        {(!notifications || notifications.length === 0) && (
          <div className="py-8 text-center">
            <p className="text-body text-airbar-dark-gray">No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
