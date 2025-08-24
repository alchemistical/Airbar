import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface DisputeButtonProps {
  matchId: number;
  className?: string;
  variant?: "outline" | "destructive" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function DisputeButton({ 
  matchId, 
  className,
  variant = "outline",
  size = "default"
}: DisputeButtonProps) {
  const [, setLocation] = useLocation();

  const handleDisputeClick = () => {
    setLocation(`/dashboard/disputes/new?matchId=${matchId}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDisputeClick}
      className={className}
    >
      <AlertCircle className="h-4 w-4 mr-2" />
      Dispute
    </Button>
  );
}