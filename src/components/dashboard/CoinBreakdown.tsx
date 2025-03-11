
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

type Coin = {
  value: number;
  count: number;
  name: string;
  color: string;
};

type CoinBreakdownProps = {
  coins: Coin[];
};

const CoinBreakdown = ({ coins }: CoinBreakdownProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Coin Breakdown</CardTitle>
        <Coins className="h-5 w-5 text-piggy-yellow" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {coins.map((coin) => (
            <li key={coin.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${coin.color}`}
                >
                  {coin.value < 1 ? "p" : "£"}
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
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CoinBreakdown;
