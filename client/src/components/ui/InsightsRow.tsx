interface InsightProps {
  label: string;
  value: string;
  delta: number;
}

const Insight = ({ label, value, delta }: InsightProps) => (
  <div className="flex flex-col items-center px-4">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-lg font-medium text-gray-900 dark:text-white">{value}</span>
    <span
      className={`text-xs ${
        delta >= 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      {delta >= 0 ? "▲" : "▼"}
      {Math.abs(delta)}%
    </span>
  </div>
);

export const InsightsRow = () => (
  <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-lg shadow-sm py-3">
    <Insight label="Earnings 30d" value="$750" delta={12} />
    <Insight label="Avg Reward" value="$42" delta={8} />
    <Insight label="Accept Rate" value="94%" delta={2} />
  </div>
);