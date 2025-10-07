import React, { createContext, useContext, useState, ReactNode } from "react";
import { Transaction } from "../types/transactions";

interface TransactionContextType {
  transaction: Transaction | null;
  setTransaction: (tx: Transaction | null) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  return (
    <TransactionContext.Provider value={{ transaction, setTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
