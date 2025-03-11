import { useState, useEffect } from "react";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { fetchBankValues } from "@/lib/apiService";

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  
  const checkConnection = async () => {
    setChecking(true);
    try {
      await fetchBankValues();
      setIsConnected(true);
    } catch (error) {
      console.error("Connection check failed:", error);
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
    
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-md z-50">
      {checking ? (
        <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
      ) : isConnected ? (
        <Wifi className="h-4 w-4 text-piggy-green" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      <span className="text-xs font-medium">
        {checking 
          ? "Checking connection..." 
          : isConnected 
            ? "Connected to Piggy Bank" 
            : "Disconnected"}
      </span>
      
      {!isConnected && !checking && (
        <button 
          onClick={checkConnection}
          className="text-xs font-medium text-blue-500 hover:text-blue-700 ml-1"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;