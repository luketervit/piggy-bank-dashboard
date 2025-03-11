
import { useState } from "react";
import BalanceCard from "../dashboard/BalanceCard";
import CoinBreakdown from "../dashboard/CoinBreakdown";
import MathGameAnalysis from "../dashboard/MathGameAnalysis";
import DeviceControl from "../dashboard/DeviceControl";

// Sample data for our application
const SAMPLE_COIN_DATA = [
  { value: 1, count: 25, name: "1 penny", color: "bg-yellow-600" },
  { value: 2, count: 15, name: "2 pence", color: "bg-yellow-600" },
  { value: 5, count: 10, name: "5 pence", color: "bg-zinc-400" },
  { value: 10, count: 8, name: "10 pence", color: "bg-zinc-400" },
  { value: 20, count: 5, name: "20 pence", color: "bg-zinc-400" },
  { value: 50, count: 3, name: "50 pence", color: "bg-zinc-400" },
  { value: 100, count: 2, name: "£1", color: "bg-yellow-500" },
  { value: 200, count: 1, name: "£2", color: "bg-zinc-700" },
];

// Enhanced sample data for math game sessions with a pattern of improvement
const SAMPLE_GAME_SESSIONS = [
  { id: "1", date: "Jul 10", correct: 5, incorrect: 5, total: 10 },
  { id: "2", date: "Jul 11", correct: 6, incorrect: 4, total: 10 },
  { id: "3", date: "Jul 12", correct: 4, incorrect: 6, total: 10 },
  { id: "4", date: "Jul 13", correct: 7, incorrect: 3, total: 10 },
  { id: "5", date: "Jul 14", correct: 8, incorrect: 2, total: 10 },
  { id: "6", date: "Jul 15", correct: 7, incorrect: 3, total: 10 },
  { id: "7", date: "Jul 16", correct: 9, incorrect: 1, total: 10 },
  { id: "8", date: "Jul 17", correct: 10, incorrect: 0, total: 10 },
];

// Calculate total balance from coins
const calculateBalance = (coins: typeof SAMPLE_COIN_DATA) => {
  return coins.reduce((total, coin) => total + (coin.value * coin.count) / 100, 0);
};

const Dashboard = () => {
  const [coinData, setCoinData] = useState(SAMPLE_COIN_DATA);
  const [gameSessions, setGameSessions] = useState(SAMPLE_GAME_SESSIONS);
  const balance = calculateBalance(coinData);
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Child's Dashboard</h1>
        <p className="text-muted-foreground">Monitor your child's savings and activities</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <BalanceCard balance={balance} savingsGoal={25} />
        </div>
        <div className="lg:col-span-2">
          <CoinBreakdown coins={coinData} />
        </div>
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <MathGameAnalysis sessions={gameSessions} />
        <DeviceControl initialLocked={true} />
      </div>
    </div>
  );
};

export default Dashboard;
