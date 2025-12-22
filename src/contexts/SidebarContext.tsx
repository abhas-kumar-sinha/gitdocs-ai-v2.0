"use client"

import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

type SidebarProviderProps = {
  children: React.ReactNode;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextType => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return ctx;
};

export { SidebarContext };
