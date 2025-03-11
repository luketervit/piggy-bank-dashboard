
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
        
      </div>
    </header>
  );
};

export default Header;
