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
import MarketplaceTrips from "@/pages/MarketplaceTrips";
import MarketplaceTripDetail from "@/pages/MarketplaceTripDetail";
import MatchRequests from "@/pages/MatchRequests";
import MatchRequestDetail from "@/pages/MatchRequestDetail";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/traveler/trips" component={TravelerTrips} />
      <Route path="/dashboard/traveler/trips/addtrip" component={AddTrip} />
      <Route path="/dashboard/parcel-requests" component={ParcelRequests} />
      <Route path="/dashboard/sender/parcels" component={SenderParcels} />
      <Route path="/parcel-request/:id" component={ParcelRequestDetail} />
      <Route path="/dashboard/matches" component={Matches} />
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
      <Route path="/match-requests" component={MatchRequests} />
      <Route path="/match-requests/:id" component={MatchRequestDetail} />
      <Route path="/checkout/:matchId" component={Checkout} />
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
