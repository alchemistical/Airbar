import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import type { ParcelRequestWithSender } from "@shared/schema";

interface ParcelRequestsProps {
  userId: number;
}

export default function ParcelRequests({ userId }: ParcelRequestsProps) {
  const { data: requests, isLoading } = useQuery<ParcelRequestWithSender[]>({
    queryKey: [`/api/dashboard/parcel-requests/${userId}`],
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <Skeleton className="mb-6 h-7 w-40" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-h3 text-airbar-black">Parcel Requests</h2>

      <div className="space-y-4">
        {requests?.map((request) => (
          <div
            key={request.id}
            className="flex items-start justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <span className="text-body font-medium text-airbar-black">
                  {request.fromCity} → {request.toCity}
                </span>
              </div>
              <p className="mb-2 text-small text-airbar-dark-gray">
                {formatDate(request.collectionDate)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-small text-airbar-dark-gray">from</span>
                <span className="text-small font-medium text-airbar-black">
                  {request.senderName}
                </span>
              </div>
            </div>
            <button className="ml-2 text-airbar-dark-gray hover:text-airbar-black">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}

        {(!requests || requests.length === 0) && (
          <div className="py-8 text-center">
            <p className="text-body text-airbar-dark-gray">No parcel requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
