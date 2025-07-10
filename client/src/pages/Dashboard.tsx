import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import UpcomingTrips from "@/components/dashboard/UpcomingTrips";
import EarningsChart from "@/components/dashboard/EarningsChart";
import ParcelRequests from "@/components/dashboard/ParcelRequests";
import Notifications from "@/components/dashboard/Notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, Package, DollarSign, Star } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

export default function Dashboard() {
  // For demo purposes, using userId 1
  const userId = 1;
  
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: [`/api/dashboard/metrics/${userId}`],
  });

  return (
    <DashboardLayout>
      {/* Metric Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : (
          <>
            <MetricCard
              title="Upcoming Trips"
              value={metrics?.upcomingTrips.toString() || "0"}
              icon={<Plane className="h-6 w-6 text-airbar-blue" />}
              iconBgColor="bg-airbar-blue bg-opacity-10"
            />
            <MetricCard
              title="Parcel Requests"
              value={metrics?.parcelRequests.toString() || "0"}
              icon={<Package className="h-6 w-6 text-airbar-orange" />}
              iconBgColor="bg-airbar-orange bg-opacity-10"
            />
            <MetricCard
              title="Pending Earnings"
              value={metrics?.pendingEarnings || "$0"}
              icon={<DollarSign className="h-6 w-6 text-airbar-green" />}
              iconBgColor="bg-airbar-green bg-opacity-10"
            />
            <MetricCard
              title="Rating"
              value={metrics?.rating || "0.0"}
              icon={<Star className="h-6 w-6 text-yellow-400" />}
              iconBgColor="bg-yellow-400 bg-opacity-10"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          <UpcomingTrips userId={userId} />
          <EarningsChart userId={userId} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ParcelRequests userId={userId} />
          <Notifications userId={userId} />
        </div>
      </div>
    </DashboardLayout>
  );
}
