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
  AlertCircleIcon,
  Copy,
  ChevronRight,
  ChevronDown,
  MoreVertical
} from "lucide-react";
import { SiBitcoin, SiEthereum, SiSolana } from "react-icons/si";
import { FaChevronDown, FaDollarSign, FaEuroSign } from "react-icons/fa";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs";
import { wallets } from "@shared/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconRight } from "react-day-picker";
import { testWallets } from "./payment-links/new-payment-link";

// const coins = [
//   {
//     name: "WETH",
//     amount: 100.00
//   },
//   {
//     name: "USDC",
//     amount: 42.00
//   },
//   {
//     name: "USDT",
//     amount: 100.50
//   },
//   {
//     name: "EURC",
//     amount: 911.00
//   }
// ]

export type Wallet = {
  id: string,
  walletType: string, // EVM or SOL
  name: string,
  address: string,
  status: string // active or archived
  balances: Balance[]
}

type Balance = {
  token: Token,
  amount: number
  usdAmount: number
}

export type Token = {
  name: string // base ETH, USDC, etc
  ticker: string // WETH, USDC, etc
  chain: string // base, polygon, etc
}

interface WalletsData {
  // amount and currency of the wallet's total balance
  totalBalance: number,
  currency: string

  wallets: Wallet[]
}

const getCryptoIcon = (walletType: string) => {
  switch (walletType) {
    case 'EVM':
      return <SiEthereum className="text-lg" />;
    case 'SOL':
      return <SiSolana className="text-lg" />;

    case 'BTC':
      return <SiBitcoin className="text-lg" />;
    case 'USDC':
    case 'USDT':
      return <FaDollarSign className="text-blue-500 text-xl" />;
    case 'EURC':
      return <FaEuroSign className="text-blue-500 text-xl" />;
    default:
      return <span className="text-sm font-bold">{walletType}</span>;
  }
};

