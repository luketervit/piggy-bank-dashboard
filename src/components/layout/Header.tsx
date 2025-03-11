
import { Button } from "@/components/ui/button";
import { PiggyBank, LogOut } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  onLogout: () => void;
};

const Header = ({ onLogout }: HeaderProps) => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-6 w-6 text-piggy-purple" />
          <span className="text-xl font-bold">Piggy Bank Plus</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLogout}
          className="text-muted-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
