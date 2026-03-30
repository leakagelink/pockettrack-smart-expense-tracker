import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, Category, TransactionType } from '@/types/transaction';
import { defaultCategories } from '@/data/categories';

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  clearAllData: () => void;
  getCategory: (id: string) => Category | undefined;
  totalBalance: number;
  todaySpending: number;
  weekSpending: number;
  monthSpending: number;
  monthIncome: number;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

const STORAGE_KEY = 'pockettrack_transactions';
const CATEGORIES_KEY = 'pockettrack_categories';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage(STORAGE_KEY, []));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage(CATEGORIES_KEY, defaultCategories));

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); }, [categories]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const updateTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => prev.map(tr => tr.id === t.id ? t : tr));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tr => tr.id !== id));
  }, []);

  const addCategory = useCallback((c: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...c, id: crypto.randomUUID() }]);
  }, []);

  const getCategory = useCallback((id: string) => categories.find(c => c.id === id), [categories]);

  const clearAllData = useCallback(() => {
    setTransactions([]);
    setCategories(defaultCategories);
  }, []);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const totalBalance = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  const todaySpending = transactions.filter(t => t.type === 'expense' && t.date.slice(0, 10) === todayStr).reduce((s, t) => s + t.amount, 0);
  const weekSpending = transactions.filter(t => t.type === 'expense' && t.date >= weekAgo).reduce((s, t) => s + t.amount, 0);
  const monthSpending = transactions.filter(t => t.type === 'expense' && t.date >= monthStart).reduce((s, t) => s + t.amount, 0);
  const monthIncome = transactions.filter(t => t.type === 'income' && t.date >= monthStart).reduce((s, t) => s + t.amount, 0);

  return (
    <TransactionContext.Provider value={{
      transactions, categories, addTransaction, updateTransaction, deleteTransaction,
      addCategory, getCategory, clearAllData, totalBalance, todaySpending, weekSpending, monthSpending, monthIncome,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
