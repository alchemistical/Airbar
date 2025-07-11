import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main className="max-w-[1200px] mx-auto px-6 pb-20">{children}</main>
  </div>
);