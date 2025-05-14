import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronDown, Icon, TrendingUp } from "lucide-react";
import CustomChart from "@/components/ui/custom-chart";
import { BarChartWithLabels } from "../ui/barchart";
import { useState } from "react";
import { Bar } from "recharts";

type Chains = 'All chains' | 'Base' | 'Polygon' | 'Optimism' | 'Arbitrum'
type Currency = 'USD' | 'EUR' | 'All currencies'

export default function TodaySummary() {
  const [chain, setChain] = useState<Chains>('All chains');
  const [currency, setCurrency] = useState<Currency>('USD');
  const { data, isLoading } = useQuery({
    queryKey: ["/api/summary/today"],
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader className="px-6 py-5 border-b">
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-24 mt-2" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-24 mt-2" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-24 mt-2" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
          </div>
          <Skeleton className="h-[300px] w-full mt-6" />
          <div className="mt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-32 mt-2" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="px-6 py-5 border-b">
        <CardTitle>Today's Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Successful payments */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Successful payments</h3>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold">{data?.successfulPayments || 0}</p>
            <p className="text-sm text-muted-foreground">{new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {formatDate(new Date())}
              </h3>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold">0</p>
          </div>

          {/* Balance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{currency} balance</h3>

              {/* Currency Selector */}
              <Select
                defaultValue="Total"
                onValueChange={(val) => setCurrency(val as Currency)}
              >
                <SelectTrigger className="ml-1 border-none shadow-none h-auto w-40 p-0 pl-2 justify-right min-w-0">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Total">All currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>

              {/* Chain Selector */}
              <Select
                defaultValue="All chains"
                onValueChange={(val) => setChain(val as Chains)}
              >
                <SelectTrigger className="ml-1 border-none shadow-none h-auto w-40 p-0 pl-2 justify-right min-w-0">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All chains">All chains</SelectItem>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="Polygon">Polygon</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="link" className="text-primary h-auto p-0">View</Button>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(data?.walletBalance || 0.00, "USD")}</p>
            <p className="text-sm text-muted-foreground">Across all wallets</p>

            <div className="pt-4">
            <BarChartWithLabels/>
            </div>
            
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 h-[300px] relative">
          <CustomChart
            data={[]} 
            emptyState
            startLabel="12:00 a.m."
            endLabel="11:59 p.m."
          />
        </div>

        {/* Payouts */}
        {/* <div className="mt-6 flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Payouts</h3>
              <Button variant="link" className="text-primary h-auto p-0">View</Button>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(data?.payoutAmount || 0, "USD")}</p>
            <p className="text-sm text-muted-foreground">
              Deposited on {formatDate(data?.payoutDate || new Date("2023-08-03"))}
            </p>
          </div>
        </div> */}
      </CardContent>
      <div>
          <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% over the last month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
