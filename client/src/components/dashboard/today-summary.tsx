import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import CustomChart from "@/components/ui/custom-chart";

export default function TodaySummary() {
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
        <CardTitle>Today</CardTitle>
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

          {/* CAD balance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">CAD balance</h3>
              <Button variant="link" className="text-primary h-auto p-0">View</Button>
            </div>
            <p className="text-2xl font-semibold">{formatCurrency(data?.walletBalance || 0.00, "CAD")}</p>
            <p className="text-sm text-muted-foreground">Estimated future payouts</p>
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
        <div className="mt-6 flex justify-between items-center">
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
        </div>
      </CardContent>
    </Card>
  );
}
