import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type MatchStatus = "pending" | "accepted" | "paid" | "confirmed" | "in_transit" | "delivered" | "disputed" | "cancelled";

interface MatchStatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const getStatusConfig = (status: MatchStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200"
        };
      case "accepted":
        return {
          label: "Accepted",
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "paid":
        return {
          label: "Paid",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "confirmed":
        return {
          label: "Confirmed",
          className: "bg-purple-100 text-purple-800 border-purple-200"
        };
      case "in_transit":
        return {
          label: "In Transit",
          className: "bg-indigo-100 text-indigo-800 border-indigo-200"
        };
      case "delivered":
        return {
          label: "Delivered",
          className: "bg-emerald-100 text-emerald-800 border-emerald-200"
        };
      case "disputed":
        return {
          label: "Disputed",
          className: "bg-red-100 text-red-800 border-red-200"
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}