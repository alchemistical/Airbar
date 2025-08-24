import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Gift,
  Copy,
  Share,
  Users,
  DollarSign,
  TrendingUp,
  Check,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type ReferralStatus = "pending" | "completed" | "paid";

type Referral = {
  id: string;
  refereeEmail: string;
  refereeName?: string;
  status: ReferralStatus;
  dateReferred: string;
  dateCompleted?: string;
  bonusAmount: number;
  isEarned: boolean;
};

export default function Referrals() {
  const [referralCode, setReferralCode] = useState("ALEX-KIM-2024");
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const mockReferrals: Referral[] = [
    {
      id: "1",
      refereeEmail: "sarah.johnson@email.com",
      refereeName: "Sarah Johnson",
      status: "completed",
      dateReferred: "2024-11-15",
      dateCompleted: "2024-11-20",
      bonusAmount: 25.0,
      isEarned: true,
    },
    {
      id: "2",
      refereeEmail: "mike.chen@email.com",
      refereeName: "Michael Chen",
      status: "completed",
      dateReferred: "2024-12-01",
      dateCompleted: "2024-12-05",
      bonusAmount: 25.0,
      isEarned: true,
    },
    {
      id: "3",
      refereeEmail: "emma.rodriguez@email.com",
      status: "pending",
      dateReferred: "2024-12-20",
      bonusAmount: 25.0,
      isEarned: false,
    },
    {
      id: "4",
      refereeEmail: "david.kim@email.com",
      status: "pending",
      dateReferred: "2024-12-25",
      bonusAmount: 25.0,
      isEarned: false,
    },
  ];

  const totalEarned = mockReferrals
    .filter(r => r.isEarned)
    .reduce((sum, r) => sum + r.bonusAmount, 0);
  const pendingEarnings = mockReferrals
    .filter(r => !r.isEarned)
    .reduce((sum, r) => sum + r.bonusAmount, 0);
  const completedReferrals = mockReferrals.filter(
    r => r.status === "completed"
  ).length;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const copyReferralLink = () => {
    const referralLink = `https://airbar.app/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const sendInvitation = () => {
    if (inviteEmail) {
      // In real app, would send invitation
      setInviteEmail("");
    }
  };

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const shareToSocial = (platform: string) => {
    const referralLink = `https://airbar.app/signup?ref=${referralCode}`;
    const message =
      "Join me on Airbar and earn money by delivering packages while traveling! Use my referral code to get started.";

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">
              Referral Program
            </h1>
            <p className="text-gray-600">
              Earn $25 for every friend you refer who completes their first
              delivery
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${totalEarned.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Earnings</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    ${pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Successful Referrals
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {completedReferrals}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Invites</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {mockReferrals.length}
                  </p>
                </div>
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code & Sharing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Referral Code
                </label>
                <div className="flex space-x-2">
                  <Input value={referralCode} readOnly className="font-mono" />
                  <Button variant="outline" onClick={copyReferralCode}>
                    {copySuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Referral Link
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={`https://airbar.app/signup?ref=${referralCode}`}
                    readOnly
                    className="text-sm"
                  />
                  <Button variant="outline" onClick={copyReferralLink}>
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium mb-2">
                  Share on Social Media
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial("twitter")}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial("facebook")}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial("linkedin")}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Send Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>

              <Button onClick={sendInvitation} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  How it works:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your friend signs up using your referral code</li>
                  <li>• They complete their first successful delivery</li>
                  <li>• You both earn $25 bonus</li>
                  <li>• Bonus is added to your wallet within 24 hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle>Referral History ({mockReferrals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {mockReferrals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No referrals yet</h3>
                <p>Start inviting friends to earn your first referral bonus!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockReferrals.map(referral => (
                  <div
                    key={referral.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">
                            {referral.refereeName || referral.refereeEmail}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(referral.status)}
                          >
                            {referral.status.charAt(0).toUpperCase() +
                              referral.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Email: {referral.refereeEmail}</p>
                          <p>Referred: {referral.dateReferred}</p>
                          {referral.dateCompleted && (
                            <p>Completed: {referral.dateCompleted}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold ${
                            referral.isEarned
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          ${referral.bonusAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.isEarned ? "Earned" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
