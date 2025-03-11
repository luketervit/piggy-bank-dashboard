import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, PiggyBank } from "lucide-react";
import { DashboardContext } from "./Dashboard";

// Define coin types and their display properties
const coinTypes = [
  { value: 1, name: "1p", color: "bg-zinc-400" },
  { value: 2, name: "2p", color: "bg-zinc-400" },
  { value: 5, name: "5p", color: "bg-zinc-400" },
  { value: 10, name: "10p", color: "bg-zinc-400" },
  { value: 20, name: "20p", color: "bg-zinc-400" },
  { value: 50, name: "50p", color: "bg-zinc-400" },
  { value: 100, name: "£1", color: "bg-yellow-500" },
  { value: 200, name: "£2", color: "bg-yellow-500" },
];

const BankStatus = () => {
  // Get data from dashboard context
  const { coinData, balance } = useContext(DashboardContext);

  // Format coins for display
  const formatCoinsForBreakdown = () => {
    return coinTypes.map((type) => ({
      value: type.value,
      name: type.name,
      count: coinData[type.value.toString()] || 0,
      color: type.color,
    })).filter(coin => coin.count > 0);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Bank Status</CardTitle>
        <PiggyBank className="h-5 w-5 text-piggy-purple" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Balance</p>
                <p className="text-2xl font-bold">£{(balance / 100).toFixed(2)}</p>
              </div>
              <Coins className="h-10 w-10 text-piggy-yellow opacity-70" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">Coin Breakdown</p>
              <p className="text-sm text-muted-foreground">{formatCoinsForBreakdown().length} coin types</p>
            </div>
            <ul className="space-y-2">
              {formatCoinsForBreakdown().length > 0 ? (
                formatCoinsForBreakdown().map((coin) => (
                  <li key={coin.name} className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${coin.color}`}
                      >
                        {coin.value < 100 ? "p" : "£"}
                      </div>
                      <span>{coin.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{coin.count}</span>
                      <span className="text-sm text-muted-foreground">
                        (£{((coin.value * coin.count) / 100).toFixed(2)})
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                coinTypes.map((coin) => (
                  <li key={coin.name} className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${coin.color}`}
                      >
                        {coin.value < 100 ? "p" : "£"}
                      </div>
                      <span>{coin.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">0</span>
                      <span className="text-sm text-muted-foreground">(£0.00)</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatus;