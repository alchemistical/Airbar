interface NextStepCardProps {
  trip: {
    route: string;
  };
  pendingCount: number;
}

export const NextStepCard = ({ trip, pendingCount }: NextStepCardProps) => (
  <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex justify-between items-center shadow-sm">
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-white">
        {pendingCount} parcel request{pendingCount > 1 ? "s" : ""} pending
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{trip.route}</p>
    </div>
    <button className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition-colors">
      Review now
    </button>
  </div>
);