import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '@/context/TransactionContext';
import { useCurrency } from '@/context/CurrencyContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AnalyticsScreen() {
  const { transactions, getCategory } = useTransactions();
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const now = new Date();
  const periodStart = period === 'week'
    ? new Date(now.getTime() - 7 * 86400000).toISOString()
    : new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const periodTransactions = transactions.filter(t => t.date >= periodStart);
  const expenses = periodTransactions.filter(t => t.type === 'expense');
  const income = periodTransactions.filter(t => t.type === 'income');

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);

  // Category pie data
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount; });
    return Object.entries(map)
      .map(([catId, value]) => {
        const cat = getCategory(catId);
        return { name: cat?.name || 'Other', value, color: cat?.color || '220 10% 50%' };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses, getCategory]);

  // Daily bar data
  const barData = useMemo(() => {
    const days = period === 'week' ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data: { label: string; expense: number; income: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = period === 'week'
        ? new Date(now.getTime() - (6 - i) * 86400000)
        : new Date(now.getFullYear(), now.getMonth(), i + 1);
      const dayStr = d.toISOString().slice(0, 10);
      const dayLabel = period === 'week'
        ? d.toLocaleDateString('en-US', { weekday: 'short' })
        : String(i + 1);
      data.push({
        label: dayLabel,
        expense: periodTransactions.filter(t => t.type === 'expense' && t.date.slice(0, 10) === dayStr).reduce((s, t) => s + t.amount, 0),
        income: periodTransactions.filter(t => t.type === 'income' && t.date.slice(0, 10) === dayStr).reduce((s, t) => s + t.amount, 0),
      });
    }
    return data;
  }, [periodTransactions, period, now]);

  const { formatCurrency } = useCurrency();

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Analytics</h1>
      </motion.div>

      {/* Period Toggle */}
      <div className="flex gap-2">
        {(['week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              period === p ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground">Total Income</p>
          <p className="text-xl font-bold font-heading text-balance-positive mt-1">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold font-heading text-balance-negative mt-1">{formatCurrency(totalExpense)}</p>
        </div>
      </motion.div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold font-heading mb-3">Spending by Category</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} strokeWidth={0} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={`hsl(${entry.color})`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold font-heading mb-3">
          {period === 'week' ? 'Daily' : 'Daily'} Trend
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="expense" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Insights */}
      {expenses.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold font-heading">Quick Insights</h3>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>💰 You spent an average of <span className="font-semibold text-foreground">{formatCurrency(totalExpense / (period === 'week' ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()))}</span> per day</p>
            {pieData[0] && <p>📊 Top category: <span className="font-semibold text-foreground">{pieData[0].name}</span> ({formatCurrency(pieData[0].value)})</p>}
            {totalIncome > 0 && <p>📈 Savings rate: <span className="font-semibold text-foreground">{((1 - totalExpense / totalIncome) * 100).toFixed(0)}%</span></p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
