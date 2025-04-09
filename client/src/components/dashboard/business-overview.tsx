import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { formatCurrency, generateChartData } from "@/lib/utils";
import { 
  ChevronDown, 
  PlusIcon, 
  PencilIcon, 
  InfoIcon 
} from "lucide-react";
import CustomChart from "@/components/ui/custom-chart";

type TimePeriod = 'week' | 'month' | 'year';
type ComparisonType = 'previous' | 'same_previous_year';

export default function BusinessOverview() {
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [comparison, setComparison] = useState<ComparisonType>('previous');
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data, isLoading } = useQuery({
    queryKey: ["/api/summary/overview", { period, comparison, interval }],
  });

  // Generate some sample chart data for the demo
  const grossVolumeData = generateChartData(7, 500, 0.1);
  const netVolumeData = generateChartData(7, 450, 0.1);

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader className="px-6 py-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-7 w-48 mb-3 md:mb-0" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="px-6 py-5 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Your overview</CardTitle>
          
          <div className="mt-3 md:mt-0 flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Last 7 days</span>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">compared to</span>
                <Select 
                  defaultValue="previous" 
                  onValueChange={(val) => setComparison(val as ComparisonType)}
                >
                  <SelectTrigger className="ml-1 border-none shadow-none h-auto p-0 text-sm">
                    <SelectValue placeholder="Previous period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="previous">Previous period</SelectItem>
                    <SelectItem value="same_previous_year">Same period last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Select 
                defaultValue="daily"
                onValueChange={(val) => setInterval(val as 'daily' | 'weekly' | 'monthly')}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Daily" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <PlusIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payments */}
          <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium text-muted-foreground">Payments</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="my-4 text-center">
              <p className="text-sm text-muted-foreground text-center">
                No payments in selected time period. It can take up to 24 hours for this data to be updated.
              </p>
            </div>
            <Button variant="link" className="mt-4 text-primary">View more</Button>
          </div>
          
          {/* Gross volume */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Gross volume</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatCurrency(0)} previous period</p>
            </div>
            
            {/* Chart */}
            <div className="mt-4 h-32">
              <CustomChart
                data={grossVolumeData}
                timeFormat="MMM d"
                valueKey="value"
                dateKey="date"
                color="primary"
                emptyLine
                startLabel="Apr 3"
                endLabel="Today"
              />
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <Button variant="link" className="text-primary p-0 h-auto">View more</Button>
              <p className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</p>
            </div>
          </div>
          
          {/* Net volume */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Net volume from sales</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatCurrency(0)} previous period</p>
            </div>
            
            {/* Chart */}
            <div className="mt-4 h-32">
              <CustomChart
                data={netVolumeData}
                timeFormat="MMM d"
                valueKey="value"
                dateKey="date"
                color="primary"
                emptyLine
                startLabel="Apr 3"
                endLabel="Today"
              />
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <Button variant="link" className="text-primary p-0 h-auto">View more</Button>
              <p className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Failed payments */}
          <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-medium text-muted-foreground">Failed payments</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="my-4 text-center">
              <p className="text-sm text-muted-foreground text-center">
                No failed payments in selected time period. It can take up to 24 hours for this data to
              </p>
            </div>
          </div>
          
          {/* New customers */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">New customers</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">0</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">0 previous period</p>
            </div>
          </div>
          
          {/* Top customers */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Top customers by spend</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="absolute top-0 right-0">
              <Button variant="ghost" className="text-xs text-muted-foreground">All time</Button>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Nate</p>
                  <p className="text-xs text-muted-foreground">nate@nathanbraun.com</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(400)}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Button variant="link" className="text-primary p-0 h-auto">View more</Button>
              <p className="text-xs text-muted-foreground">Updated 3:00 p.m.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
