import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type DeviceControlProps = {
  initialLocked: boolean;
};

const DeviceControl = ({ initialLocked }: DeviceControlProps) => {
  const [isLocked, setIsLocked] = useState(initialLocked);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [devicePin, setDevicePin] = useState(localStorage.getItem("devicePin") || "");
  const { toast } = useToast();

  useEffect(() => {
    const storedLockState = localStorage.getItem("deviceLocked");
    if (storedLockState) {
      setIsLocked(storedLockState === "true");
    }
  }, []);

  const handleToggleLock = () => {
    if (!devicePin && !isLocked) {
      setIsSettingPin(true);
      toast({
        title: "PIN Required",
        description: "Please set a PIN before locking the device",
      });
      return;
    }
    
    const newLockState = !isLocked;
    
    setIsLocked(newLockState);
    localStorage.setItem("deviceLocked", newLockState.toString());
    
    toast({
      title: newLockState ? "Device Locked" : "Device Unlocked",
      description: newLockState 
        ? "The Piggy Bank Plus is now locked" 
        : "The Piggy Bank Plus is now accessible",
    });
  };

  const handlePinSetup = () => {
    if (pin.length < 4) {
      toast({
        title: "PIN too short",
        description: "Please use at least 4 digits for your PIN",
        variant: "destructive",
      });
      return;
    }
    
    if (pin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "Please ensure both PINs match",
        variant: "destructive",
      });
      return;
    }
    
    setDevicePin(pin);
    localStorage.setItem("devicePin", pin);
    setIsSettingPin(false);
    setPin("");
    setConfirmPin("");
    
    toast({
      title: "PIN Setup Complete",
      description: "You can now lock and unlock your Piggy Bank Plus",
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Device Control</CardTitle>
        {isLocked ? (
          <Lock className="h-5 w-5 text-piggy-purple" />
        ) : (
          <Unlock className="h-5 w-5 text-piggy-green" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isSettingPin ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium">Set Device PIN</label>
                <Input
                  id="pin"
                  type="password" 
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center tracking-widest"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPin" className="text-sm font-medium">Confirm PIN</label>
                <Input
                  id="confirmPin"
                  type="password" 
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="text-center tracking-widest"
                />
              </div>
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSettingPin(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePinSetup} 
                  className="w-full"
                >
                  Save PIN
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Piggy Bank Plus</p>
                    <p className="text-sm text-muted-foreground">
                      {isLocked ? "Locked" : "Unlocked"}
                    </p>
                  </div>
                  <Button 
                    onClick={handleToggleLock}
                    variant={isLocked ? "outline" : "default"}
                    className={`${isLocked ? "border-piggy-purple text-piggy-purple hover:bg-piggy-purple/10" : "bg-piggy-green hover:bg-piggy-green/90"}`}
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Lock
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {devicePin ? (
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsSettingPin(true)}
                    className="text-muted-foreground"
                  >
                    <Key className="mr-1 h-3 w-3" />
                    Change PIN
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsSettingPin(true)}
                    className="border-piggy-purple text-piggy-purple hover:bg-piggy-purple/10"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Set Device PIN
                  </Button>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {isLocked 
                  ? "When locked, money can be deposited but not withdrawn from the device."
                  : "When unlocked, children can both deposit and withdraw money from the device."}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceControl;
