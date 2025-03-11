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
  lastUpdated: Date | null;
}>({
  coinData: {},
  gameHistory: [],
  mathGameSessions: [],
  balance: 0,
  isConnected: false,
  lastUpdated: null
});

// Inline ConnectionStatus component
const ConnectionStatus = () => {
  const { isConnected, lastUpdated } = useContext(DashboardContext);
  
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
      {lastUpdated && (
        <span className="text-xs text-muted-foreground ml-1">
          {`Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [coinData, setCoinData] = useState<CoinData>({});
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [mathGameSessions, setMathGameSessions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const updateIntervalRef = useRef<any>(null);
  const maxRetries = 5;

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
      
      if (coinDataChanged || coinValuesRemoved || Object.keys(coinData).length === 0) {
        setCoinData(newCoinData);
        const newBalance = calculateTotalBalance(newCoinData);
        setBalance(newBalance);
        hasChanges = true;
      }
      
      // Fetch game history
      const newGameHistory = await fetchGameHistory();
      
      // Check if game history changed
      if (JSON.stringify(newGameHistory) !== JSON.stringify(gameHistory)) {
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
      
      // Reset connection attempts on successful connection
      setConnectionAttempts(0);
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error updating data:", err);
      
      // Increment connection attempts
      setConnectionAttempts(prev => prev + 1);
      
      // If we've exceeded max retries, stop trying
      if (connectionAttempts >= maxRetries) {
        setIsConnected(false);
        
        // Clear the interval and set a longer one
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = setInterval(updateData, 10000); // Try again every 10 seconds
        }
      } else {
        setIsConnected(false);
      }
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
    isConnected,
    lastUpdated
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="container mx-auto p-4 pb-16">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Piggy Bank Plus Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isConnected 
              ? "Connected and continuously updating" 
              : connectionAttempts >= maxRetries
                ? "Connection to piggybank.local failed. Check if device is on the same network."
                : "Attempting to connect to piggybank.local..."}
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