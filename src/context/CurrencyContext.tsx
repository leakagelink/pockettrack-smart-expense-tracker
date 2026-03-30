import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

interface CurrencyContextType {
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
  formatCurrency: (n: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = 'pockettrack_currency';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return currencies[0]; // Default INR
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currency));
  }, [currency]);

  const setCurrency = (c: CurrencyOption) => setCurrencyState(c);

  const formatCurrency = (n: number) =>
    `${currency.symbol}${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
