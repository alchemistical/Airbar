import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "wouter";

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
  const [, navigate] = useNavigate();

  const handleDisputeClick = () => {
    navigate(`/dashboard/disputes/new?matchId=${matchId}`);
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