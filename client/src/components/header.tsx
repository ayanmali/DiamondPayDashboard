import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMobile } from "@/hooks/use-mobile";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Link as LinkIcon,
  ShoppingCart,
  FileText,
  Settings,
  User,
  LogOut,
  PlusIcon,
} from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { isMobile } = useMobile();
  const [hasNotification] = useState(true);

  return (
    <header className="bg-white dark:bg-darkmode-lighter border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Search bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 h-9 bg-muted bg-opacity-50 dark:bg-darkmode focus:ring-primary"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2">
                <span>New</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <LinkIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Payment Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShoppingCart className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Checkout Integration</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Donation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-6 w-6" />
            {hasNotification && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent"></span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  John Doe
                </span>
                <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/settings">
                <DropdownMenuItem  className="cursor-pointer">
                  <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/account">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>My Account</span>
              </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSeparator />
              <Link to="/signout">
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
