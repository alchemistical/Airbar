import { Bell } from "lucide-react";

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

export const NotificationBell = ({ count = 0, onClick }: NotificationBellProps) => (
  <div className="relative cursor-pointer group" onClick={onClick}>
    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);