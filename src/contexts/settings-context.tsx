'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>('$');

  useEffect(() => {
    const storedCurrency = localStorage.getItem('cardwise-currency');
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('cardwise-currency', newCurrency);
  };
  
  return (
    <SettingsContext.Provider value={{ currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
