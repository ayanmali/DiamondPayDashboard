import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  formatCurrency,
  formatDate
} from "@/lib/utils";
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  DownloadIcon,
  MailIcon,
  CalendarIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { link } from "fs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SiEthereum, SiSolana } from "react-icons/si";
import { Toggle } from "@/components/ui/toggle";
// import { DrawerDialogDemo } from "@/components/customers/resp-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/forms/EditDescription";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [editDescDialogOpen, setEditDescDialogOpen] = useState(false);
  const [paymentMethodsDialogOpen, setPaymentMethodsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: topCustomers, isLoading: isLoadingTop } = useQuery({
    queryKey: ["/api/customers/top"],
  });

  const customers = data || [];
  const topCustomersList = topCustomers || [];

  const filteredCustomers = customers.filter(customer => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort customers based on the selected sorting option
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest-spend":
        return parseFloat(b.totalSpent) - parseFloat(a.totalSpent);
      case "lowest-spend":
        return parseFloat(a.totalSpent) - parseFloat(b.totalSpent);
      // case "last-paid":
      //   return parseFloat(a.totalSpent) - parseFloat(b.totalSpent);
      default:
        return 0;
    }
  });

  // Generate initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Customers</h1>
          
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {/* <Button variant="outline" className="mr-3 flex items-center">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Top Customers Card */}
      {/* <Card className="mb-8">
        <CardHeader className="px-6 py-5 border-b">
          <CardTitle>Top Customers by Spend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingTop ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 ml-auto" />
                </div>
              ))
            ) : topCustomersList.length > 0 ? (
              topCustomersList.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-medium">{customer.name}</h3>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <p className="text-sm font-medium ml-auto">
                    {formatCurrency(customer.totalSpent, 'USD')}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-sm font-medium">No customer data available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start accepting payments to see your top customers
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card> */}

      <div className="flex justify-center space-x-5 pb-5 text-muted-foreground">
        <Toggle className="rounded-3xl border border-solid font-medium">First time customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Repeat customers</Toggle>
        <Toggle className="rounded-3xl border border-solid font-medium">Recent customers</Toggle>
        {/* <Button variant="ghost" className="rounded-3xl border border-solid">First time customers</Button>
        <Button variant="ghost" className="rounded-3xl border border-solid">Repeat customers</Button>
        <Button variant="ghost" className="rounded-3xl border border-solid">Recent customers</Button> */}
      </div>
      {/* Customers List */}
      <Card>
        <CardHeader className="px-6 py-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>All Customers</CardTitle>

            <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                defaultValue="newest"
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest-spend">Highest Spend</SelectItem>
                  <SelectItem value="lowest-spend">Lowest Spend</SelectItem>
                  <SelectItem value="last-paid">Last Paid</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Payment Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Orders</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Payment Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>

                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-8" /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : sortedCustomers.length > 0 ? (
                  sortedCustomers.map((customer) => (
                    <tr key={customer.id}>
                      {/* Customer name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{customer.name}</span>
                        </div>
                      </td>

                      {/* Customer email */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <MailIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{customer.email}</span>
                        </div>
                      </td>

                      {/* Customer Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{formatDate(customer.createdAt)}</span>
                        </div>
                      </td>

                      {/*Payment Method*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <SiEthereum className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>0x93...a9</span>
                        </div>
                      </td>

                      {/* Customer Total Spent */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(customer.totalSpent, 'USD')}
                      </td>

                      {/* Number of Payments */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {Math.floor(parseFloat(customer.totalSpent) / 100)} {/* Mocked order count based on spend */}
                      </td>

                      {/* Last Payment Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{formatDate(customer.createdAt)}</span>
                        </div>
                      </td>

                      {/* Customer description */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Insert customer description here
                      </td>

                      {/* More options button */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                        {/* <Button variant="link" className="text-primary">. . .</Button> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger>. . .</DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Create invoice</DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault(); // Prevent dropdown from closing dialog immediately
                              setEditDescDialogOpen(true);
                            }}>
                              Edit description
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault(); // Prevent dropdown from closing dialog immediately
                                setPaymentMethodsDialogOpen(true);
                              }}>
                              View payment methods
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>Create subscription</DropdownMenuItem> */}
                            {/* <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                          </DropdownMenuContent>

                          {/* <DrawerDialogDemo open={dialogOpen} onOpenChange={setDialogOpen}>
                          </DrawerDialogDemo> */}

                          {/* Edit Customer Description Dialog */}
                          <Dialog open={editDescDialogOpen} onOpenChange={setEditDescDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Customer Description</DialogTitle>
                                <DialogTitle className="text-md">Some subheading</DialogTitle>
                                <DialogDescription>
                                  Test
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          {/* All Customer Payment Methods Dialog */}
                          <Dialog open={paymentMethodsDialogOpen} onOpenChange={setPaymentMethodsDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>All Payment Methods</DialogTitle>
                                <DialogDescription>
                                  View payment methods here...
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>

                        </DropdownMenu>



                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium">No customers found</p>
                      <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
