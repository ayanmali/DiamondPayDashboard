import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { FaDollarSign } from "react-icons/fa";

interface CryptoCurrencyProps {
  name: string;
  symbol: string;
  icon: React.ReactNode;
  color: string;
}

const CryptoCurrency = ({ name, symbol, icon, color }: CryptoCurrencyProps) => {
  return (
    <div className="flex items-center p-4 rounded-lg border border-border">
      <div className={`flex-shrink-0 h-10 w-10 rounded-full ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-muted-foreground">{symbol}</p>
      </div>
    </div>
  );
};

export default function SupportedCryptocurrencies() {
  const currencies = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      icon: <SiBitcoin className="text-yellow-500" />,
      color: "bg-yellow-500 bg-opacity-10"
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      icon: <SiEthereum className="text-indigo-500" />,
      color: "bg-indigo-500 bg-opacity-10"
    },
    {
      name: "Solana",
      symbol: "SOL",
      icon: <span className="text-sm font-bold text-purple-500">SOL</span>,
      color: "bg-purple-500 bg-opacity-10"
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      icon: <FaDollarSign className="text-blue-500" />,
      color: "bg-blue-500 bg-opacity-10"
    }
  ];

  return (
    <Card>
      <CardHeader className="px-6 py-5 border-b">
        <CardTitle>Supported Cryptocurrencies</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currencies.map((currency) => (
            <CryptoCurrency
              key={currency.symbol}
              name={currency.name}
              symbol={currency.symbol}
              icon={currency.icon}
              color={currency.color}
            />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="text-sm">
            View all supported currencies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
