import { useState, useEffect, useRef, createContext, useContext } from "react";
import BalanceCard from "./BalanceCard";
import DeviceControl from "./DeviceControl";
import GameHistory from "./GameHistory";
import MathGameAnalysis from "./MathGameAnalysis";
import BankStatus from "./BankStatus";
import DispenseControl from "./DispenseControl";
import { Wifi, WifiOff } from "lucide-react";
import { fetchBankValues, fetchGameHistory, CoinData, GameHistoryItem } from "@/lib/apiService";

// Create a context for the API data
export const DashboardContext = createContext<{
  coinData: CoinData;
  gameHistory: GameHistoryItem[];
  mathGameSessions: any[];
  balance: number;
  isConnected: boolean;
}>({
  coinData: {},
  gameHistory: [],
  mathGameSessions: [],
  balance: 0,
  isConnected: false
});

// Inline ConnectionStatus component
const ConnectionStatus = () => {
  const { isConnected } = useContext(DashboardContext);
  
  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-md z-50">
      {isConnected ? (
        <Wifi className="h-4 w-4 text-piggy-green" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      <span className="text-xs font-medium">
        {isConnected 
          ? "Connected to Piggy Bank" 
          : "Disconnected"}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const [coinData, setCoinData] = useState<CoinData>({});
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [mathGameSessions, setMathGameSessions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const updateIntervalRef = useRef<any>(null);

  // Calculate total balance from coin data
  const calculateTotalBalance = (data: CoinData) => {
    return Object.entries(data).reduce((total, [value, count]) => {
      return total + (parseInt(value) * count);
    }, 0);
  };

  // Function to update data incrementally
  const updateData = async () => {
    try {
      // Fetch coin data
      const newCoinData = await fetchBankValues();
      
      // Compare with existing data and update only if changed
      let hasChanges = false;
      
      // Check if any coin values changed
      const coinDataChanged = Object.entries(newCoinData).some(
        ([value, count]) => coinData[value] !== count
      );
      
      // Check if any coin values were removed
      const coinValuesRemoved = Object.keys(coinData).some(
        value => newCoinData[value] === undefined
      );
      
      if (coinDataChanged || coinValuesRemoved) {
        setCoinData(newCoinData);
        const newBalance = calculateTotalBalance(newCoinData);
        setBalance(newBalance);
        hasChanges = true;
      }
      
      // Fetch game history
      const newGameHistory = await fetchGameHistory();
      
      // Check if game history changed (new items or more items)
      if (newGameHistory.length !== gameHistory.length) {
        setGameHistory(newGameHistory);
        hasChanges = true;
        
        // Extract math game sessions from history
        const mathSessions = newGameHistory
          .filter(item => 
            item.game?.toLowerCase().includes("math") && 
            typeof item.correct === "number" && 
            typeof item.incorrect === "number"
          )
          .map(item => ({
            id: item.id,
            date: item.date || new Date().toLocaleDateString(),
            correct: item.correct || 0,
            incorrect: item.incorrect || 0,
            total: (item.correct || 0) + (item.incorrect || 0)
          }));
        
        // Only update if there are changes to avoid unnecessary re-renders
        if (JSON.stringify(mathSessions) !== JSON.stringify(mathGameSessions)) {
          setMathGameSessions(mathSessions);
        }
      }
      
      setIsConnected(true);
    } catch (err) {
      console.error("Error updating data:", err);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Initial data load
    updateData();
    
    // Set up an interval for automatic updates
    updateIntervalRef.current = setInterval(updateData, 2000); // Update every 2 seconds
    
    // Clean up on unmount
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Context value to provide to all components
  const contextValue = {
    coinData,
    gameHistory,
    mathGameSessions,
    balance,
    isConnected
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="container mx-auto p-4 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Piggy Bank Plus Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isConnected 
              ? "Connected and continuously updating" 
              : "Attempting to connect to device..."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            <BalanceCard balance={balance / 100} savingsGoal={50} />
            <BankStatus />
          </div>
          
          {/* Second Column */}
          <div className="space-y-6">
            <DispenseControl />
            <MathGameAnalysis />
          </div>
          
          {/* Third Column */}
          <div className="space-y-6">
            <DeviceControl initialLocked={false} />
            <GameHistory />
          </div>
        </div>
        
        {/* Connection Status Indicator */}
        <ConnectionStatus />
      </div>
    </DashboardContext.Provider>
  );
};

export default Dashboard;