import { Link } from "wouter";
import { Package, Plus, MapPin, Wallet } from "lucide-react";

const actions = [
  { label: "Send Package", href: "/send-package", icon: Package, isPrimary: true },
  { label: "Add Trip", href: "/dashboard/traveler/trips/addtrip", icon: Plus, isPrimary: false },
  { label: "Track Parcel", href: "/dashboard/tracking", icon: MapPin, isPrimary: false },
  { label: "Withdraw Funds", href: "/dashboard/wallet", icon: Wallet, isPrimary: false },
];

export const QuickActions = () => (
  <div className="mt-6 shadow-sm rounded-lg bg-white dark:bg-gray-800 px-4 py-3 overflow-x-auto flex gap-3">
    {actions.map((action) => (
      <Link key={action.label} href={action.href}>
        <button
          className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium flex items-center space-x-2 transition-colors ${
            action.isPrimary
              ? "bg-brand text-white hover:bg-brand-dark"
              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <action.icon className="h-4 w-4" />
          <span>{action.label}</span>
        </button>
      </Link>
    ))}
  </div>
);