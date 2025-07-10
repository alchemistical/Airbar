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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Send,
} from "lucide-react";
import type { User as UserType } from "@shared/schema";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Plane, label: "Trips", href: "/dashboard/traveler/trips" },
  { icon: Package, label: "Parcel Requests", href: "/dashboard/parcel-requests" },
  { icon: Send, label: "Send Package", href: "/send-package" },
  { icon: Heart, label: "Matches", href: "/dashboard/matches" },
  { icon: MapPin, label: "Tracking", href: "/dashboard/tracking" },
  { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

const userDropdownItems = [
  { icon: DollarSign, label: "Wallet", description: "Manage funds, view earnings", href: "/dashboard/wallet" },
  { icon: Bell, label: "Notifications", description: "Updates and alerts", href: "/dashboard/notifications", hasUnread: true },
  { icon: User, label: "Profile", description: "KYC, personal details, settings", href: "/dashboard/profile" },
  { icon: Gift, label: "Referrals", description: "Invite friends, bonus status", href: "/dashboard/referrals" },
  { icon: Clock, label: "History", description: "Activity log, past deliveries", href: "/dashboard/history" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // For demo purposes, using userId 1
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user/1"],
  });

  // Check if current route is in user dropdown
  const isUserDropdownRoute = userDropdownItems.some(item => location.startsWith(item.href));

  // Get unread notifications count (mock data)
  const unreadNotifications = 3;

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
                    {/* Mobile User Profile Dropdown */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.username} />
                          <AvatarFallback className="bg-airbar-blue text-white text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-airbar-black">
                            {user?.username || "User"}
                          </span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs w-fit">
                            KYC Verified
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {userDropdownItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <div 
                              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                                location.startsWith(item.href) ? "bg-airbar-blue text-white" : "hover:bg-gray-50"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="relative">
                                <item.icon className="h-4 w-4" />
                                {item.hasUnread && unreadNotifications > 0 && (
                                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </SidebarContent>
                </Sidebar>
              </SheetContent>
            </Sheet>

            <h1 className="text-h1 text-airbar-black">
              {location === "/dashboard/traveler/trips" ? "My Trips" : 
               location === "/dashboard/traveler/trips/addtrip" ? "Add New Trip" :
               location === "/dashboard/parcel-requests" ? "Parcel Requests" :
               location === "/dashboard/sender/parcels" ? "My Parcels" :
               location === "/send-package" ? "Send Package" :
               location === "/dashboard/matches" ? "Matches" :
               location === "/dashboard/tracking" ? "Package Tracking" :
               location === "/dashboard/wallet" ? "Wallet" :
               location === "/dashboard/history" ? "History" :
               location === "/dashboard/profile" ? "Profile" :
               location === "/dashboard/notifications" ? "Notifications" :
               location === "/dashboard/referrals" ? "Referrals" :
               location.startsWith("/parcel-request/") ? "Parcel Details" :
               "Dashboard"}
            </h1>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <DropdownMenu open={isUserDropdownOpen} onOpenChange={setIsUserDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                      isUserDropdownRoute ? "bg-gray-100" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="bg-airbar-blue text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-airbar-black">
                        {user?.username || "User"}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          KYC Verified
                        </Badge>
                        {unreadNotifications > 0 && (
                          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 p-2"
                  sideOffset={8}
                >
                  {userDropdownItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem 
                        className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer ${
                          location.startsWith(item.href) ? "bg-airbar-blue text-white" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="relative">
                          <item.icon className="h-5 w-5 mt-0.5" />
                          {item.hasUnread && unreadNotifications > 0 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-medium">
                                {unreadNotifications > 9 ? "9+" : unreadNotifications}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${
                            location.startsWith(item.href) ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
