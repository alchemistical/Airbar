import React from "react";

interface MetricsStripProps {
  users: number;
  deliveries: number;
  activeRoutes: number;
}

export const MetricsStrip: React.FC<MetricsStripProps> = ({
  users,
  deliveries,
  activeRoutes,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="bg-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Money held in escrow until delivery
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(users)}+
            </div>
            <div className="text-sm text-gray-600">Verified users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(deliveries)}+
            </div>
            <div className="text-sm text-gray-600">Successful deliveries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatNumber(activeRoutes)}+
            </div>
            <div className="text-sm text-gray-600">Active routes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
