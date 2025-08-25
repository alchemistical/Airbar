import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EscrowBannerProps {
  amount: number;
  status: "held" | "pending_release" | "released" | "disputed";
  releaseDate?: Date;
  className?: string;
}

export function EscrowBanner({ amount, status, releaseDate, className }: EscrowBannerProps) {
  const getContent = () => {
    switch (status) {
      case "held":
        return {
          icon: Shield,
          variant: "default" as const,
          title: "Funds Secured",
          description: `$${amount.toFixed(2)} is held in escrow until delivery confirmation`
        };
      case "pending_release":
        return {
          icon: Clock,
          variant: "default" as const,
          title: "Pending Release",
          description: releaseDate 
            ? `$${amount.toFixed(2)} will be released ${formatDistanceToNow(releaseDate, { addSuffix: true })}`
            : `$${amount.toFixed(2)} pending release after confirmation`
        };
      case "released":
        return {
          icon: Shield,
          variant: "default" as const,
          title: "Funds Released",
          description: `$${amount.toFixed(2)} has been released to the traveler`
        };
      case "disputed":
        return {
          icon: AlertCircle,
          variant: "destructive" as const,
          title: "Funds Under Dispute",
          description: `$${amount.toFixed(2)} is held pending dispute resolution`
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <Alert variant={content.variant} className={className}>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <span className="font-medium">{content.title}:</span> {content.description}
      </AlertDescription>
    </Alert>
  );
}