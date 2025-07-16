import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import TravelerTrips from "@/pages/TravelerTrips";
import AddTrip from "@/pages/AddTrip";
import ParcelRequests from "@/pages/ParcelRequests";
import SenderParcels from "@/pages/SenderParcels";
import ParcelRequestDetail from "@/pages/ParcelRequestDetail";
import Matches from "@/pages/Matches";
import DashboardMatches from "@/pages/DashboardMatches";
import SendPackage from "@/pages/SendPackage";
import Tracking from "@/pages/Tracking";
import Wallet from "@/pages/Wallet";
import WalletEscrow from "@/pages/WalletEscrow";
import WalletWithdrawals from "@/pages/WalletWithdrawals";
import WalletReferrals from "@/pages/WalletReferrals";
import WalletSender from "@/pages/WalletSender";
import WalletTransactions from "@/pages/WalletTransactions";
import History from "@/pages/History";
import HistoryDetail from "@/pages/HistoryDetail";
import HistoryTraveler from "@/pages/HistoryTraveler";
import HistorySender from "@/pages/HistorySender";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Referrals from "@/pages/Referrals";
import Support from "@/pages/Support";
import DisputeList from "@/pages/DisputeList";
import DisputeNew from "@/pages/DisputeNew";
import DisputeDetail from "@/pages/DisputeDetail";
import MarketplaceTrips from "@/pages/marketplace/Trips";
import MarketplaceTripDetail from "@/pages/MarketplaceTripDetail";
import MatchRequests from "@/pages/MatchRequests";
import Checkout from "@/pages/Checkout";
import PaymentCheckout from "@/pages/PaymentCheckout";
import BrowsePackages from "@/pages/BrowsePackages";
import NotFound from "@/pages/not-found";

// Marketing pages
import MarketingHome from "@/marketing/pages/index";
import HowItWorks from "@/marketing/pages/how-it-works";
import Pricing from "@/marketing/pages/pricing";
import Safety from "@/marketing/pages/safety";
import Business from "@/marketing/pages/business";
import FAQ from "@/marketing/pages/faq";
import Contact from "@/marketing/pages/contact";
import Terms from "@/marketing/pages/terms";
import Privacy from "@/marketing/pages/privacy";
import Cookies from "@/marketing/pages/cookies";
import About from "@/marketing/pages/about";
import Careers from "@/marketing/pages/careers";
import Press from "@/marketing/pages/press";
import Blog from "@/marketing/pages/blog";

function Router() {
  return (
    <Switch>
      {/* Marketing Routes */}
      <Route path="/" component={MarketingHome} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/safety" component={Safety} />
      <Route path="/business" component={Business} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/about" component={About} />
      <Route path="/careers" component={Careers} />
      <Route path="/press" component={Press} />
      <Route path="/blog" component={Blog} />
      
      {/* App Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
      <Route path="/dashboard/traveler/trips/addtrip" component={AddTrip} />
      <Route path="/dashboard/parcel-requests" component={ParcelRequests} />
      <Route path="/dashboard/sender/parcels" component={SenderParcels} />
      <Route path="/parcel-request/:id" component={ParcelRequestDetail} />
      <Route path="/dashboard/matches" component={DashboardMatches} />
      <Route path="/dashboard/matches/:matchId" component={DashboardMatches} />
      <Route path="/send-package" component={SendPackage} />
      <Route path="/dashboard/tracking" component={Tracking} />
      <Route path="/dashboard/wallet" component={Wallet} />
      <Route path="/dashboard/wallet/escrow" component={WalletEscrow} />
      <Route path="/dashboard/wallet/withdrawals" component={WalletWithdrawals} />
      <Route path="/dashboard/wallet/referrals" component={WalletReferrals} />
      <Route path="/dashboard/wallet/sender" component={WalletSender} />
      <Route path="/dashboard/wallet/transactions" component={WalletTransactions} />
      <Route path="/dashboard/history" component={History} />
      <Route path="/dashboard/history/view/:id" component={HistoryDetail} />
      <Route path="/dashboard/history/traveler" component={HistoryTraveler} />
      <Route path="/dashboard/history/sender" component={HistorySender} />
      <Route path="/dashboard/notifications" component={Notifications} />
      <Route path="/dashboard/profile" component={Profile} />
      <Route path="/dashboard/referrals" component={Referrals} />
      <Route path="/dashboard/support" component={Support} />
      <Route path="/support/disputes" component={DisputeList} />
      <Route path="/support/disputes/new" component={DisputeNew} />
      <Route path="/support/disputes/:id" component={DisputeDetail} />
      <Route path="/marketplace/trips" component={MarketplaceTrips} />
      <Route path="/marketplace/trips/:id" component={MarketplaceTripDetail} />
      <Route path="/browse-packages" component={BrowsePackages} />
      <Route path="/match-requests" component={MatchRequests} />
      <Route path="/match-requests/:id" component={MatchRequests} />
      <Route path="/checkout/:matchId" component={Checkout} />
      <Route path="/payment-checkout/:id" component={PaymentCheckout} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
