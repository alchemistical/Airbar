import { Sparklines, SparklinesLine } from "react-sparklines";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: number;
  trend?: number[];
}

export const KpiTile = ({ label, value, delta, trend }: KpiTileProps) => (
  <div className="flex flex-col items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-[140px] h-[120px]">
    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{label}</span>
    <div className="flex flex-col items-center space-y-1">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      {delta && (
        <span
          className={`text-sm ${
            delta > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {delta > 0 ? "▲" : "▼"}
          {Math.abs(delta)}%
        </span>
      )}
    </div>
    {trend && (
      <div className="w-full">
        <Sparklines data={trend} width={80} height={24}>
          <SparklinesLine color="#2F80ED" style={{ fill: "none" }} />
        </Sparklines>
      </div>
    )}
  </div>
);