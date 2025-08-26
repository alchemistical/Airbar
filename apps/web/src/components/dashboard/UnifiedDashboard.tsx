import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Plane, Package, DollarSign, Star, Plus, MapPin, Users, Wallet,
  TrendingUp, CheckCircle2, Clock, ArrowRight, Calendar, Eye,
  BarChart3, Shield, Award, Send, Zap, Target, Trophy, Sparkles,
  Heart, Flame, Crown
} from "lucide-react";
import { Link } from "wouter";
import { dashboardApi } from "@/lib/api";

// TypeScript interfaces for the unified dashboard
interface BestMatch {
  id: string;
  type: 'parcel' | 'trip';
  from: string;
  to: string;
  date: string;
  matchScore: number;
  priceRange: string;
  carrier?: {
    name: string;
    rating: number;
    trustLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  };
  parcel?: {
    weight: string;
    description: string;
  };
  urgency: 'low' | 'medium' | 'high';
  aiSuggestion?: string;
}

interface UserStats {
  level: number;
  streakDays: number;
  trustLevel: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  badges: string[];
  totalEarnings: number;
  totalSavings: number;
  completedDeliveries: number;
  averageRating: number;
  loyaltyPoints: number;
}

interface UnifiedDashboardData {
  userStats: UserStats;
  bestMatches: BestMatch[];
  quickActions: Array<{
    id: string;
    label: string;
    icon: string;
    href: string;
    priority: 'high' | 'medium' | 'low';
    count?: number;
  }>;
  activityStream: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    icon: string;
  }>;
  context: {
    mode: 'sender' | 'traveler' | 'dual';
    primaryGoal: string;
    completionRate: number;
  };
}

