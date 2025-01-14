import React, { createContext, useContext, useState } from "react";

type ProcessingContextType = {
  isProcessing: boolean;
  setProcessing: (value: boolean) => void;
};

const ProcessingContext = createContext<ProcessingContextType | undefined>(undefined);

export const ProcessingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const setProcessing = (value: boolean) => {
    setIsProcessing(value);
  };

  return <ProcessingContext.Provider value={{ isProcessing, setProcessing }}>{children}</ProcessingContext.Provider>;
};

export const useProcessing = (): ProcessingContextType => {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error("useProcessing must be used within a ProcessingProvider");
  }
  return context;
};
