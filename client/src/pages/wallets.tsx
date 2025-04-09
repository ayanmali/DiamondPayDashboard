import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCryptoAmount, truncateAddress } from "@/lib/utils";
import { 
  PlusIcon, 
  CopyIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  BarChart4Icon,
  AlertCircleIcon
} from "lucide-react";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { FaDollarSign } from "react-icons/fa";

const getCryptoIcon = (symbol: string) => {
  switch(symbol) {
    case 'BTC': 
      return <SiBitcoin className="text-yellow-500 text-xl" />;
    case 'ETH': 
      return <SiEthereum className="text-indigo-500 text-xl" />;
    case 'USDC': 
      return <FaDollarSign className="text-blue-500 text-xl" />;
    default:
      return <span className="text-sm font-bold">{symbol}</span>;
  }
};

export default function Wallets() {
  const { data: walletsData, isLoading } = useQuery({
    queryKey: ["/api/wallets"],
  });

  return (
    <div>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Wallets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your cryptocurrency wallets and balances
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button className="flex items-center">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Wallet
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
          <CardDescription>
            Combined value of all your wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <div className="flex items-end space-x-4">
              <h1 className="text-4xl font-bold">
                {formatCurrency(walletsData?.totalBalance || 0, 'USD')}
              </h1>
              <div className="flex items-center text-sm font-medium text-secondary">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span>2.5% (24h)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : (
          walletsData?.wallets.map((wallet: any) => (
            <Card key={wallet.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{wallet.currency} Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                    {getCryptoIcon(wallet.currency)}
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {formatCryptoAmount(wallet.balance, wallet.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(
                        parseFloat(wallet.balance) * 
                        (wallet.currency === 'BTC' ? 25940 : 
                         wallet.currency === 'ETH' ? 1790 : 1), 
                        'USD'
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <span className="font-medium mr-2">Address:</span>
                  <span className="truncate">{truncateAddress(wallet.address)}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="w-[48%]">
                  <ArrowUpIcon className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" size="sm" className="w-[48%]">
                  <ArrowDownIcon className="h-4 w-4 mr-2" />
                  Receive
                </Button>
              </CardFooter>
            </Card>
          ))
        )}

        {/* Add New Wallet Card */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Add New Wallet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Connect or create a new cryptocurrency wallet
            </p>
            <Button>Add Wallet</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest transactions for your wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))
          ) : walletsData?.wallets.length > 0 ? (
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center">
                    <ArrowDownIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Received BTC</p>
                    <p className="text-xs text-muted-foreground">Aug 3, 2023 • From: Nate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">+0.0148 BTC</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(383.89, 'USD')}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center">
                    <ArrowUpIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sent ETH</p>
                    <p className="text-xs text-muted-foreground">Jul 28, 2023 • To: Exchange</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-500">-0.15 ETH</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(268.50, 'USD')}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500 bg-opacity-10 flex items-center justify-center">
                    <BarChart4Icon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Swap BTC → ETH</p>
                    <p className="text-xs text-muted-foreground">Jul 15, 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">0.005 BTC → 0.075 ETH</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(134.25, 'USD')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircleIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Activities Yet</h3>
              <p className="text-sm text-muted-foreground">
                Your wallet activities will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
