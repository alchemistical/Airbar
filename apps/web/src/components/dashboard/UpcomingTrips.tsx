import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AnimatedAnimatedButton } from "@/components/ui/animated-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import type { TripWithRequests } from "@shared/schema";

interface UpcomingTripsProps {
  userId: number;
}

export default function UpcomingTrips({ userId }: UpcomingTripsProps) {
  const { data: trips, isLoading } = useQuery<TripWithRequests[]>({
    queryKey: [`/api/dashboard/trips/${userId}`],
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric"
    });
  };

  const formatDateRange = (departure: string | Date, arrival?: string | Date) => {
    if (!arrival) return formatDate(departure);
    const departureFormatted = formatDate(departure);
    const arrivalFormatted = formatDate(arrival);
    return `${departureFormatted} - ${arrivalFormatted}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-h3 text-airbar-black">Upcoming Trips</h2>
        <Link href="/add-trip">
          <AnimatedButton className="bg-airbar-blue text-white hover:bg-blue-600">
            Add Trip
          </AnimatedButton>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-3 text-left text-small font-medium text-airbar-dark-gray">FROM</th>
              <th className="py-3 text-left text-small font-medium text-airbar-dark-gray">TO</th>
              <th className="py-3 text-left text-small font-medium text-airbar-dark-gray">DATES</th>
              <th className="py-3 text-left text-small font-medium text-airbar-dark-gray">PARCEL REQUESTS</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {trips?.map((trip) => (
              <tr key={trip.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                <td className="py-4 text-body text-airbar-black">{trip.fromCity}</td>
                <td className="py-4 text-body text-airbar-black">{trip.toCity}</td>
                <td className="py-4 text-body text-airbar-dark-gray">
                  {formatDateRange(trip.departureDate, trip.arrivalDate)}
                </td>
                <td className="py-4">
                  <span 
                    className={`rounded-full px-2 py-1 text-small ${
                      trip.requestCount > 0 
                        ? "bg-airbar-orange text-white" 
                        : "bg-gray-200 text-airbar-dark-gray"
                    }`}
                  >
                    {trip.requestCount}
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-airbar-dark-gray hover:text-airbar-black">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!trips || trips.length === 0) && (
        <div className="py-8 text-center">
          <p className="text-body text-airbar-dark-gray">No upcoming trips found.</p>
        </div>
      )}
    </div>
  );
}
