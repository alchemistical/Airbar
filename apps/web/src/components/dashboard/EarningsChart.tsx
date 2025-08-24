import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { Earning } from "@shared/schema";

interface EarningsChartProps {
  userId: number;
}

export default function EarningsChart({ userId }: EarningsChartProps) {
  const { data: earnings, isLoading } = useQuery<Earning[]>({
    queryKey: [`/api/dashboard/earnings/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Transform earnings data for chart
  const chartData = earnings?.map((earning, index) => ({
    name: `Point ${index + 1}`,
    value: parseFloat(earning.amount),
    date: new Date(earning.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  })) || [];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-h3 text-airbar-black">Earnings</h2>
        <a href="#" className="text-small font-medium text-airbar-blue hover:underline">
          View all
        </a>
      </div>

      <div className="h-48">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--airbar-blue)"
                strokeWidth={3}
                dot={{ fill: "var(--airbar-blue)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 4, fill: "var(--airbar-blue)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-body text-airbar-dark-gray">No earnings data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
