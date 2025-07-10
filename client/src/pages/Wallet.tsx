import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet as WalletIcon, 
  DollarSign, 
  Clock, 
  Gift,
  TrendingUp,
  ArrowRight,
  Users,
  Package,
  CreditCard
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/DashboardLayout";

type WalletData = {
  availableBalance: number;
  pendingEarnings: number;
  escrowBalance: number;
  withdrawableBalance: number;
  totalEarned: number;
  totalPaid: number;
  referralBonus: number;
  referralCount: number;
};

export default function Wallet() {
  // Mock data - in real app this would come from API
  const mockWalletData: WalletData = {
    availableBalance: 1247.50,
    pendingEarnings: 185.00,
    escrowBalance: 320.00,
    withdrawableBalance: 1247.50,
    totalEarned: 3420.75,
    totalPaid: 890.25,
    referralBonus: 125.00,
    referralCount: 5
  };











  const walletPages = [
    {
      title: "Traveler Dashboard",
      description: "View earnings, withdrawals, and escrow funds",
      href: "/dashboard/wallet",
      icon: WalletIcon,
      color: "bg-green-100 text-green-600",
      current: true
    },
    {
      title: "Sender Payments",
      description: "Track payment history and invoice downloads",
      href: "/dashboard/wallet/sender",
      icon: CreditCard,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Escrow Funds",
      description: "Monitor funds held during delivery",
      href: "/dashboard/wallet/escrow",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Withdrawals & Methods",
      description: "Manage withdrawal history and payout methods",
      href: "/dashboard/wallet/withdrawals",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Referral Program",
      description: "Earn bonuses by inviting friends",
      href: "/dashboard/wallet/referrals",
      icon: Users,
      color: "bg-pink-100 text-pink-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Wallet Dashboard</h1>
            <p className="text-gray-600">Complete financial management for your Airbar account</p>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${mockWalletData.availableBalance.toFixed(2)}
                  </p>
                </div>
                <WalletIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Earnings</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    ${mockWalletData.pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${mockWalletData.totalEarned.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Referral Bonus</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${mockWalletData.referralBonus.toFixed(2)}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {walletPages.map((page) => (
            <Card key={page.href} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href={page.href}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${page.color}`}>
                        <page.icon className="h-6 w-6" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{page.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                        
                        {page.current && (
                          <div className="flex items-center text-sm text-blue-600">
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/wallet/withdrawals">
                <Button className="w-full h-16 bg-green-600 hover:bg-green-700">
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                    <span>Withdraw Funds</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/dashboard/wallet/referrals">
                <Button variant="outline" className="w-full h-16">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-1" />
                    <span>Invite Friends</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/dashboard/wallet/escrow">
                <Button variant="outline" className="w-full h-16">
                  <div className="text-center">
                    <Package className="h-6 w-6 mx-auto mb-1" />
                    <span>View Escrow</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}