import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { DashboardContext } from "./Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Game types
const GAME_TYPES = {
  COIN_COMBINATIONS: "Coin Combinations",
  ADD_THEM_UP: "Add Them Up"
};

// Difficulty levels
const DIFFICULTY_LEVELS = ["Very Easy", "Easy", "Medium", "Hard"];

const MathGameAnalysis = () => {
  // State for selected game type
  const [selectedGameType, setSelectedGameType] = useState<string>(GAME_TYPES.COIN_COMBINATIONS);
  
  // Get data from dashboard context
  const { mathGameSessions, gameHistory } = useContext(DashboardContext);
  
  // Process game data to extract game type and difficulty level
  const processGameData = () => {
    // Filter for the selected game type
    const filteredGames = gameHistory.filter(item => 
      item.game?.toLowerCase().includes(selectedGameType.toLowerCase()) &&
      typeof item.correct === "number" && 
      typeof item.incorrect === "number"
    );

    // Initialize data structure for each difficulty level
    const difficultyStats = DIFFICULTY_LEVELS.map(level => ({
      name: level,
      correct: 0,
      incorrect: 0
    }));

    // Aggregate results by difficulty level
    filteredGames.forEach(game => {
      const difficultyText = game.game?.split(" ").pop()?.toLowerCase() || "";
      let difficultyIndex = -1;
      
      if (difficultyText.includes("very easy")) {
        difficultyIndex = 0;
      } else if (difficultyText.includes("easy")) {
        difficultyIndex = 1;
      } else if (difficultyText.includes("medium")) {
        difficultyIndex = 2;
      } else if (difficultyText.includes("hard")) {
        difficultyIndex = 3;
      }
      
      if (difficultyIndex >= 0) {
        difficultyStats[difficultyIndex].correct += game.correct || 0;
        difficultyStats[difficultyIndex].incorrect += game.incorrect || 0;
      }
    });

    return difficultyStats;
  };

  const chartData = processGameData();
  
  // Calculate totals for the selected game type
  const totalGames = chartData.reduce((sum, level) => sum + level.correct + level.incorrect, 0);
  const totalCorrect = chartData.reduce((sum, level) => sum + level.correct, 0);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-emerald-500">{`Correct: ${payload[0].value}`}</p>
          <p className="text-rose-500">{`Incorrect: ${payload[1].value}`}</p>
          <p className="text-gray-500">{`Total: ${payload[0].value + payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Math Game Analysis</CardTitle>
        <Brain className="h-5 w-5 text-piggy-blue" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={GAME_TYPES.COIN_COMBINATIONS} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value={GAME_TYPES.COIN_COMBINATIONS}
              onClick={() => setSelectedGameType(GAME_TYPES.COIN_COMBINATIONS)}
            >
              Coin Combinations
            </TabsTrigger>
            <TabsTrigger 
              value={GAME_TYPES.ADD_THEM_UP}
              onClick={() => setSelectedGameType(GAME_TYPES.ADD_THEM_UP)}
            >
              Add Them Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value={GAME_TYPES.COIN_COMBINATIONS}>
            <div className="text-sm text-muted-foreground mb-4">
              Performance in the game where you are given an amount to add up to.
            </div>
          </TabsContent>
          <TabsContent value={GAME_TYPES.ADD_THEM_UP}>
            <div className="text-sm text-muted-foreground mb-4">
              Performance in the game where you add coins and submit the total amount.
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-piggy-blue/10 to-piggy-blue/20 p-3 rounded-lg text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>
            <div className="bg-gradient-to-br from-piggy-green/10 to-piggy-green/20 p-3 rounded-lg text-center shadow-sm">
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-2xl font-bold">{totalCorrect}</p>
              <p className="text-xs text-muted-foreground">
                {totalGames > 0 ? `(${Math.round((totalCorrect / totalGames) * 100)}%)` : '(0%)'}
              </p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="correct" 
                  name="Correct Answers"
                  fill="#10b981" 
                  stackId="a"
                />
                <Bar 
                  dataKey="incorrect" 
                  name="Incorrect Answers"
                  fill="#ef4444" 
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MathGameAnalysis;