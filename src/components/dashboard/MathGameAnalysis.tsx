
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, TrendingUp } from "lucide-react";
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useState, useEffect } from "react";

type GameSession = {
  id: string;
  date: string;
  correct: number;
  incorrect: number;
  total: number;
};

type MathGameAnalysisProps = {
  sessions: GameSession[];
};

const MathGameAnalysis = ({ sessions }: MathGameAnalysisProps) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [improvementRate, setImprovementRate] = useState<number | null>(null);
  
  // Calculate stats
  const totalGames = sessions.reduce((sum, session) => sum + session.total, 0);
  const totalCorrect = sessions.reduce((sum, session) => sum + session.correct, 0);
  const accuracy = totalGames > 0 ? Math.round((totalCorrect / totalGames) * 100) : 0;
  
  // Calculate improvement trend
  useEffect(() => {
    if (sessions.length >= 2) {
      const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
      const secondHalf = sessions.slice(Math.floor(sessions.length / 2));
      
      const firstHalfAccuracy = firstHalf.reduce((sum, session) => sum + session.correct, 0) / 
                               firstHalf.reduce((sum, session) => sum + session.total, 0) * 100;
      
      const secondHalfAccuracy = secondHalf.reduce((sum, session) => sum + session.correct, 0) / 
                                secondHalf.reduce((sum, session) => sum + session.total, 0) * 100;
      
      const improvement = secondHalfAccuracy - firstHalfAccuracy;
      setImprovementRate(Math.round(improvement));
      
      // Trigger celebration if there's significant improvement
      if (improvement > 10) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [sessions]);
  
  // Prepare data for chart
  const chartData = sessions.map(session => ({
    name: session.date,
    correct: session.correct,
    incorrect: session.incorrect,
    accuracy: Math.round((session.correct / session.total) * 100),
  }));

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-emerald-500">{`Correct: ${payload[0].value}`}</p>
          <p className="text-rose-500">{`Incorrect: ${payload[1].value}`}</p>
          <p className="text-blue-500">{`Accuracy: ${payload[2].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-500/20 z-10 pointer-events-none flex items-center justify-center">
          <div className="animate-bounce-slow">
            <Trophy className="h-16 w-16 text-yellow-500 drop-shadow-lg" />
          </div>
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Math Game Analysis</CardTitle>
        <Brain className="h-5 w-5 text-piggy-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-piggy-blue/10 to-piggy-blue/20 p-3 rounded-lg text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>
            <div className="bg-gradient-to-br from-piggy-green/10 to-piggy-green/20 p-3 rounded-lg text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-2xl font-bold">{totalCorrect}</p>
            </div>
            <div className="bg-gradient-to-br from-piggy-purple/10 to-piggy-purple/20 p-3 rounded-lg text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          
          {improvementRate !== null && (
            <div className="mb-4 p-2 bg-gradient-to-r from-transparent via-gray-100 to-transparent rounded-md">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className={`h-5 w-5 ${improvementRate > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <p className="text-sm font-medium">
                  {improvementRate > 0 
                    ? `Improving by ${improvementRate}% compared to earlier games!` 
                    : `Accuracy has changed by ${improvementRate}% compared to earlier games`}
                </p>
              </div>
            </div>
          )}
          
          {sessions.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncorrect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="correct" 
                    name="Correct Answers"
                    stroke="#10b981" 
                    fill="url(#colorCorrect)"
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="incorrect" 
                    name="Incorrect Answers"
                    stroke="#ef4444" 
                    fill="url(#colorIncorrect)"
                    strokeWidth={2} 
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="accuracy" 
                    name="Accuracy (%)"
                    stroke="#3b82f6" 
                    fill="url(#colorAccuracy)"
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No game data available yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MathGameAnalysis;
