import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number, currency = "USD"): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatCryptoAmount(amount: string | number, symbol: string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  return `${numAmount.toLocaleString(undefined, { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 8 
  })} ${symbol}`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "h:mm a");
}

export function formatDistanceToNowStrict(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return "bg-secondary text-white";
    case "pending":
    case "processing":
      return "bg-amber-500 text-white";
    case "failed":
    case "error":
      return "bg-destructive text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "payment":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "refund":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "payout":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "withdrawal":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
}

export function truncateAddress(address: string, length = 6): string {
  if (!address) return '';
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
}

// For generating chart data in development
export function generateChartData(days = 7, baseline = 100, volatility = 0.2) {
  const result = [];
  let currentValue = baseline;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some random movement
    const change = currentValue * (Math.random() * volatility * 2 - volatility);
    currentValue += change;
    
    result.push({
      date: format(date, "MMM d"),
      value: Math.max(0, currentValue.toFixed(2)),
    });
  }
  
  return result;
}

export function getCryptoIcon(symbol: string): string {
  const icons: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDC: "usd-coin",
    USDT: "tether",
    SOL: "solana",
    ADA: "cardano",
    DOT: "polkadot",
    DOGE: "dogecoin",
    SHIB: "shiba-inu",
    AVAX: "avalanche",
    MATIC: "polygon",
    LTC: "litecoin",
    XRP: "ripple"
  };
  
  return icons[symbol] || "cryptocurrency";
}

export function camelCaseToRegular(str: string): string {
  let res = "";
  let indices = new Array();

  for (let i = 0; i < str.length; i++) {
    if (str[i].toUpperCase() === str[i]) {
      indices.push(i);
    }
  }

  if (indices.length == 0) {
    return capitalize(str);
  }

  let startIndex = 0;
  let endIndex = 0;
  for (let j = 0; j < indices.length; j++) {
    endIndex = indices[j];
    res = res.concat(" ", capitalize(str.substring(startIndex, endIndex)));
    startIndex = endIndex;
  }
  res = res.concat(" ", capitalize(str.substring(endIndex)))

  return res;

}

function capitalize(str: string): string {
  if (str.length <= 1) {
    return str;
  }
  return str[0].toUpperCase() + str.substring(1);
}