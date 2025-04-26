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
  InfoIcon 
} from "lucide-react";
import CustomChart from "@/components/ui/custom-chart";

type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'all';
// type ComparisonType = 'previous' | 'same_previous_year';

export default function BusinessOverview() {
  const [period, setPeriod] = useState<TimePeriod>('week');
  // const [comparison, setComparison] = useState<ComparisonType>('previous');
  // const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data, isLoading } = useQuery({
    queryKey: ["/api/summary/overview"],
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
          <CardTitle>Your Overview</CardTitle>
          <div className="mt-3 md:mt-0">
            <Select
              defaultValue="week"
              onValueChange={(val) => setPeriod(val as TimePeriod)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last day</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="year">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-muted-foreground">Payments</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="border border-dashed border-border rounded-lg p-6">  
              
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-sm text-muted-foreground text-center max-w-[250px]">
                  No payments in selected time period. It can take up to 24 hours for this data to be updated.
                </p>
                <Button variant="link" className="mt-4 text-primary">View more</Button>
              </div>
            </div>
          </div>
          
          {/* Gross volume */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-muted-foreground">Gross volume</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatCurrency(0)} previous {period}</p>
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-muted-foreground">Net volume from sales</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatCurrency(0)} previous {period}</p>
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
                startLabel="Apr 19"
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
          <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-semibold text-muted-foreground">Failed payments</h3>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="border border-dashed border-border rounded-lg p-6">
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-sm text-muted-foreground text-center max-w-[250px]">
                  No failed payments in selected time period. It can take up to 24 hours for this data to be updated.
                </p>
              </div>
            </div>
          </div>
          {/* New customers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-muted-foreground">New customers</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-semibold">0</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                  0.0%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">0 previous {period}</p>
            </div>
            
            {/* Chart */}
            <div className="mt-4 h-32">
              <CustomChart
                data={generateChartData(7, 0, 0)}
                timeFormat="MMM d"
                valueKey="value"
                dateKey="date"
                color="primary"
                emptyLine
                startLabel="Apr 19"
                endLabel="Today"
              />
            </div>
            <div className="mt-2 flex justify-between items-center">
              <Button variant="link" className="text-primary p-0 h-auto">View more</Button>
              <p className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</p>
            </div>
          </div>
          
          {/* Top customers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-muted-foreground">Top customers by spend</h3>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            {/* <div className="absolute top-0 right-0">
              <Button variant="ghost" className="text-xs text-muted-foreground">All time</Button>
            </div> */}
            
            <div className="mt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Walter</p>
                  <p className="text-xs text-muted-foreground">walterwhite@heisenberg.com</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(911)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Saul</p>
                  <p className="text-xs text-muted-foreground">saul@sgassociates.com</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(420)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Jesse</p>
                  <p className="text-xs text-muted-foreground">jesse@yeab!tch.com</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(69)}</p>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <Button variant="link" className="text-primary p-0 h-auto">View more</Button>
              <p className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}