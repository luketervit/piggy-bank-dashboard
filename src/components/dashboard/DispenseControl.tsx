// src/components/dashboard/DispenseControl.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ArrowDownCircle, Coins, Banknote } from "lucide-react";
import { dispenseExactAmount, dispenseSpecificDenomination, fetchBankValues } from "@/lib/apiService";

// Define available coin denominations
const availableDenominations = [
  { value: 1, label: "1p", color: "bg-zinc-400" },
  { value: 2, label: "2p", color: "bg-zinc-400" },
  { value: 5, label: "5p", color: "bg-zinc-400" },
  { value: 10, label: "10p", color: "bg-zinc-400" },
  { value: 20, label: "20p", color: "bg-zinc-400" },
  { value: 50, label: "50p", color: "bg-zinc-400" },
  { value: 100, label: "£1", color: "bg-yellow-500" },
  { value: 200, label: "£2", color: "bg-yellow-500" },
];

const DispenseControl = () => {
  // State for the exact amount tab
  const [amount, setAmount] = useState<string>("");
  const [dispensing, setDispensing] = useState(false);
  
  // State for the denomination tab
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(null);
  const [coinCount, setCoinCount] = useState<string>("1");
  const [dispensingDenomination, setDispensingDenomination] = useState(false);
  
  // Handle exact amount dispense
  const handleDispenseAmount = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setDispensing(true);
    try {
      // Convert pounds to pence for the API
      const penceAmount = Math.round(parseFloat(amount) * 100);
      await dispenseExactAmount(penceAmount);
      setAmount("");
    } finally {
      setDispensing(false);
    }
  };
  
  // Handle specific denomination dispense
  const handleDispenseDenomination = async () => {
    if (selectedDenomination === null || parseInt(coinCount) <= 0) return;
    
    setDispensingDenomination(true);
    try {
      await dispenseSpecificDenomination(selectedDenomination, parseInt(coinCount));
      setCoinCount("1");
    } finally {
      setDispensingDenomination(false);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Dispense Money</CardTitle>
        <ArrowDownCircle className="h-5 w-5 text-piggy-blue" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="amount">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="amount">Exact Amount</TabsTrigger>
            <TabsTrigger value="denomination">Specific Coins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="amount" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Enter amount to dispense (£)</p>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  onClick={handleDispenseAmount}
                  disabled={!amount || parseFloat(amount) <= 0 || dispensing}
                >
                  {dispensing ? "Dispensing..." : "Dispense"}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              The device will dispense the closest possible amount using available coins.
            </p>
          </TabsContent>
          
          <TabsContent value="denomination" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Select coin denomination</p>
              <div className="grid grid-cols-4 gap-2">
                {availableDenominations.map((denom) => (
                  <Button
                    key={denom.value}
                    variant={selectedDenomination === denom.value ? "default" : "outline"}
                    className={`h-12 ${selectedDenomination === denom.value ? "bg-piggy-purple text-white" : ""}`}
                    onClick={() => setSelectedDenomination(denom.value)}
                  >
                    {denom.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Number of coins</p>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    placeholder="1"
                    value={coinCount}
                    onChange={(e) => setCoinCount(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button 
                  onClick={handleDispenseDenomination}
                  disabled={
                    selectedDenomination === null || 
                    !coinCount || 
                    parseInt(coinCount) <= 0 || 
                    dispensingDenomination
                  }
                >
                  {dispensingDenomination ? "Dispensing..." : "Dispense"}
                </Button>
              </div>
            </div>
            
            {selectedDenomination !== null && (
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-sm">
                  Will dispense: {coinCount} × {selectedDenomination < 100 
                    ? `${selectedDenomination}p` 
                    : `£${selectedDenomination/100}`
                  }
                </p>
                <p className="text-sm font-medium">
                  Total: £{((selectedDenomination * parseInt(coinCount || "0")) / 100).toFixed(2)}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DispenseControl;