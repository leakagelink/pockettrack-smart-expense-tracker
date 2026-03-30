import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import CategoryIcon from './CategoryIcon';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DashboardScreen() {
  const { totalBalance, todaySpending, weekSpending, monthSpending, monthIncome, transactions, categories, getCategory } = useTransactions();

  const recentTransactions = transactions.slice(0, 5);

  // Category spending for mini pie chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense' && t.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory)
    .map(([catId, value]) => {
      const cat = getCategory(catId);
      return { name: cat?.name || 'Other', value, color: cat?.color || '220 10% 50%' };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const formatCurrency = (n: number) => `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back 👋</p>
          <h1 className="text-2xl font-bold font-heading">PocketTrack</h1>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl gradient-primary p-6 text-primary-foreground shadow-lg shadow-primary/20"
      >
        <p className="text-sm opacity-80">Total Balance</p>
        <h2 className="text-3xl font-bold font-heading mt-1">
          {totalBalance < 0 ? '-' : ''}{formatCurrency(totalBalance)}
        </h2>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowDownLeft size={16} />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Income</p>
              <p className="text-sm font-semibold">{formatCurrency(monthIncome)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Expenses</p>
              <p className="text-sm font-semibold">{formatCurrency(monthSpending)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: todaySpending },
          { label: 'This Week', value: weekSpending },
          { label: 'This Month', value: monthSpending },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground">{label}</p>
            <p className="text-base font-bold font-heading mt-1 text-expense">{formatCurrency(value)}</p>
          </div>
        ))}
      </motion.div>

      {/* Spending Chart */}
      {pieData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold font-heading mb-3">This Month's Spending</h3>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={40} strokeWidth={0}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={`hsl(${entry.color})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${color})` }} />
                    <span className="text-muted-foreground">{name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm font-semibold font-heading mb-3">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground text-sm">
            <TrendingUp className="mx-auto mb-2 text-muted-foreground/50" size={32} />
            No transactions yet. Tap + to add one!
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map(t => {
              const cat = getCategory(t.categoryId);
              return (
                <div key={t.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                  <CategoryIcon iconName={cat?.icon || 'CircleDot'} color={cat?.color || '220 10% 50%'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cat?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-muted-foreground">{t.note || new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-bold font-heading ${t.type === 'income' ? 'text-balance-positive' : 'text-balance-negative'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
