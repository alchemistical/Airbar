interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

export default function MetricCard({ title, value, icon, iconBgColor }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-small text-airbar-dark-gray">{title}</p>
          <p className="text-h2 text-airbar-black">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
