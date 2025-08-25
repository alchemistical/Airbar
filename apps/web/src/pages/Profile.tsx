import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  AnimatedCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Camera,
  Save,
  CheckCircle,
  Phone,
  Calendar,
  Star,
  FileText,
  Bell,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Mock user data
  const mockUser = {
    id: "1",
    username: "alexkim",
    email: "alex.kim@email.com",
    phone: "+1 (555) 123-4567",
    firstName: "Alex",
    lastName: "Kim",
    avatar: "",
    bio: "Frequent traveler passionate about connecting communities through reliable package delivery.",
    address: "123 Main St, New York, NY 10001",
    dateJoined: "2023-06-15",
    isKycVerified: true,
    rating: 4.8,
    totalTrips: 42,
    totalDeliveries: 38,
    languages: ["English", "Korean"],
    emergencyContact: {
      name: "Sarah Kim",
      phone: "+1 (555) 987-6543",
      relationship: "Sister",
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
    },
    privacy: {
      showProfile: true,
      showRating: true,
      showTrips: false,
      showLocation: true,
    },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold text-airbar-black">Profile</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Premium Profile Overview */}
        <AnimatedCard
          variant="premium"
          className="bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
          <CardContent className="p-8">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarImage
                      src={mockUser.avatar}
                      alt={mockUser.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
                      {mockUser.firstName.charAt(0)}
                      {mockUser.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <AnimatedButton
                  size="sm"
                  variant="premium"
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </AnimatedButton>
              </div>

              <div className="flex-1">
                <motion.div
                  className="flex items-center space-x-4 mb-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    {mockUser.firstName} {mockUser.lastName}
                  </h2>
                  {mockUser.isKycVerified && (
                    <Badge variant="verified" className="text-sm px-3 py-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      KYC Verified
                    </Badge>
                  )}
                </motion.div>

                <motion.p
                  className="text-gray-700 mb-6 text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {mockUser.bio}
                </motion.p>

                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {mockUser.rating}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {mockUser.totalTrips}
                      </div>
                      <div className="text-sm text-gray-600">Trips</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {mockUser.totalDeliveries}
                      </div>
                      <div className="text-sm text-gray-600">Deliveries</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">2023</div>
                      <div className="text-sm text-gray-600">Member Since</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-8">
            <AnimatedCard variant="interactive">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedInput
                    label="First Name"
                    variant="premium"
                    defaultValue={mockUser.firstName}
                  />
                  <AnimatedInput
                    label="Last Name"
                    variant="premium"
                    defaultValue={mockUser.lastName}
                  />
                  <AnimatedInput
                    label="Email Address"
                    type="email"
                    variant="premium"
                    defaultValue={mockUser.email}
                  />
                  <AnimatedInput
                    label="Phone Number"
                    type="tel"
                    variant="premium"
                    defaultValue={mockUser.phone}
                  />
                </div>

                <AnimatedTextarea
                  label="Bio"
                  variant="premium"
                  defaultValue={mockUser.bio}
                  placeholder="Tell others about yourself..."
                />

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={mockUser.address} />
                </div>

                <div>
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input
                    id="languages"
                    defaultValue={mockUser.languages.join(", ")}
                  />
                </div>

                <div className="flex justify-end pt-6 border-t">
                  <AnimatedButton variant="premium" className="px-8 py-3">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </AnimatedButton>
                </div>
              </CardContent>
            </AnimatedCard>

            {/* Emergency Contact */}
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Name</Label>
                    <AnimatedInput
                      id="emergencyName"
                      defaultValue={mockUser.emergencyContact.name}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <AnimatedInput
                      id="emergencyPhone"
                      defaultValue={mockUser.emergencyContact.phone}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <AnimatedInput
                      id="emergencyRelationship"
                      defaultValue={mockUser.emergencyContact.relationship}
                    />
                  </div>
                </div>
                <AnimatedButton variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Update Emergency Contact
                </AnimatedButton>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <AnimatedInput
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </AnimatedButton>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <AnimatedInput
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <AnimatedInput
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <AnimatedButton>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </AnimatedButton>
              </CardContent>
            </AnimatedCard>

            {/* KYC Verification */}
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Identity Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-medium">KYC Verification Complete</h3>
                      <p className="text-sm text-gray-600">
                        Your identity has been verified successfully
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.notifications.email} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive important alerts via text
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.notifications.sms} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Browser and mobile app notifications
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.notifications.push} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Communications</h3>
                      <p className="text-sm text-gray-600">
                        Promotional emails and updates
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.notifications.marketing} />
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <AnimatedCard>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Show Profile to Other Users
                      </h3>
                      <p className="text-sm text-gray-600">
                        Allow other users to see your profile information
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.privacy.showProfile} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Rating</h3>
                      <p className="text-sm text-gray-600">
                        Display your rating to potential matches
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.privacy.showRating} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Trip History</h3>
                      <p className="text-sm text-gray-600">
                        Allow others to see your past trips
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.privacy.showTrips} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Location</h3>
                      <p className="text-sm text-gray-600">
                        Display your general location
                      </p>
                    </div>
                    <Switch defaultChecked={mockUser.privacy.showLocation} />
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
