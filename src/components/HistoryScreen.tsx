import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/context/TransactionContext';
import CategoryIcon from './CategoryIcon';
import { Trash2, X } from 'lucide-react';

export default function HistoryScreen() {
  const { transactions, getCategory, deleteTransaction, categories } = useTransactions();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => filter === 'all' || t.type === filter)
      .filter(t => categoryFilter === 'all' || t.categoryId === categoryFilter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter, categoryFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach(t => {
      const key = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      (map[key] ??= []).push(t);
    });
    return Object.entries(map);
  }, [filtered]);

  const formatCurrency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleDelete = (id: string) => {
    if (deletingId === id) {
      deleteTransaction(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">History</h1>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-2">
        {['all', 'expense', 'income'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Transactions */}
      {grouped.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground text-sm mt-4">
          No transactions found
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([dateStr, items]) => (
            <div key={dateStr}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{dateStr}</p>
              <div className="space-y-2">
                <AnimatePresence>
                  {items.map(t => {
                    const cat = getCategory(t.categoryId);
                    return (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100, height: 0 }}
                        className="glass-card rounded-xl p-3 flex items-center gap-3"
                      >
                        <CategoryIcon iconName={cat?.icon || 'CircleDot'} color={cat?.color || '220 10% 50%'} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{cat?.name || 'Unknown'}</p>
                          {t.note && <p className="text-[10px] text-muted-foreground truncate">{t.note}</p>}
                        </div>
                        <span className={`text-sm font-bold font-heading mr-2 ${t.type === 'income' ? 'text-balance-positive' : 'text-balance-negative'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                          {deletingId === t.id ? (
                            <Trash2 size={16} className="text-destructive" />
                          ) : (
                            <X size={14} className="text-muted-foreground" />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
