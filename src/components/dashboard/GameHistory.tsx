import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, GamepadIcon } from "lucide-react";
import { DashboardContext } from "./Dashboard";

const GameHistory = () => {
  // Get game history from dashboard context
  const { gameHistory } = useContext(DashboardContext);

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Game History</CardTitle>
        <GamepadIcon className="h-5 w-5 text-piggy-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {gameHistory.length === 0 ? (
            <div className="grid grid-cols-1 gap-3 py-2">
              {/* Empty state with placeholder items to maintain layout */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="bg-secondary/30 p-3 rounded-lg animate-pulse"
                  style={{ height: "60px" }}
                />
              ))}
            </div>
          ) : (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {gameHistory.map((item) => (
                <li key={item.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{item.game}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    item.result === "win" ? "text-piggy-green" : "text-destructive"
                  }`}>
                    <span className="font-semibold">
                      {item.result === "win" ? "+" : "-"}£{(item.amount / 100).toFixed(2)}
                    </span>
                    {item.result === "win" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameHistory;