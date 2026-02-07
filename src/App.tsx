import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DealsPage from "./pages/DealsPage";
import PeoplePage from "./pages/PeoplePage";
import PayablesPage from "./pages/PayablesPage";
import PayoutsPage from "./pages/PayoutsPage";
import IncomePage from "./pages/IncomePage";
import ExpensesPage from "./pages/ExpensesPage";
import AccountsPage from "./pages/AccountsPage";
import NotFound from "./pages/NotFound";
import InstallersPage from "./pages/InstallersPage";
import IncentiveTypesPage from "./pages/IncentiveTypesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/payables" element={<PayablesPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/settings/installers" element={<InstallersPage />} />
          <Route path="/settings/incentive-types" element={<IncentiveTypesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
