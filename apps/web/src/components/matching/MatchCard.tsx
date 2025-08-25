import { useState } from "react";
import { MapPin, Calendar, Package, Star, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedAnimatedButton } from "@/components/ui/animated-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCreateMatchRequest } from "@/hooks/useMatching";
import type { MatchResult } from "@/types/matching";
import { toast } from "@/hooks/use-toast";

interface MatchCardProps {
  match: MatchResult;
  currentUserId?: number;
  userType: "sender" | "traveler";
}

export function MatchCard({
  match,
  currentUserId = 1,
  userType,
}: MatchCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState(match.price);
  const createMatchRequest = useCreateMatchRequest();

  const handleRequestMatch = async () => {
    try {
      await createMatchRequest.mutateAsync({
        targetUserId: match.user.id,
        proposedPrice,
        message: message.trim() || undefined,
        urgency: "standard",
        ...(match.type === "travel_profile" && {
          travelProfileId: Number(match.id),
        }),
        ...(match.type === "package_request" && {
          packageRequestId: Number(match.id),
        }),
      });

      toast({
        title: "Match request sent!",
        description: `Your request has been sent to ${match.user.name}. They'll be notified and can respond soon.`,
      });

      setIsDialogOpen(false);
      setMessage("");
      setProposedPrice(match.price);
    } catch (error) {
      toast({
        title: "Failed to send request",
        description:
          "There was an error sending your match request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMatchTypeLabel = () => {
    return match.type === "travel_profile" ? "Traveler" : "Package";
  };

  const getActionLabel = () => {
    return userType === "sender" ? "Request Delivery" : "Offer to Carry";
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={match.user.avatar || undefined} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {match.user.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{match.user.name}</h3>
                {match.user.verified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span>{match.user.trustScore.toFixed(1)}</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {getMatchTypeLabel()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${match.price}
            </div>
            <div className="text-sm text-gray-500">
              Match: {Math.round(match.matchScore * 100)}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            <span className="font-medium">{match.route.origin}</span>
            <span className="mx-2">→</span>
            <span className="font-medium">{match.route.destination}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formatDate(match.travelDate)}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-700">
          <Package className="h-4 w-4" />
          <span className="text-sm">Capacity: {match.capacity}</span>
        </div>

        {match.description && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {match.description}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <AnimatedButton className="w-full bg-blue-600 hover:bg-blue-700">
              {getActionLabel()}
            </AnimatedButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Match Request</DialogTitle>
              <DialogDescription>
                Send a request to {match.user.name} to{" "}
                {userType === "sender"
                  ? "carry your package"
                  : "offer carrying their package"}
                .
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Proposed Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={proposedPrice}
                  onChange={e => setProposedPrice(Number(e.target.value))}
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <div className="text-xs text-gray-500 text-right">
                  {message.length}/500
                </div>
              </div>
            </div>

            <DialogFooter className="flex space-x-2">
              <AnimatedButton
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={createMatchRequest.isPending}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                onClick={handleRequestMatch}
                disabled={createMatchRequest.isPending}
              >
                {createMatchRequest.isPending ? "Sending..." : "Send Request"}
              </AnimatedButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
