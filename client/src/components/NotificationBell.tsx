import { Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NotificationBell() {
  const [, navigate] = useLocation();

  // Poll for unread count every 30 seconds
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 30000, // 30 seconds
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-[#EB5757] text-white border-0 px-1.5 text-xs font-medium"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}