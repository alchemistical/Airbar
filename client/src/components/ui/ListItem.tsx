import { LucideIcon } from "lucide-react";

interface ListItemProps {
  icon: LucideIcon;
  text: string;
}

export const ListItem = ({ icon: Icon, text }: ListItemProps) => (
  <li className="flex items-start space-x-2">
    <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-[2px]" />
    <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
  </li>
);