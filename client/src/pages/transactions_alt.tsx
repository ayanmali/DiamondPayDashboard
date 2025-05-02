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
  formatCryptoAmount, 
  formatDate, 
  getStatusColor, 
  getTypeColor 
} from "@/lib/utils";
import { 
  FilterIcon, 
  DownloadIcon,
  SearchIcon, 
  PlusIcon 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/table";

export default function Transactions() {
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const transactions = data || [];

  const filteredTransactions = transactions.filter(tx => {
    if (status !== "all" && tx.status !== status) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.currency.toLowerCase().includes(query) ||
        (tx.fiatCurrency && tx.fiatCurrency.toLowerCase().includes(query)) ||
        (tx.type && tx.type.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Transactions</h1>
          
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">

          {/* <Button className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Transaction
          </Button> */}
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader className="px-6 py-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>All Transactions</CardTitle>
            
            <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-3">
              {/* <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}
              
              <Select 
                defaultValue="all"
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center">
                <FilterIcon className="mr-2 h-4 w-4" />
                More Filters
              </Button>

              <Button variant="outline" className="mr-3 flex items-center">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaction ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-32"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-4 bg-muted rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">#{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            transaction.status === 'completed' ? 'bg-secondary' : transaction.status === 'pending' ? 'bg-amber-500' : 'bg-destructive'
                          }`}></div>
                          <span className="text-sm font-medium capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">
                            {formatCryptoAmount(transaction.amount, transaction.currency)}
                          </span>
                          <span className="text-muted-foreground">
                            ({formatCurrency(transaction.fiatAmount || 0, transaction.fiatCurrency)})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {transaction.customer?.name || "Nate"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={getTypeColor(transaction.type)}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="link" className="text-primary">Details</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm font-medium">No transactions found</p>
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
