import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Gift,
  Copy,
  Mail,
  MessageCircle,
  Share2,
  Trophy,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

type Referral = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "invited" | "joined" | "verified" | "completed-first" | "active";
  totalEarnings: number;
  bonusEarned: number;
  deliveriesCompleted: number;
  lastActivity: string;
};

type ReferralBonus = {
  id: string;
  referralName: string;
  bonusType: "signup" | "first-delivery" | "milestone";
  amount: number;
  earnedDate: string;
  status: "pending" | "paid";
  description: string;
};

export default function WalletReferrals() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  const referralLink = "https://airbar.com/ref/AK2025XYZ";
  
  const mockReferrals: Referral[] = [
    {
      id: "REF-001",
      name: "Sarah Chen",
      email: "sarah@email.com",
      joinDate: "2024-12-15",
      status: "active",
      totalEarnings: 1250.00,
      bonusEarned: 50.00,
      deliveriesCompleted: 8,
      lastActivity: "2025-01-09"
    },
    {
      id: "REF-002",
      name: "Mike Rodriguez",
      email: "mike@email.com",
      joinDate: "2024-12-28",
      status: "completed-first",
      totalEarnings: 85.00,
      bonusEarned: 25.00,
      deliveriesCompleted: 1,
      lastActivity: "2025-01-05"
    },
    {
      id: "REF-003",
      name: "Lisa Park",
      email: "lisa@email.com",
      joinDate: "2025-01-02",
      status: "verified",
      totalEarnings: 0,
      bonusEarned: 10.00,
      deliveriesCompleted: 0,
      lastActivity: "2025-01-03"
    },
    {
      id: "REF-004",
      name: "David Kim",
      email: "david@email.com",
      joinDate: "2025-01-08",
      status: "joined",
      totalEarnings: 0,
      bonusEarned: 0,
      deliveriesCompleted: 0,
      lastActivity: "2025-01-08"
    },
    {
      id: "REF-005",
      name: "Emma Wilson",
      email: "emma@email.com",
      joinDate: "2025-01-10",
      status: "invited",
      totalEarnings: 0,
      bonusEarned: 0,
      deliveriesCompleted: 0,
      lastActivity: "-"
    }
  ];

  const mockBonuses: ReferralBonus[] = [
    {
      id: "RB-001",
      referralName: "Sarah Chen",
      bonusType: "milestone",
      amount: 25.00,
      earnedDate: "2025-01-01",
      status: "paid",
      description: "5 successful deliveries milestone"
    },
    {
      id: "RB-002",
      referralName: "Mike Rodriguez",
      bonusType: "first-delivery",
      amount: 25.00,
      earnedDate: "2025-01-05",
      status: "paid",
      description: "First delivery completed"
    },
    {
      id: "RB-003",
      referralName: "Sarah Chen",
      bonusType: "first-delivery",
      amount: 25.00,
      earnedDate: "2024-12-20",
      status: "paid",
      description: "First delivery completed"
    },
    {
      id: "RB-004",
      referralName: "Lisa Park",
      bonusType: "signup",
      amount: 10.00,
      earnedDate: "2025-01-03",
      status: "paid",
      description: "Account verification completed"
    },
    {
      id: "RB-005",
      referralName: "Sarah Chen",
      bonusType: "signup",
      amount: 10.00,
      earnedDate: "2024-12-16",
      status: "paid",
      description: "Account verification completed"
    }
  ];

  const totalReferrals = mockReferrals.length;
  const activeReferrals = mockReferrals.filter(r => r.status === "active").length;
  const totalBonusEarned = mockBonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
  const pendingBonuses = mockBonuses.filter(b => b.status === "pending").reduce((sum, bonus) => sum + bonus.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed-first":
        return "bg-blue-100 text-blue-800";
      case "verified":
        return "bg-purple-100 text-purple-800";
      case "joined":
        return "bg-yellow-100 text-yellow-800";
      case "invited":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed-first":
        return "First Delivery";
      case "verified":
        return "Verified";
      case "joined":
        return "Joined";
      case "invited":
        return "Invited";
      default:
        return status;
    }
  };

  const getBonusTypeIcon = (type: string) => {
    switch (type) {
      case "signup":
        return <Users className="h-4 w-4" />;
      case "first-delivery":
        return <CheckCircle className="h-4 w-4" />;
      case "milestone":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const handleSendInvites = () => {
    // In real app, this would send invitations
    toast({
      title: "Invitations sent!",
      description: `Invitations sent to ${inviteEmails.split(',').length} email(s).`,
    });
    setShowInviteModal(false);
    setInviteEmails("");
    setCustomMessage("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Referral Program</h1>
            <p className="text-gray-600">Earn bonuses by inviting friends to Airbar</p>
          </div>
          
          <Button onClick={() => setShowInviteModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold text-blue-600">{totalReferrals}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Referrals</p>
                  <p className="text-3xl font-bold text-green-600">{activeReferrals}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bonus Earned</p>
                  <p className="text-3xl font-bold text-purple-600">${totalBonusEarned.toFixed(2)}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Bonuses</p>
                  <p className="text-3xl font-bold text-yellow-600">${pendingBonuses.toFixed(2)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={copyReferralLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share your link with friends who want to become travelers</li>
                <li>• Earn $10 when they verify their account</li>
                <li>• Earn $25 when they complete their first delivery</li>
                <li>• Earn milestone bonuses for their continued activity</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-blue-600">
                        {referral.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{referral.name}</span>
                        <Badge className={getStatusColor(referral.status)}>
                          {getStatusLabel(referral.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{referral.email}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Joined {new Date(referral.joinDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{referral.deliveriesCompleted} deliveries</span>
                        {referral.lastActivity !== "-" && (
                          <>
                            <span>•</span>
                            <span>Last active {new Date(referral.lastActivity).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      +${referral.bonusEarned.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Their earnings: ${referral.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus History */}
        <Card>
          <CardHeader>
            <CardTitle>Bonus History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBonuses.map((bonus) => (
                <div key={bonus.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {getBonusTypeIcon(bonus.bonusType)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{bonus.referralName}</span>
                        <Badge className={bonus.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {bonus.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{bonus.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(bonus.earnedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-purple-600">
                      +${bonus.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite Modal */}
        <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Friends</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Addresses</label>
                <Textarea
                  placeholder="Enter email addresses separated by commas"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Message (Optional)</label>
                <Textarea
                  placeholder="Add a personal message to your invitation"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your invite will include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your personal referral link</li>
                  <li>• Information about earning with Airbar</li>
                  <li>• Sign-up bonus details</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendInvites}
                  disabled={!inviteEmails.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invites
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}