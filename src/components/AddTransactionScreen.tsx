import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/context/TransactionContext';
import { useCurrency } from '@/context/CurrencyContext';
import { TransactionType } from '@/types/transaction';
import CategoryIcon from './CategoryIcon';
import { Check } from 'lucide-react';
import { Tab } from './BottomNav';

interface AddTransactionScreenProps {
  onDone: (tab: Tab) => void;
}

export default function AddTransactionScreen({ onDone }: AddTransactionScreenProps) {
  const { categories, addTransaction } = useTransactions();
  const { currency } = useCurrency();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredCategories = categories.filter(c => c.type === type);

  const quickAmounts = type === 'expense' ? [5, 10, 20, 50, 100] : [100, 500, 1000, 2000, 5000];

  const handleSubmit = () => {
    if (!amount || !categoryId) return;
    addTransaction({
      type,
      amount: parseFloat(amount),
      categoryId,
      date: new Date(date).toISOString(),
      note,
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setCategoryId('');
      setNote('');
      onDone('dashboard');
    }, 800);
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg">
              <Check size={36} className="text-primary-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Add Transaction</h1>
      </motion.div>

      {/* Type Toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-card rounded-2xl p-1 flex"
      >
        {(['expense', 'income'] as TransactionType[]).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); setCategoryId(''); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              type === t
                ? t === 'expense' ? 'gradient-expense text-primary-foreground shadow-md' : 'gradient-income text-primary-foreground shadow-md'
                : 'text-muted-foreground'
            }`}
          >
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </motion.div>

      {/* Amount */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 text-center"
      >
        <p className="text-xs text-muted-foreground mb-2">Amount</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl font-bold font-heading text-muted-foreground">{currency.symbol}</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-4xl font-bold font-heading bg-transparent outline-none text-center w-48 text-foreground placeholder:text-muted-foreground/40"
          />
        </div>
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {quickAmounts.map(a => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {currency.symbol}{a}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Category */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-xs text-muted-foreground mb-2 px-1">Category</p>
        <div className="grid grid-cols-4 gap-2">
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`glass-card rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all ${
                categoryId === cat.id ? 'ring-2 ring-primary shadow-md' : ''
              }`}
            >
              <CategoryIcon iconName={cat.icon} color={cat.color} size="sm" />
              <span className="text-[10px] font-medium text-muted-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Date & Note */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full glass-card rounded-xl px-4 py-3 text-sm bg-transparent outline-none text-foreground"
        />
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full glass-card rounded-xl px-4 py-3 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
        />
      </motion.div>

      {/* Submit */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        onClick={handleSubmit}
        disabled={!amount || !categoryId}
        className={`w-full py-4 rounded-2xl text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
          type === 'expense' ? 'gradient-expense text-primary-foreground shadow-expense/20' : 'gradient-income text-primary-foreground shadow-income/20'
        }`}
      >
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </motion.button>
    </div>
  );
}
