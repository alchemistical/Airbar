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
      <Route path="/matches" component={Matches} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
