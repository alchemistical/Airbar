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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Settings,
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
  { icon: User, label: "Profile", description: "KYC, personal details, settings", href: "/dashboard/profile" },
  { icon: DollarSign, label: "Wallet", description: "Manage funds, view earnings", href: "/dashboard/wallet" },
  { icon: Clock, label: "History", description: "Activity log, past deliveries", href: "/dashboard/history" },
  { icon: Gift, label: "Referrals", description: "Invite friends, bonus status", href: "/dashboard/referrals" },
];

// Mock notification data for the bell icon
const mockNotifications = [
  {
    id: "1",
    type: "parcel",
    priority: "high",
    title: "Package Delivery Confirmed",
    message: "Your package to Miami has been successfully delivered to Sarah Johnson.",
    timestamp: "2024-12-28 4:30 PM",
    isRead: false,
    actionUrl: "/dashboard/history/view/H001"
  },
  {
    id: "2",
    type: "payment",
    priority: "medium",
    title: "Payment Received",
    message: "You've received $85.00 for your delivery to Miami. Funds are now available.",
    timestamp: "2024-12-28 4:15 PM",
    isRead: false,
    actionUrl: "/dashboard/wallet"
  },
  {
    id: "3",
    type: "match",
    priority: "medium",
    title: "New Package Request",
    message: "A new package request matches your upcoming trip to Chicago.",
    timestamp: "2024-12-27 2:30 PM",
    isRead: true,
    actionUrl: "/dashboard/parcel-requests"
  }
];

type NotificationType = "parcel" | "trip" | "payment" | "system" | "match";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "parcel":
      return Package;
    case "trip":
      return Plane;
    case "payment":
      return DollarSign;
    case "match":
      return User;
    case "system":
      return Settings;
    default:
      return Bell;
  }
};

const getNotificationTypeColor = (type: NotificationType) => {
  switch (type) {
    case "parcel":
      return "text-blue-600";
    case "trip":
      return "text-purple-600";
    case "payment":
      return "text-green-600";
    case "match":
      return "text-orange-600";
    case "system":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
};

// NotificationBellIcon component
interface NotificationBellIconProps {
  badgeCount: number;
  notifications: typeof mockNotifications;
}

function NotificationBellIcon({ badgeCount, notifications }: NotificationBellIconProps) {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [location] = useLocation();

  return (
    <DropdownMenu open={isNotificationDropdownOpen} onOpenChange={setIsNotificationDropdownOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {badgeCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Notifications</p>
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent 
        align="end" 
        className="w-96 p-0"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-airbar-black">Notifications</h3>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-airbar-primary hover:text-airbar-primary-dark">
                View All
              </Button>
            </Link>
          </div>
          {badgeCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {badgeCount} unread notification{badgeCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.slice(0, 5).map((notification) => {
                const IconComponent = getNotificationIcon(notification.type as NotificationType);
                return (
                  <Link key={notification.id} href={notification.actionUrl || "/dashboard/notifications"}>
                    <div 
                      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        !notification.isRead ? "bg-airbar-gray-100 border-l-4 border-l-airbar-primary" : ""
                      }`}
                      onClick={() => setIsNotificationDropdownOpen(false)}
                    >
                      <div className={`flex-shrink-0 ${getNotificationTypeColor(notification.type as NotificationType)}`}>
                        <IconComponent className="w-5 h-5 mt-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium text-airbar-black ${
                            !notification.isRead ? "font-semibold" : ""
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        
        {notifications.length > 5 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-airbar-blue hover:text-blue-700">
                View {notifications.length - 5} more notification{notifications.length - 5 !== 1 ? "s" : ""}
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;

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
                  ? "!bg-airbar-primary !text-white hover:!bg-airbar-primary-dark" 
                  : "!text-airbar-black hover:!bg-airbar-gray-100 hover:!text-airbar-black"
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
        <SidebarMenuButton className="!text-airbar-black hover:!bg-airbar-gray-100 hover:!text-airbar-black">
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
        <header className="border-b border-airbar-gray-200 bg-airbar-white px-6 py-4 shadow-sm">
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
                          <AvatarFallback className="bg-airbar-primary text-white text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-airbar-black">
                            {user?.username || "User"}
                          </span>
                          <Badge variant="secondary" className="bg-airbar-success text-white text-xs w-fit">
                            KYC Verified
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Notifications in mobile - add it first */}
                        <Link href="/dashboard/notifications">
                          <div 
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                              location.startsWith("/dashboard/notifications") ? "bg-airbar-primary text-white" : "hover:bg-airbar-gray-100"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="relative">
                              <Bell className="h-4 w-4" />
                              {unreadNotifications > 0 && (
                                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-sm font-medium">Notifications</span>
                          </div>
                        </Link>
                        
                        {userDropdownItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <div 
                              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                                location.startsWith(item.href) ? "bg-airbar-primary text-white" : "hover:bg-airbar-gray-100"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className="h-4 w-4" />
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

            {/* Header Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications Bell Icon */}
              <NotificationBellIcon 
                badgeCount={unreadNotifications} 
                notifications={mockNotifications}
              />
              
              {/* User Profile Dropdown */}
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
                      <AvatarFallback className="bg-airbar-primary text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-airbar-black">
                        {user?.username || "User"}
                      </span>
                      <Badge variant="secondary" className="bg-airbar-success text-white text-xs">
                        KYC Verified
                      </Badge>
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
                          location.startsWith(item.href) ? "bg-airbar-primary text-white" : "hover:bg-airbar-gray-100"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mt-0.5" />
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
        <main className="flex-1 bg-airbar-gray-100 px-6 py-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
