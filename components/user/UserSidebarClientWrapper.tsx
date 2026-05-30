"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import UserSidebar from "./UserSidebar";

interface SidebarContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const UserSidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const ctx = useContext(UserSidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within UserSidebarClientWrapper");
  return ctx;
};

export default function UserSidebarClientWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((o) => !o);

  return (
    <UserSidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      <div className="flex min-h-screen w-full">
        {/* Mobile */}
        <div className="fixed z-50 lg:hidden">
          <UserSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </div>
        {/* Desktop */}
        <div className="hidden lg:block">
          <UserSidebar isOpen={true} onToggle={() => {}} />
        </div>
        {/* Content */}
        <div className="flex-1 w-full transition-all duration-300 lg:ml-72">
          {children}
        </div>
      </div>
    </UserSidebarContext.Provider>
  );
}
