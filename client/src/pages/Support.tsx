import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Search,
  MessageCircle,
  Mail,
  FileText,
  HelpCircle,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Users,
  Package,
  DollarSign,
  Settings,
  Shield,
  Star,
  MessageSquare,
  Send,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type TicketStatus = "open" | "resolved" | "pending";
type SupportCategory = "traveler" | "sender" | "payments" | "technical" | "account" | "escrow" | "ratings" | "general";

interface SupportTicket {
  id: string;
  subject: string;
  category: SupportCategory;
  status: TicketStatus;
  lastUpdated: string;
  created: string;
  priority: "low" | "medium" | "high";
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: SupportCategory;
  tags: string[];
  appliesTo: "traveler" | "sender" | "both";
  helpfulVotes: number;
  totalVotes: number;
  lastUpdated: string;
}

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("faq");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: "",
    subject: "",
    message: "",
    priority: "medium",
    attachment: null as File | null
  });

  // Mock data for support tickets
  const supportTickets: SupportTicket[] = [
    {
      id: "TK-2024-001",
      subject: "Payment not received for delivery",
      category: "payments",
      status: "pending",
      lastUpdated: "2024-12-28",
      created: "2024-12-25",
      priority: "high"
    },
    {
      id: "TK-2024-002", 
      subject: "How to update KYC information",
      category: "account",
      status: "resolved",
      lastUpdated: "2024-12-20",
      created: "2024-12-18",
      priority: "medium"
    },
    {
      id: "TK-2024-003",
      subject: "Package tracking issue",
      category: "technical",
      status: "open",
      lastUpdated: "2024-12-22",
      created: "2024-12-22",
      priority: "low"
    }
  ];

  // Mock FAQ data
  const faqItems: FAQItem[] = [
    {
      id: "faq-1",
      question: "How does the matching system work?",
      answer: "Our smart matching system automatically connects parcel requests with travelers going to the same destination. When you post a trip, we'll show you relevant package requests along your route. You can accept or decline each match based on your preferences.",
      category: "general",
      tags: ["matching", "trips", "packages"],
      appliesTo: "both",
      helpfulVotes: 45,
      totalVotes: 52,
      lastUpdated: "2024-12-20"
    },
    {
      id: "faq-2", 
      question: "When do I get paid for deliveries?",
      answer: "Payment is released automatically once the recipient confirms successful delivery. Funds typically appear in your wallet within 24 hours. You can withdraw earnings to your bank account or keep them for future shipments.",
      category: "payments",
      tags: ["payment", "earnings", "delivery"],
      appliesTo: "traveler",
      helpfulVotes: 38,
      totalVotes: 41,
      lastUpdated: "2024-12-18"
    },
    {
      id: "faq-3",
      question: "What if my parcel is lost or damaged?",
      answer: "All packages are covered by our protection policy. If a parcel is lost or damaged during transit, both sender and traveler should report it immediately. We'll investigate and provide compensation based on the declared value.",
      category: "general",
      tags: ["lost", "damaged", "protection", "insurance"],
      appliesTo: "both",
      helpfulVotes: 29,
      totalVotes: 35,
      lastUpdated: "2024-12-15"
    },
    {
      id: "faq-4",
      question: "How do I report a problem with another user?",
      answer: "You can report any issues through your order details page or by contacting support directly. We take all reports seriously and will investigate promptly to ensure platform safety.",
      category: "account",
      tags: ["report", "safety", "users"],
      appliesTo: "both",
      helpfulVotes: 22,
      totalVotes: 28,
      lastUpdated: "2024-12-10"
    },
    {
      id: "faq-5",
      question: "What is Escrow and how does it work?",
      answer: "Escrow is our secure payment system that holds funds until delivery is confirmed. When a sender posts a package, payment is held in escrow. Once delivery is confirmed by the recipient, funds are released to the traveler.",
      category: "escrow",
      tags: ["escrow", "payment", "security"],
      appliesTo: "both",
      helpfulVotes: 56,
      totalVotes: 63,
      lastUpdated: "2024-12-22"
    },
    {
      id: "faq-6",
      question: "How can I cancel a trip or package request?",
      answer: "You can cancel trips or package requests before they're matched. Go to your dashboard, find the item you want to cancel, and click the cancel button. Note that cancellation policies may apply for matched items.",
      category: "general",
      tags: ["cancel", "trips", "requests"],
      appliesTo: "both",
      helpfulVotes: 33,
      totalVotes: 39,
      lastUpdated: "2024-12-12"
    },
    {
      id: "faq-7",
      question: "How does the rating system work?",
      answer: "After each completed delivery, both travelers and senders can rate each other on a 5-star scale. Ratings help build trust in the community and influence matching preferences.",
      category: "ratings",
      tags: ["ratings", "reviews", "trust"],
      appliesTo: "both",
      helpfulVotes: 41,
      totalVotes: 47,
      lastUpdated: "2024-12-08"
    },
    {
      id: "faq-8",
      question: "What items are prohibited for shipping?",
      answer: "Prohibited items include hazardous materials, illegal substances, weapons, and perishable goods. Check our terms of service for the complete list of restricted items.",
      category: "general",
      tags: ["prohibited", "restrictions", "items"],
      appliesTo: "both",
      helpfulVotes: 67,
      totalVotes: 72,
      lastUpdated: "2024-12-25"
    },
    {
      id: "faq-9",
      question: "How do I become a verified traveler?",
      answer: "Complete your KYC verification by uploading a government ID and proof of address. Verified travelers receive higher priority in matching and can carry higher-value packages.",
      category: "traveler",
      tags: ["kyc", "verification", "traveler"],
      appliesTo: "traveler",
      helpfulVotes: 28,
      totalVotes: 32,
      lastUpdated: "2024-12-05"
    },
    {
      id: "faq-10",
      question: "What are the package size and weight limits?",
      answer: "Standard packages can weigh up to 20kg (44lbs) and measure max 60cm x 40cm x 30cm. Larger packages require special approval and may incur additional fees.",
      category: "sender",
      tags: ["limits", "weight", "size", "packages"],
      appliesTo: "sender",
      helpfulVotes: 52,
      totalVotes: 58,
      lastUpdated: "2024-12-18"
    }
  ];

  const categories = [
    { value: "all", label: "All Topics", icon: HelpCircle },
    { value: "traveler", label: "Traveler Issues", icon: Users },
    { value: "sender", label: "Sender Issues", icon: Package },
    { value: "payments", label: "Payments", icon: DollarSign },
    { value: "technical", label: "Technical", icon: Settings },
    { value: "account", label: "Account", icon: Shield },
    { value: "escrow", label: "Escrow", icon: Shield },
    { value: "ratings", label: "Ratings", icon: Star },
    { value: "general", label: "General", icon: MessageSquare }
  ];

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return AlertCircle;
      case "resolved":
        return CheckCircle;
      case "pending":
        return Clock;
      default:
        return HelpCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = faqItems
        .filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
        .map(faq => faq.question);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSubmitTicket = async () => {
    setIsSubmitting(true);
    // In real app, would submit to API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    console.log("Submitting ticket:", ticketForm);
    setIsContactModalOpen(false);
    setTicketForm({ category: "", subject: "", message: "", priority: "medium", attachment: null });
    setIsSubmitting(false);
  };

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    // In real app, would send feedback to API
    console.log(`FAQ ${faqId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.icon : HelpCircle;
  };

  const getRoleLabel = (appliesTo: string) => {
    switch (appliesTo) {
      case "traveler":
        return { label: "Traveler", color: "bg-blue-100 text-blue-800" };
      case "sender":
        return { label: "Sender", color: "bg-green-100 text-green-800" };
      case "both":
        return { label: "All Users", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: "General", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getHelpfulnessPercentage = (helpful: number, total: number) => {
    return total > 0 ? Math.round((helpful / total) * 100) : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-airbar-black">Help & Support</h1>
          <p className="text-lg text-gray-600">Find answers or reach out to our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles, guides, or common issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(searchQuery.length > 2)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-12 pr-4 py-3 text-lg rounded-xl"
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      <Search className="inline h-4 w-4 text-gray-400 mr-2" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-airbar-blue hover:bg-blue-700 text-white rounded-xl">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit a Support Request</DialogTitle>
                  <DialogDescription>
                    Tell us about your issue and we'll get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({...ticketForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.value !== "all").map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your issue..."
                      rows={4}
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">
                        {ticketForm.attachment ? ticketForm.attachment.name : "Drag files here or click to upload (optional)"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setTicketForm({...ticketForm, attachment: e.target.files?.[0] || null})}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSubmitTicket} 
                      className="flex-1"
                      disabled={isSubmitting || !ticketForm.category || !ticketForm.subject || !ticketForm.message}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsContactModalOpen(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="rounded-xl" asChild>
              <a href="mailto:support@airbar.app">
                <Mail className="h-5 w-5 mr-2" />
                Email Support
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 mr-2" />
                  Browse Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const count = category.value === "all" 
                      ? faqItems.length 
                      : faqItems.filter(faq => faq.category === category.value).length;
                    
                    return (
                      <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "ghost"}
                        className="w-full justify-start rounded-lg"
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <Card className="rounded-xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
                <p className="text-sm text-gray-600">Replies within 24-48 hours</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Coming soon</p>
                  </div>
                  <Badge variant="secondary">Soon</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" 
                     onClick={() => window.location.href = "mailto:support@airbar.app"}>
                  <Mail className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@airbar.app</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     onClick={() => window.open("https://t.me/airbarsupport", "_blank")}>
                  <Send className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Join Telegram</p>
                    <p className="text-sm text-gray-600">Community support</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">1-800-AIRBAR</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="faq" className="rounded-lg transition-all">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ & Knowledge Base
                </TabsTrigger>
                <TabsTrigger value="tickets" className="rounded-lg transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  My Support Requests
                </TabsTrigger>
              </TabsList>

              {/* FAQ Section */}
              <TabsContent value="faq" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                  <Badge variant="outline" className="rounded-full">
                    {filteredFAQs.length} articles
                  </Badge>
                </div>

                {filteredFAQs.length === 0 ? (
                  <Card className="rounded-xl">
                    <CardContent className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No articles found</h3>
                      <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="rounded-xl">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {filteredFAQs.map((faq) => {
                          const CategoryIcon = getCategoryIcon(faq.category);
                          const roleLabel = getRoleLabel(faq.appliesTo);
                          const helpfulnessPercentage = getHelpfulnessPercentage(faq.helpfulVotes, faq.totalVotes);
                          
                          return (
                            <AccordionItem key={faq.id} value={faq.id} className="px-6">
                              <AccordionTrigger className="text-left hover:no-underline">
                                <div className="flex items-start space-x-3 w-full">
                                  <CategoryIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <span className="font-medium">{faq.question}</span>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <Badge variant="secondary" className={`text-xs rounded-full ${roleLabel.color}`}>
                                          {roleLabel.label}
                                        </Badge>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Badge variant="outline" className="text-xs rounded-full">
                                              {helpfulnessPercentage}% helpful
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{faq.helpfulVotes} of {faq.totalVotes} found this helpful</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-8 pr-4 pb-4">
                                <p className="text-gray-700 mb-4">{faq.answer}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {faq.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">
                                      Was this helpful?
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleFeedback(faq.id, true)}
                                        className="rounded-full hover:bg-green-50"
                                      >
                                        <ThumbsUp className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleFeedback(faq.id, false)}
                                        className="rounded-full hover:bg-red-50"
                                      >
                                        <ThumbsDown className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    Updated {faq.lastUpdated}
                                  </span>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Support Tickets Section */}
              <TabsContent value="tickets" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Support Requests</h2>
                  <Button onClick={() => setIsContactModalOpen(true)} className="rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>

                <Card className="rounded-xl">
                  <CardContent className="p-0">
                    {supportTickets.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No support requests</h3>
                        <p className="text-gray-600">You haven't submitted any support requests yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {supportTickets.map((ticket) => {
                          const StatusIcon = getStatusIcon(ticket.status);
                          return (
                            <div key={ticket.id} className={`p-6 border-l-4 ${getPriorityColor(ticket.priority)} hover:bg-gray-50 cursor-pointer`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="font-mono text-sm text-blue-600">{ticket.id}</span>
                                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize">
                                      {ticket.category}
                                    </Badge>
                                  </div>
                                  
                                  <h3 className="font-semibold text-lg mb-2">{ticket.subject}</h3>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>Created: {ticket.created}</span>
                                    <span>Updated: {ticket.lastUpdated}</span>
                                    <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"} className="capitalize">
                                      {ticket.priority} priority
                                    </Badge>
                                  </div>
                                </div>
                                
                                <Button variant="outline" size="sm" className="rounded-lg">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}