export default function UnifiedDashboard() {
  const [userMode, setUserMode] = useState<'sender' | 'traveler' | 'dual'>('dual');
  const [activeGoal, setActiveGoal] = useState('earn_money'); // earn_money, save_money, help_others
  const { user, isAuthenticated } = useAuth();

  // Fetch unified dashboard data
  const { data: dashboardData, isLoading, error } = useQuery<UnifiedDashboardData>({
    queryKey: ['unified-dashboard', user?.id, userMode],
    queryFn: () => dashboardApi.getUnifiedDashboard(user?.id || '', userMode),
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time feel
    enabled: isAuthenticated && !!user?.id,
  });

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'traveler' : 'sender';
    setUserMode(newMode);
    
    // Send user context update to backend
    dashboardApi.setUserContext({
      mode: newMode,
      primaryGoal: activeGoal,
    });
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'BRONZE': return 'text-orange-600 bg-orange-100';
      case 'SILVER': return 'text-gray-600 bg-gray-100';
      case 'GOLD': return 'text-yellow-600 bg-yellow-100';
      case 'PLATINUM': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMatchUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <Flame className="h-4 w-4 text-red-500" />;
      case 'medium': return <Zap className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <Link href="/login" className="text-blue-600 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.userStats;
  const matches = dashboardData?.bestMatches || [];
  const quickActions = dashboardData?.quickActions || [];
  const activityStream = dashboardData?.activityStream || [];

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle & Gamification */}
      <AnimatedCard variant="interactive" className="mb-6">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  <Badge className={getTrustLevelColor(stats?.trustLevel || 'BRONZE')}>
                    {stats?.trustLevel}
                  </Badge>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back! ✨
                </h1>
                <p className="text-gray-600">
                  Level {stats?.level || 1} • {stats?.streakDays || 0} day streak 🔥
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex space-x-1">
                    {(stats?.badges || []).slice(0, 3).map((badge, idx) => (
                      <span key={idx} className="text-lg" title={badge}>
                        {badge === 'RELIABLE' ? '🛡️' : 
                         badge === 'FAST' ? '⚡' : 
                         badge === 'HELPFUL' ? '❤️' : '⭐'}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {stats?.loyaltyPoints || 0} points
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Primary Goal Selector */}
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                <Target className="h-4 w-4 text-gray-600" />
                <select 
                  value={activeGoal} 
                  onChange={(e) => setActiveGoal(e.target.value)}
                  className="bg-transparent text-sm font-medium border-none focus:outline-none"
                >
                  <option value="earn_money">💰 Earn Money</option>
                  <option value="save_money">💝 Save Money</option>
                  <option value="help_others">🤝 Help Others</option>
                </select>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
                <Label htmlFor="mode-toggle" className="text-sm font-medium">
                  Sender
                </Label>
                <Switch
                  id="mode-toggle"
                  checked={userMode === 'traveler'}
                  onCheckedChange={handleModeChange}
                  className="data-[state=checked]:bg-purple-600"
                />
                <Label htmlFor="mode-toggle" className="text-sm font-medium">
                  Traveler
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Best 3 Matches - The Heart of Retention */}
      <AnimatedCard variant="elevated" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              <CardTitle className="text-xl">Your Best 3 Matches</CardTitle>
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
                AI Powered
              </Badge>
            </div>
            <AnimatedButton variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </AnimatedButton>
          </div>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No matches yet</h3>
              <p className="text-gray-600 mb-4">
                {userMode === 'sender' ? 'Post a trip to start earning!' : 'Send a package to start saving!'}
              </p>
              <AnimatedButton variant="premium">
                <Plus className="h-4 w-4 mr-2" />
                {userMode === 'sender' ? 'Add Trip' : 'Send Package'}
              </AnimatedButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matches.slice(0, 3).map((match, index) => (
                <div key={match.id} className="relative p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 group">
                  {/* Match Score Badge */}
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    {getMatchUrgencyIcon(match.urgency)}
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {match.matchScore}% match
                    </Badge>
                  </div>
                  
                  {/* Route */}
                  <div className="flex items-center space-x-2 mb-3 mt-4">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">{match.from}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <span className="font-medium text-sm">{match.to}</span>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Date</span>
                      <span className="text-sm font-medium">{match.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Price</span>
                      <span className="text-sm font-medium text-green-600">{match.priceRange}</span>
                    </div>
                    {match.parcel && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Weight</span>
                        <span className="text-sm">{match.parcel.weight}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Carrier Info */}
                  {match.carrier && (
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{match.carrier.name}</span>
                      <div className="flex items-center ml-auto">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs">{match.carrier.rating}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Suggestion */}
                  {match.aiSuggestion && (
                    <div className="p-2 bg-purple-50 rounded-lg mb-4">
                      <p className="text-xs text-purple-700">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        {match.aiSuggestion}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <AnimatedButton 
                    variant={index === 0 ? "premium" : "secondary"} 
                    size="sm" 
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    {userMode === 'sender' ? 'Contact Traveler' : 'Accept Package'}
                  </AnimatedButton>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <AnimatedCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickActions.slice(0, 6).map((action) => (
                  <Link key={action.id} href={action.href}>
                    <AnimatedButton 
                      variant={action.priority === 'high' ? 'premium' : 'secondary'}
                      className="w-full h-20 flex-col space-y-2"
                    >
                      <div className="flex items-center">
                        {/* Icon mapping would be dynamic based on action.icon */}
                        <Plus className="h-5 w-5" />
                        {action.count && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </AnimatedButton>
                  </Link>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Progress & Achievements */}
          <AnimatedCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trust Level Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Trust Level</span>
                    <Badge className={getTrustLevelColor(stats?.trustLevel || 'BRONZE')}>
                      {stats?.trustLevel}
                    </Badge>
                  </div>
                  <Progress value={75} className="h-3 mb-2" />
                  <p className="text-sm text-gray-600">2 more deliveries to {stats?.trustLevel === 'GOLD' ? 'PLATINUM' : 'next level'}</p>
                </div>
                
                {/* Daily Streak */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Daily Streak</span>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="font-bold text-orange-600">{stats?.streakDays || 0} days</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                          i < (stats?.streakDays || 0) % 7 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Achievements Grid */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-1 text-green-600" />
                  <p className="font-bold text-lg">${stats?.totalEarnings || 0}</p>
                  <p className="text-xs text-gray-600">Total Earned</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Package className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="font-bold text-lg">{stats?.completedDeliveries || 0}</p>
                  <p className="text-xs text-gray-600">Deliveries</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                  <p className="font-bold text-lg">{stats?.averageRating || 0}</p>
                  <p className="text-xs text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Right Column - Activity & Community */}
        <div className="space-y-6">
          {/* Activity Stream */}
          <AnimatedCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {activityStream.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent activity</p>
                    </div>
                  ) : (
                    activityStream.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="p-1 rounded-full bg-purple-100">
                          <CheckCircle2 className="h-3 w-3 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </AnimatedCard>

          {/* Community Impact */}
          <AnimatedCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Community Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">CO₂ Saved</span>
                  </div>
                  <span className="font-bold text-green-600">42.3 kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">People Helped</span>
                  </div>
                  <span className="font-bold text-blue-600">23</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">Countries</span>
                  </div>
                  <span className="font-bold text-purple-600">7</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  🌟 You're making the world more connected!
                </p>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}