export default function Wallets() {
  // const { data: walletsData, isLoading } = useQuery<WalletsData>({
  //   queryKey: ["/api/wallets"],
  // });
  const walletsData: WalletsData = 
  {
    totalBalance: 999999999,
    currency: "USD",
    wallets: testWallets
  }
  const isLoading = false;
  const [createNewWalletOpen, setCreateNewWalletOpen] = useState(false);
  const [enteredWalletName, setEnteredWalletName] = useState<string>("");
  const [collapseArchivedWallets, setCollapseArchivedWallets] = useState(false);

  const [showPrivateKeyDialog, setShowPrivateKeyDialog] = useState(false);

  const walletsLength: number = 5;

  type ChainOptions = 'EVM' | 'SOL' | "";
  const [chainOption, setChainOption] = useState<ChainOptions>();

  return (
    <div>
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold leading-tight">Wallets</h1>

        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">

          {/* New Wallet Button */}
          <Dialog open={createNewWalletOpen} onOpenChange={(open) => {
            setCreateNewWalletOpen(open);
            if (!open) {
              setEnteredWalletName(""); // Clear input when dialog closes
              setChainOption("");       // (Optional) Clear chain selection too
            }
          }}>
            <DialogTrigger>
              <Button className="flex items-center" onClick={() => (setCreateNewWalletOpen(true))}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              {/* Header */}
              <DialogHeader>
                <DialogTitle>Create New Wallet</DialogTitle>
                <DialogDescription>
                  {chainOption === "EVM"
                    ? "This wallet will support any EVM blockchain (Ethereum Mainnet, Base, Polygon, Optimism, etc.)"
                    : chainOption === "SOL"
                      ? "This wallet will only support the Solana blockchain."
                      : "Enter a name and select a blockchain type for your new wallet."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name"
                    placeholder="My Wallet"
                    className="col-span-3"
                    value={enteredWalletName}
                    onChange={e => setEnteredWalletName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Type
                  </Label>
                  <Select
                    onValueChange={(val) => setChainOption(val as ChainOptions)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Wallet Type</SelectLabel>
                        <SelectItem value="EVM">EVM</SelectItem>
                        <SelectItem value="SOL">Solana</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="outline" onClick={() => {
                  setCreateNewWalletOpen(false);
                  setEnteredWalletName("");
                  setChainOption("");
                }}>
                  Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={() => {
                  if (chainOption === "") {
                    alert("Please select a wallet type.")
                  }
                  else if (enteredWalletName.trim().length < 3) {
                    alert("Please enter a unique wallet name at least three characters long.")
                  }
                  else {
                    setCreateNewWalletOpen(false);
                    setShowPrivateKeyDialog(true);
                    // setEnteredWalletName("");
                    // setChainOption("");
                  }

                }}>
                  Create
                </Button>


                {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}

              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showPrivateKeyDialog} onOpenChange={(open) => {
            setShowPrivateKeyDialog(open);
            if (!open) {
              // setEnteredWalletName(""); // Clear input when dialog closes
              // setChainOption("");       // (Optional) Clear chain selection too
            }
          }}>

            <DialogContent className="sm:max-w-md">
              {/* Header */}
              <DialogHeader>
                <DialogTitle>Wallet Private Key</DialogTitle>
                <DialogDescription>
                  {chainOption === "EVM"
                    ? "This wallet will support any EVM blockchain (Ethereum Mainnet, Base, Polygon, Optimism, etc.)"
                    : chainOption === "SOL"
                      ? "This wallet will only support the Solana blockchain."
                      : "Enter a name and select a blockchain type for your new wallet."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name"
                    placeholder="My Wallet"
                    className="col-span-3"
                    value={enteredWalletName}
                    onChange={e => setEnteredWalletName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Type
                  </Label>
                  <Select
                    onValueChange={(val) => setChainOption(val as ChainOptions)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Wallet Type</SelectLabel>
                        <SelectItem value="EVM">EVM</SelectItem>
                        <SelectItem value="SOL">Solana</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <DialogFooter className="sm:justify-start">
                <Button type="button" variant="outline" onClick={() => {
                  setCreateNewWalletOpen(false);
                  setEnteredWalletName("");
                  setChainOption("");
                }}>
                  Cancel
                </Button>

                <Button type="button" variant="secondary" onClick={() => {
                  if (chainOption === "") {
                    alert("Please select a wallet type.")
                  }
                  else if (enteredWalletName.trim().length < 3) {
                    alert("Please enter a unique wallet name at least three characters long.")
                  }
                  else {
                    setCreateNewWalletOpen(false);
                    setShowPrivateKeyDialog(true);
                    // setEnteredWalletName("");
                    // setChainOption("");
                  }

                }}>
                  Create
                </Button>


                {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}

              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                $999,999,999
                {/* {formatCurrency(walletsData?.totalBalance || 0, 'USD')} */}
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
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> */}
      <div className="gap-6 mb-8">
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
          <Carousel>
            <CarouselContent>
              {walletsData?.wallets.filter(w => w.status === "active").map((wallet: Wallet) => (
                <CarouselItem key={wallet.id} className={walletsLength === 1 ? "basis-full" : walletsLength === 2 ? "basis-1/2" : "basis-1/3"}>
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center">
                      <div className="flex-1"></div>
                      <CardTitle className="text-xl text-center flex-grow flex flex-row items-center justify-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-opacity-10 flex items-center justify-center">
                          {getCryptoIcon(wallet.walletType)}
                        </div>
                        <span>{wallet.name}</span>
                      </CardTitle>
                      <div className="flex-1 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger><BsThreeDotsVertical /></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                            <DropdownMenuItem>View more</DropdownMenuItem>
                            <DropdownMenuItem>Archive wallet</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Address */}
                      <div className="flex items-center text-sm text-muted-foreground justify-center pb-5">
                        <Button variant="link" size="icon" className="flex items-center h-6 w-max ml-1" onClick={() => navigator.clipboard.writeText(wallet.address)}>
                          <span className="truncate text-muted-foreground">{truncateAddress(wallet.address)}</span>
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex mt-4 mb-4 text-3xl font-semibold justify-center items-center">
                        <span>$420,000</span>
                      </div>

                      {wallet.balances.map((balance) => {
                        return (
                          <div key={`${balance.token.chain}-${balance.token.ticker}`}>
                            <div className="flex items-center justify-between space-x-4 pt-5 pb-5 pl-5 pr-5 border border-solid rounded-xl bg-slate-50">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-opacity-10 flex items-center justify-center">
                                  {getCryptoIcon(balance.token.ticker)}
                                </div>
                                <div>
                                  <p className="text-xl font-bold">{balance.token.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCryptoAmount(balance.amount, balance.token.ticker)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                {/* <p className={(coin.amount * (wallet.currency === 'BTC' ? 95000 : wallet.currency === 'ETH' ? 1790 : 1) >= 1000000 ? "text-lg " : "text-xl ") +
                                  "font-medium text-right"}>
                                  {formatCurrency(
                                    coin.amount *
                                    (wallet.currency === 'BTC' ? 95000 : wallet.currency === 'ETH' ? 1790 : 1),
                                    'USD'
                                  )}
                                </p> */}
                                <p className={`${balance.usdAmount >= 1000000 ? "text-lg" : "text-xl"} font-medium text-right`}>
                                  {formatCurrency(
                                    balance.usdAmount,
                                    'USD'
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="pt-2 pb-2"></div>
                          </div>
                        );
                      })}

                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowUpIcon className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 translate-x-0 drop-shadow-md" />
            <CarouselNext className="absolute right-0 translate-x-0 drop-shadow-md" />
          </Carousel>
        )}

        {/* Add New Wallet Card */}
        {/* <Card className="border-dashed">
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
        </Card> */}
      </div>

      {/* Recent Activities */}
      <Card className="gap-6 mb-8">
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
          ) : walletsData?.wallets.length as number > 0 ? (
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

          <div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Collapsible>
            <CollapsibleTrigger onClick={() => setCollapseArchivedWallets(!collapseArchivedWallets)}>
              <CardTitle>
                <div className="flex gap-x-6 items-center">
                  <span>Archived Wallets</span>
                  {!collapseArchivedWallets ? <ChevronRight /> : <ChevronDown />}
                </div>

              </CardTitle>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {walletsData?.wallets.filter(w => w.status === "archived").map(w => {
                  return (
                    <div className="my-4 flex gap-x-10 items-center">
                      <div className="flex items-center gap-x-3">
                        {getCryptoIcon(w.walletType)}
                        <span>{w.name}</span>
                      </div>
                      <span className="truncate text-muted-foreground">{truncateAddress(w.address)}</span>
                      <DropdownMenu>
                          <DropdownMenuTrigger><BsThreeDotsVertical /></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                            <DropdownMenuItem>View more</DropdownMenuItem>
                            <DropdownMenuItem>Unarchive wallet</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                  )
                })}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>

        </CardHeader>
      </Card>

    </div>
  );
}
