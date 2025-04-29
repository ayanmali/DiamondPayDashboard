import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { 
  HomeIcon, 
  WalletIcon, 
  ArrowLeftRightIcon, 
  ThumbsUp, 
  UsersIcon, 
  LinkIcon, 
  ShoppingCartIcon, 
  FileTextIcon, 
  GiftIcon, 
  BoltIcon,
  XIcon
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarItem = ({ href, icon, children, onClick }: SidebarItemProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href} onClick={onClick}>
      <a
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary bg-opacity-10 text-primary dark:text-primary"
            : "text-gray-dark dark:text-gray-medium hover:bg-gray-light dark:hover:bg-darkmode hover:text-primary dark:hover:text-white"
        )}
      >
        <span className="mr-3 h-5 w-5">{icon}</span>
        <span>{children}</span>
      </a>
    </Link>
  );
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { isMobile } = useMobile();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or use user's system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // Close sidebar on mobile when clicking a link
  const handleItemClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "flex flex-col z-50 bg-white dark:bg-darkmode-lighter border-r border-border",
        isMobile 
          ? "fixed inset-y-0 left-0 w-64"
          : "w-64 hidden md:flex"
      )}>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <BoltIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">DiamondPay</h1>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem href="/dashboard" icon={<HomeIcon />} onClick={handleItemClick}>
            Dashboard
          </SidebarItem>
          
          <SidebarItem href="/wallets" icon={<WalletIcon />} onClick={handleItemClick}>
            Wallets
          </SidebarItem>
          
          <SidebarItem href="/transactions" icon={<ArrowLeftRightIcon />} onClick={handleItemClick}>
            Transactions
          </SidebarItem>
          
          <SidebarItem href="/token-transfers" icon={<ThumbsUp />} onClick={handleItemClick}>
            Token Transfers
          </SidebarItem>
          
          <SidebarItem href="/customers" icon={<UsersIcon />} onClick={handleItemClick}>
            Customers
          </SidebarItem>
          
          <div className="pt-4 pb-2">
            <div className="flex items-center px-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-medium">
                Payments
              </h3>
            </div>
          </div>
          
          <SidebarItem href="/payment-links" icon={<LinkIcon />} onClick={handleItemClick}>
            Payment Links
          </SidebarItem>
          
          {/* <SidebarItem href="/checkout-integrations" icon={<ShoppingCartIcon />} onClick={handleItemClick}>
            Checkout Integrations
          </SidebarItem> */}
          
          <SidebarItem href="/invoices" icon={<FileTextIcon />} onClick={handleItemClick}>
            Invoices
          </SidebarItem>
          
          {/* <SidebarItem href="/donations" icon={<GiftIcon />} onClick={handleItemClick}>
            Donations
          </SidebarItem> */}
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-dark dark:text-gray-medium">
              Dark Mode
            </span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
