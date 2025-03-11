
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, GamepadIcon } from "lucide-react";

type GameResult = {
  id: string;
  game: string;
  result: "win" | "loss";
  amount: number;
  date: string;
};

type GameHistoryProps = {
  history: GameResult[];
};

const GameHistory = ({ history }: GameHistoryProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Game History</CardTitle>
        <GamepadIcon className="h-5 w-5 text-piggy-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No games played yet</p>
          ) : (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {history.map((item) => (
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
