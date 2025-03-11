
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/layout/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to authenticated
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-piggy-background via-white to-piggy-purple/5 flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-grow">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
