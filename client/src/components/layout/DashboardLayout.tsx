import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Plane,
  Package,
  Clock,
  Star,
  Bell,
  User,
  Gift,
  LogOut,
  Menu,
  ChevronDown,
  CheckCircle,
  Heart,
  MapPin,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import type { User as UserType } from "@shared/schema";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Plane, label: "Trips", href: "/dashboard/traveler/trips" },
  { icon: Package, label: "Parcel Requests", href: "/dashboard/parcel-requests" },
  { icon: Heart, label: "Matches", href: "/dashboard/matches" },
  { icon: MapPin, label: "Tracking", href: "/dashboard/tracking" },
  { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
  { icon: Clock, label: "History", href: "/dashboard/history" },
  { icon: Star, label: "Reviews", href: "/dashboard/reviews" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Gift, label: "Referrals", href: "/dashboard/referrals" },
  { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // For demo purposes, using userId 1
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user/1"],
  });

  const SidebarNavigation = () => (
    <>
      <SidebarHeader>
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <span className="text-sm font-bold text-airbar-black">A</span>
          </div>
          <span className="text-xl font-bold">airbar</span>
        </div>
      </SidebarHeader>

      <SidebarMenu>
        {navigationItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={location === item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={location === item.href 
                  ? "!bg-airbar-blue !text-white hover:!bg-blue-600" 
                  : "!text-airbar-black hover:!bg-gray-100 hover:!text-airbar-black"
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter>
        <SidebarMenuButton className="!text-airbar-black hover:!bg-gray-100 hover:!text-airbar-black">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex !bg-white !w-64 border-r border-gray-200 shadow-sm">
        <SidebarContent className="flex flex-col h-full !p-6 !bg-white">
          <SidebarNavigation />
        </SidebarContent>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar className="!bg-white h-full">
                  <SidebarContent className="flex flex-col h-full !p-6 !bg-white">
                    <SidebarNavigation />
                  </SidebarContent>
                </Sidebar>
              </SheetContent>
            </Sheet>

            <h1 className="text-h1 text-airbar-black">
              {location === "/dashboard/traveler/trips" ? "My Trips" : 
               location === "/dashboard/traveler/trips/addtrip" ? "Add New Trip" :
               "Dashboard"}
            </h1>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                <span className="text-sm font-medium text-gray-600">
                  {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "AK"}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <span className="text-body font-medium text-airbar-black">
                    {user ? `${user.firstName} ${user.lastName}` : "Alex Kim"}
                  </span>
                  {(user?.isKycVerified ?? true) && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-airbar-green" />
                      <span className="text-small text-airbar-green">KYC Verified</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-airbar-light-gray px-6 py-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
