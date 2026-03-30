import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/context/TransactionContext';
import { useCurrency } from '@/context/CurrencyContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 100, damping: 15 }
  }),
};

const RADIAN = Math.PI / 180;

export default function AnalyticsScreen() {
  const { transactions, getCategory } = useTransactions();
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const { formatCurrency } = useCurrency();

  const now = new Date();
  const periodStart = period === 'week'
    ? new Date(now.getTime() - 7 * 86400000).toISOString()
    : new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const periodTransactions = transactions.filter(t => t.date >= periodStart);
  const expenses = periodTransactions.filter(t => t.type === 'expense');
  const income = periodTransactions.filter(t => t.type === 'income');

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100) : 0;

  // Category pie data
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount; });
    return Object.entries(map)
      .map(([catId, value]) => {
        const cat = getCategory(catId);
        return { name: cat?.name || 'Other', value, color: cat?.color || '220 10% 50%', percent: 0 };
      })
      .sort((a, b) => b.value - a.value)
      .map(item => ({ ...item, percent: totalExpense > 0 ? (item.value / totalExpense) * 100 : 0 }));
  }, [expenses, getCategory, totalExpense]);

  // Daily trend data with cumulative
  const trendData = useMemo(() => {
    const days = period === 'week' ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data: { label: string; expense: number; income: number; cumExpense: number; cumIncome: number }[] = [];
    let cumExpense = 0, cumIncome = 0;
    for (let i = 0; i < days; i++) {
      const d = period === 'week'
        ? new Date(now.getTime() - (6 - i) * 86400000)
        : new Date(now.getFullYear(), now.getMonth(), i + 1);
      const dayStr = d.toISOString().slice(0, 10);
      const dayLabel = period === 'week'
        ? d.toLocaleDateString('en-US', { weekday: 'short' })
        : String(i + 1);
      const dayExp = periodTransactions.filter(t => t.type === 'expense' && t.date.slice(0, 10) === dayStr).reduce((s, t) => s + t.amount, 0);
      const dayInc = periodTransactions.filter(t => t.type === 'income' && t.date.slice(0, 10) === dayStr).reduce((s, t) => s + t.amount, 0);
      cumExpense += dayExp;
      cumIncome += dayInc;
      data.push({ label: dayLabel, expense: dayExp, income: dayInc, cumExpense, cumIncome });
    }
    return data;
  }, [periodTransactions, period, now]);

  // Top spending day
  const topSpendingDay = useMemo(() => {
    if (trendData.length === 0) return null;
    return trendData.reduce((max, d) => d.expense > max.expense ? d : max, trendData[0]);
  }, [trendData]);

  const avgDaily = totalExpense / (period === 'week' ? 7 : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Analytics</h1>
        <p className="text-xs text-muted-foreground mt-1">Your financial overview at a glance</p>
      </motion.div>

      {/* Period Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 p-1 rounded-2xl bg-secondary/80 backdrop-blur-sm">
        {(['week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
              period === p
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p === 'week' ? '📅 This Week' : '📆 This Month'}
          </button>
        ))}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-income/10 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-income flex items-center justify-center">
              <ArrowDownLeft size={14} className="text-success-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Income</p>
          </div>
          <p className="text-lg font-bold font-heading text-balance-positive">{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-expense/10 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-expense flex items-center justify-center">
              <ArrowUpRight size={14} className="text-destructive-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Expenses</p>
          </div>
          <p className="text-lg font-bold font-heading text-balance-negative">{formatCurrency(totalExpense)}</p>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Wallet size={14} className="text-primary-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Net Savings</p>
          </div>
          <p className={`text-lg font-bold font-heading ${netSavings >= 0 ? 'text-balance-positive' : 'text-balance-negative'}`}>
            {netSavings >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netSavings))}
          </p>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-4 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/10 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Target size={14} className="text-accent-foreground" />
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Savings Rate</p>
          </div>
          <p className={`text-lg font-bold font-heading ${savingsRate >= 0 ? 'text-balance-positive' : 'text-balance-negative'}`}>
            {savingsRate.toFixed(0)}%
          </p>
        </motion.div>
      </div>

      {/* Pie Chart - Category Breakdown */}
      {pieData.length > 0 && (
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5" />
          <h3 className="text-sm font-semibold font-heading mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />
            Spending by Category
          </h3>
          <div className="flex items-center gap-2">
            <motion.div className="w-40 h-40"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%" cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                    label={renderCustomLabel}
                    labelLine={false}
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={`hsl(${entry.color})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                      fontSize: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            <div className="flex-1 space-y-2.5">
              {pieData.slice(0, 4).map(({ name, value, color, percent }, i) => (
                <motion.div key={name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${color})` }} />
                      <span className="text-muted-foreground truncate max-w-[70px]">{name}</span>
                    </div>
                    <span className="font-semibold text-[11px]">{formatCurrency(value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: `hsl(${color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Area Chart - Cumulative Trend */}
      <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible"
        className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-income/5" />
        <h3 className="text-sm font-semibold font-heading mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-income inline-block" style={{ backgroundColor: 'hsl(var(--income))' }} />
          Cumulative Flow
        </h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--income))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--income))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--expense))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--expense))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  fontSize: '11px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              />
              <Area type="monotone" dataKey="cumIncome" stroke="hsl(var(--income))" fill="url(#incomeGrad)" strokeWidth={2} dot={false} animationDuration={1200} />
              <Area type="monotone" dataKey="cumExpense" stroke="hsl(var(--expense))" fill="url(#expenseGrad)" strokeWidth={2} dot={false} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: 'hsl(var(--income))' }} />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: 'hsl(var(--expense))' }} />
            Expenses
          </div>
        </div>
      </motion.div>

      {/* Bar Chart - Daily Comparison */}
      <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible"
        className="glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-accent/5" />
        <h3 className="text-sm font-semibold font-heading mb-4 flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-accent inline-block" />
          Daily Breakdown
        </h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} barGap={1} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  fontSize: '11px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              />
              <Bar dataKey="income" fill="hsl(var(--income))" radius={[6, 6, 0, 0]} maxBarSize={14} animationDuration={1000} />
              <Bar dataKey="expense" fill="hsl(var(--expense))" radius={[6, 6, 0, 0]} maxBarSize={14} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--income))' }} />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--expense))' }} />
            Expenses
          </div>
        </div>
      </motion.div>

      {/* Quick Insights */}
      {expenses.length > 0 && (
        <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible"
          className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-primary/5" />
          <h3 className="text-sm font-semibold font-heading flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />
            Quick Insights
          </h3>
          <div className="space-y-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Wallet size={16} className="text-primary-foreground" />
              </div>
              <div className="text-xs">
                <p className="text-muted-foreground">Daily Average Spending</p>
                <p className="font-bold text-foreground mt-0.5">{formatCurrency(avgDaily)}</p>
              </div>
            </motion.div>

            {pieData[0] && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, hsl(${pieData[0].color}), hsl(${pieData[0].color} / 0.7))` }}>
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Top Category</p>
                  <p className="font-bold text-foreground mt-0.5">{pieData[0].name} — {formatCurrency(pieData[0].value)}</p>
                </div>
              </motion.div>
            )}

            {topSpendingDay && topSpendingDay.expense > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-9 h-9 rounded-xl gradient-expense flex items-center justify-center shrink-0">
                  <TrendingDown size={16} className="text-white" />
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Highest Spending Day</p>
                  <p className="font-bold text-foreground mt-0.5">{topSpendingDay.label} — {formatCurrency(topSpendingDay.expense)}</p>
                </div>
              </motion.div>
            )}

            {totalIncome > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Target size={16} className="text-accent-foreground" />
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Savings Rate</p>
                  <p className={`font-bold mt-0.5 ${savingsRate >= 20 ? 'text-balance-positive' : savingsRate >= 0 ? 'text-foreground' : 'text-balance-negative'}`}>
                    {savingsRate.toFixed(1)}% {savingsRate >= 20 ? '🎯 Great!' : savingsRate >= 0 ? '📊 Keep going!' : '⚠️ Over budget'}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
