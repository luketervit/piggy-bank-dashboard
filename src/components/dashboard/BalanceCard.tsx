
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, PiggyBank, PoundSterling } from "lucide-react";

type BalanceCardProps = {
  balance: number;
  savingsGoal?: number;
};

const BalanceCard = ({ balance, savingsGoal }: BalanceCardProps) => {
  // Calculate progress percentage if a savings goal exists
  const progress = savingsGoal ? (balance / savingsGoal) * 100 : 0;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Current Balance</CardTitle>
        <PiggyBank className="h-5 w-5 text-piggy-purple" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <PoundSterling className="h-5 w-5 text-piggy-green" />
          <span className="text-3xl font-bold">{balance.toFixed(2)}</span>
        </div>
        
        {savingsGoal && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Savings Goal</span>
              <span>£{savingsGoal.toFixed(2)}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-piggy-green h-full rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
