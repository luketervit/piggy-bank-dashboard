// src/lib/apiService.ts
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://piggybank.local"; // Using mDNS domain

export type CoinData = {
  [key: string]: number; // coinValue: count mapping
};

export type GameHistoryItem = {
  id: string;
  game: string;
  result: "win" | "loss";
  amount: number;
  date: string;
  timestamp?: string; // From WiFi API
  correct?: number; // For math games
  incorrect?: number; // For math games
  total?: number; // For math games
};

/**
 * Fetches the current coin values from the Piggy Bank device
 */
export const fetchBankValues = async (): Promise<CoinData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bankvalues`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bank values: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching bank values:", error);
    toast({
      title: "Connection Error",
      description: "Could not connect to Piggy Bank device. Please ensure it's powered on and connected to WiFi.",
      variant: "destructive",
    });
    throw error; // Re-throw to allow component to handle connection state
  }
};

/**
 * Fetches the game history from the Piggy Bank device
 */
export const fetchGameHistory = async (): Promise<GameHistoryItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gamehistory`);
    if (!response.ok) {
      throw new Error(`Failed to fetch game history: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Check if the response has a 'games' property (format from ESP32)
    if (data && data.games && Array.isArray(data.games)) {
      return data.games.map((item: any) => ({
        id: item.id || String(Math.random().toString(36).substr(2, 9)),
        game: item.game || "Math Game",
        result: item.result || "win",
        amount: item.amount || 0,
        date: item.timestamp || new Date().toLocaleDateString(),
        timestamp: item.timestamp,
        correct: item.correct,
        incorrect: item.incorrect
      }));
    }
    
    // Handle direct array format
    return Array.isArray(data) ? data.map(item => ({
      id: item.id || String(Math.random().toString(36).substr(2, 9)),
      game: item.game || "Math Game",
      result: item.result || "win",
      amount: item.amount || 0,
      date: item.timestamp || new Date().toLocaleDateString(),
      timestamp: item.timestamp,
      correct: item.correct,
      incorrect: item.incorrect
    })) : [];
  } catch (error) {
    console.error("Error fetching game history:", error);
    toast({
      title: "Connection Error",
      description: "Could not connect to Piggy Bank device. Please ensure it's powered on and connected to WiFi.",
      variant: "destructive",
    });
    throw error; // Re-throw to allow component to handle connection state
  }
};

/**
 * Requests the device to dispense a specific amount
 */
export const dispenseExactAmount = async (amount: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exactdispense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to dispense amount: ${response.statusText}`);
    }
    
    toast({
      title: "Success",
      description: `Dispensed £${(amount/100).toFixed(2)}`,
    });
    
    return true;
  } catch (error) {
    console.error("Error dispensing amount:", error);
    toast({
      title: "Dispense Error",
      description: "Could not dispense the requested amount. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Requests the device to dispense a specific denomination
 */
export const dispenseSpecificDenomination = async (denomination: number, count: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/denominationdispense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ denomination, count }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to dispense denomination: ${response.statusText}`);
    }
    
    toast({
      title: "Success",
      description: `Dispensed ${count} × ${denomination < 100 ? `${denomination}p` : `£${denomination/100}`}`,
    });
    
    return true;
  } catch (error) {
    console.error("Error dispensing denomination:", error);
    toast({
      title: "Dispense Error",
      description: "Could not dispense the requested coins. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Requests the device to dispense all coins
 */
export const emptyBank = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emptybank`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to empty bank: ${response.statusText}`);
    }
    
    toast({
      title: "Success",
      description: "All coins dispensed successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error emptying bank:", error);
    toast({
      title: "Error",
      description: "Could not empty the Piggy Bank. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Updates the lock status of the device
 */
export const updateLockStatus = async (locked: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locked }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update lock status: ${response.statusText}`);
    }
    
    toast({
      title: "Success",
      description: locked ? "Device locked successfully" : "Device unlocked successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating lock status:", error);
    toast({
      title: "Error",
      description: "Could not update device lock status. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};