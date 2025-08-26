/**
 * Enhanced User Dashboard with Real Functionality
 * Silicon Valley-grade dashboard experience
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Bell,
  Filter,
  Search,
  Calendar,
  ArrowRight,
  Plus,
  Zap,
  Award,
  Target,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageSquare,
  Settings,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalEarnings: number;
  totalDeliveries: number;
  activeTrips: number;
  rating: number;
  completionRate: number;
  responseTime: string;
}

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  status: 'active' | 'completed' | 'upcoming';
  earnings: number;
  packages: number;
}

interface Package {
  id: string;
  description: string;
  weight: string;
  reward: number;
  status: 'pending' | 'matched' | 'in-transit' | 'delivered';
  deadline: string;
  from: string;
  to: string;
}

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Mock data with real functionality
  const { data: stats, isLoading: statsLoading } = useOptimizedQuery<DashboardStats>({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        totalEarnings: 2847.50,
        totalDeliveries: 43,
        activeTrips: 3,
        rating: 4.8,
        completionRate: 98.5,
        responseTime: '< 2 hours'
      };
    },
    staleTime: 300000, // 5 minutes
  });

  const { data: trips, isLoading: tripsLoading } = useOptimizedQuery<Trip[]>({
    queryKey: ['user-trips', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return [
        {
          id: '1',
          from: 'New York, NY',
          to: 'San Francisco, CA',
          date: '2024-12-15',
          status: 'active' as const,
          earnings: 350.00,
          packages: 3
        },
        {
          id: '2',
          from: 'Los Angeles, CA',
          to: 'Seattle, WA',
          date: '2024-12-20',
          status: 'upcoming' as const,
          earnings: 280.00,
          packages: 2
        },
        {
          id: '3',
          from: 'Chicago, IL',
          to: 'Miami, FL',
          date: '2024-11-28',
          status: 'completed' as const,
          earnings: 420.00,
          packages: 4
        },
      ];
    },
    staleTime: 180000, // 3 minutes
  });

  const { data: packages, isLoading: packagesLoading } = useOptimizedQuery<Package[]>({
    queryKey: ['user-packages', user?.id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return [
        {
          id: '1',
          description: 'Important Documents',
          weight: '0.5 kg',
          reward: 45.00,
          status: 'in-transit' as const,
          deadline: '2024-12-18',
          from: 'Brooklyn, NY',
          to: 'Oakland, CA'
        },
        {
          id: '2',
          description: 'Electronics Package',
          weight: '2.1 kg',
          reward: 75.00,
          status: 'matched' as const,
          deadline: '2024-12-22',
          from: 'Manhattan, NY',
          to: 'San Jose, CA'
        },
        {
          id: '3',
          description: 'Gift Package',
          weight: '1.3 kg',
          reward: 55.00,
          status: 'delivered' as const,
          deadline: '2024-11-30',
          from: 'Queens, NY',
          to: 'Palo Alto, CA'
        },
      ];
    },
    staleTime: 120000, // 2 minutes
  });

  // Filter and search functionality
  const filteredTrips = useMemo(() => {
    if (!trips) return [];
    return trips.filter(trip => {
      const matchesSearch = trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.to.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [trips, searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'in-transit': case 'matched': return 'warning';
      case 'completed': case 'delivered': return 'success';
      case 'upcoming': case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'in-transit': return <Truck className="h-4 w-4" />;
      case 'completed': case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'upcoming': case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome back, {user?.username || 'Traveler'}! 👋
            </h1>
            <p className="text-neutral-600 mt-1">
              Here's what's happening with your AirBar journey
            </p>
          </div>
          
          <div className="flex gap-3">
            <AnimatedButton variant="outline" leftIcon={<Bell />}>
              Notifications
              <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0.5">3</Badge>
            </AnimatedButton>
            <AnimatedButton variant="primary" leftIcon={<Plus />}>
              New Trip
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { 
              label: 'Total Earnings', 
              value: `$${stats?.totalEarnings?.toLocaleString() || '0'}`, 
              icon: DollarSign, 
              color: 'from-green-500 to-emerald-600',
              change: '+12.5%'
            },
            { 
              label: 'Deliveries', 
              value: stats?.totalDeliveries?.toString() || '0', 
              icon: Package, 
              color: 'from-blue-500 to-cyan-600',
              change: '+3 this week'
            },
            { 
              label: 'Active Trips', 
              value: stats?.activeTrips?.toString() || '0', 
              icon: MapPin, 
              color: 'from-purple-500 to-violet-600',
              change: '2 upcoming'
            },
            { 
              label: 'Rating', 
              value: `${stats?.rating || '0'}/5.0`, 
              icon: Star, 
              color: 'from-amber-500 to-orange-600',
              change: 'Excellent'
            },
            { 
              label: 'Completion Rate', 
              value: `${stats?.completionRate || '0'}%`, 
              icon: Target, 
              color: 'from-indigo-500 to-blue-600',
              change: 'Above average'
            },
            { 
              label: 'Response Time', 
              value: stats?.responseTime || 'N/A', 
              icon: Activity, 
              color: 'from-pink-500 to-rose-600',
              change: 'Very fast'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-neutral-900 mt-1">
                        {statsLoading ? '...' : stat.value}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {[
                      { type: 'delivery', message: 'Package delivered to San Francisco', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600' },
                      { type: 'match', message: 'New package match found', time: '5 hours ago', icon: Zap, color: 'text-blue-600' },
                      { type: 'trip', message: 'Trip to Seattle scheduled', time: '1 day ago', icon: Calendar, color: 'text-purple-600' },
                      { type: 'review', message: 'Received 5-star review', time: '2 days ago', icon: Star, color: 'text-amber-600' },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                      >
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{activity.message}</p>
                          <p className="text-xs text-neutral-500">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AnimatedButton variant="outline" className="w-full justify-start" leftIcon={<Plus />}>
                    Add New Trip
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full justify-start" leftIcon={<Search />}>
                    Find Packages to Carry
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full justify-start" leftIcon={<MessageSquare />}>
                    Contact Support
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="w-full justify-start" leftIcon={<Settings />}>
                    Update Profile
                  </AnimatedButton>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-brand-50 to-purple-50 rounded-lg border-2 border-dashed border-brand-200 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-brand-400 mx-auto mb-4" />
                    <p className="text-brand-600 font-medium">Interactive Charts Coming Soon</p>
                    <p className="text-brand-500 text-sm mt-1">Track your earnings over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <EnhancedInput
                      placeholder="Search trips by city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search />}
                      showClearAnimatedButton
                    />
                  </div>
                  <div className="flex gap-2">
                    {(['all', 'active', 'completed'] as const).map((status) => (
                      <AnimatedButton
                        key={status}
                        variant={filterStatus === status ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </AnimatedButton>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trips List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant={getStatusColor(trip.status)} className="flex items-center gap-1">
                            {getStatusIcon(trip.status)}
                            {trip.status}
                          </Badge>
                          <span className="text-sm text-neutral-500">{trip.date}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">From:</span>
                            <span className="font-medium text-neutral-900">{trip.from}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">To:</span>
                            <span className="font-medium text-neutral-900">{trip.to}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <span>{trip.packages} packages</span>
                            <span className="text-green-600 font-medium">${trip.earnings}</span>
                          </div>
                          <AnimatedButton size="sm" variant="outline" leftIcon={<Eye />}>
                            View Details
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {packages?.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={getStatusColor(pkg.status)} className="flex items-center gap-1">
                            {getStatusIcon(pkg.status)}
                            {pkg.status}
                          </Badge>
                          <span className="text-lg font-bold text-green-600">${pkg.reward}</span>
                        </div>
                        
                        <h3 className="font-semibold text-neutral-900 mb-2">{pkg.description}</h3>
                        
                        <div className="space-y-2 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>{pkg.weight}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Due: {pkg.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{pkg.from} → {pkg.to}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                          <AnimatedButton size="sm" variant="primary" className="w-full">
                            Manage Package
                          </AnimatedButton>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'On-Time Delivery', value: '98.5%', color: 'text-green-600' },
                    { label: 'Customer Satisfaction', value: '4.8/5.0', color: 'text-blue-600' },
                    { label: 'Response Rate', value: '95%', color: 'text-purple-600' },
                    { label: 'Completion Rate', value: '100%', color: 'text-emerald-600' },
                  ].map((metric, index) => (
                    <div key={metric.label} className="flex items-center justify-between py-2">
                      <span className="text-sm text-neutral-600">{metric.label}</span>
                      <span className={`font-semibold ${metric.color}`}>{metric.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Standing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white mb-3">
                      <Award className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">Gold Traveler</h3>
                    <p className="text-sm text-neutral-600 mt-1">Top 10% of all travelers</p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-neutral-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Next Level Progress</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-xs text-neutral-500">3 more deliveries to Platinum status</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;