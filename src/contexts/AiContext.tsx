"use client"

import React, { createContext, useContext, useState } from "react";

type AiContextType = {
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
};

const AiContext = createContext<AiContextType | undefined>(
  undefined
);

type AiProviderProps = {
  children: React.ReactNode;
};

export const AiProvider: React.FC<AiProviderProps> = ({
  children,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  return (
    <AiContext.Provider value={{ isGenerating, setIsGenerating }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAiContext = (): AiContextType => {
  const ctx = useContext(AiContext);
  if (!ctx) {
    throw new Error("useAiContext must be used within a AiProvider");
  }
  return ctx;
};

export { AiContext };


