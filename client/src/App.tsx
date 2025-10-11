import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Dashboard from "@/pages/dashboard/dashboard";
import Transactions from "@/pages/transactions";
import Wallets from "@/pages/wallets";
import Customers from "@/pages/customers/customers";
import { useMobile } from "@/hooks/use-mobile";
import { LandingPage } from "./pages/landing-page/lander";
import Login from "./pages/login-signup/login";
import Signup from "./pages/login-signup/signup";
import Invoices from "./pages/invoices/invoices";
import PaymentLinks from "./pages/payment-links/payment-links";
import NewInvoicePage from "./pages/invoices/new-invoice";
import NewPaymentLinkPage from "./pages/payment-links/new-payment-link";
import Products from "./pages/product-catalogue/products";
import WalletActivity from "./pages/wallet-activity/recent-activity";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage}/>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/wallets" component={Wallets} />
      <Route path="/customers" component={Customers} />
      <Route path="/products" component={Products} />

      <Route path="/invoices" component={Invoices} />
      <Route path="/invoices/new" component={NewInvoicePage} />

      <Route path="/payment-links" component={PaymentLinks} />
      <Route path="/payment-links/new" component={NewPaymentLinkPage}/>
      <Route path="/wallet-activity" component={WalletActivity}/>
      
      {/* <Route path="/token-transfers" component={} /> */}

      {/* <Route path="/links" component={} />
      <Route path="/checkouts" component={} />
      <Route path="/invoices" component={} />
      <Route path="/donations" component={} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { isMobile } = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-6">
            <Router />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="signup" component={Signup} />
        <Route path="/invoices/new" component={NewInvoicePage} />
        <Route path="/payment-links/new" component={NewPaymentLinkPage} />
        {/* <Route path="/settings" component={Login} />
        <Route path="/account" component={Login} /> */}
        <Route path="*">
          <AppLayout />
        </Route>
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
