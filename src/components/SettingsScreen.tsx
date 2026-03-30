import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '@/context/TransactionContext';
import { useCurrency, currencies } from '@/context/CurrencyContext';
import CategoryIcon from './CategoryIcon';
import { Plus, Palette, Coins } from 'lucide-react';
import { TransactionType } from '@/types/transaction';

const colorOptions = [
  '0 72% 55%', '24 95% 53%', '37 95% 55%', '152 60% 45%', '162 63% 41%',
  '190 70% 45%', '210 70% 50%', '250 60% 55%', '280 60% 55%', '340 70% 55%',
];

const iconOptions = [
  'UtensilsCrossed', 'Car', 'Receipt', 'ShoppingBag', 'Gamepad2', 'Heart',
  'GraduationCap', 'Home', 'Plane', 'Gift', 'Music', 'Camera', 'Coffee', 'Dumbbell',
  'Briefcase', 'Laptop', 'TrendingUp', 'Wallet', 'Banknote', 'Star',
];

export default function SettingsScreen() {
  const { categories, addCategory } = useTransactions();
  const { currency, setCurrency } = useCurrency();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(colorOptions[0]);
  const [newIcon, setNewIcon] = useState(iconOptions[0]);
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName, icon: newIcon, color: newColor, type: newType });
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
      </motion.div>

      {/* Currency Selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Coins size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium">Currency</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {currencies.map(c => (
            <button
              key={c.code}
              onClick={() => setCurrency(c)}
              className={`py-3 rounded-xl text-center transition-all ${
                currency.code === c.code
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <span className="text-lg font-bold font-heading">{c.symbol}</span>
              <p className="text-[10px] font-medium mt-0.5">{c.code}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Dark Mode</span>
          </div>
          <button onClick={toggleDark} className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-secondary'}`}>
            <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow-sm absolute top-1 transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold font-heading">Categories</h3>
          <button onClick={() => setShowAddForm(!showAddForm)} className="p-2 rounded-xl bg-primary text-primary-foreground">
            <Plus size={16} />
          </button>
        </div>

        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card rounded-2xl p-4 mb-3 space-y-3">
            <div className="flex gap-2">
              {(['expense', 'income'] as TransactionType[]).map(t => (
                <button key={t} onClick={() => setNewType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${newType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name" className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none" />
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Color</p>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(c => (
                  <button key={c} onClick={() => setNewColor(c)}
                    className={`w-7 h-7 rounded-lg transition-all ${newColor === c ? 'ring-2 ring-primary scale-110' : ''}`}
                    style={{ backgroundColor: `hsl(${c})` }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Icon</p>
              <div className="flex gap-1.5 flex-wrap">
                {iconOptions.map(icon => (
                  <button key={icon} onClick={() => setNewIcon(icon)}
                    className={`p-1.5 rounded-lg transition-all ${newIcon === icon ? 'bg-primary/20 ring-1 ring-primary' : 'bg-secondary'}`}
                  >
                    <CategoryIcon iconName={icon} color={newColor} size="sm" />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAdd} disabled={!newName.trim()} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40">
              Add Category
            </button>
          </motion.div>
        )}

        <div className="space-y-2">
          {(['expense', 'income'] as TransactionType[]).map(type => (
            <div key={type}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 px-1 mt-3">
                {type === 'expense' ? '💸 Expense' : '💰 Income'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.filter(c => c.type === type).map(cat => (
                  <div key={cat.id} className="glass-card rounded-xl p-3 flex items-center gap-2">
                    <CategoryIcon iconName={cat.icon} color={cat.color} size="sm" />
                    <span className="text-xs font-medium truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-4 pb-2">
        <a
          href="https://socilet.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Design by <span className="font-semibold">Socilet</span>
        </a>
      </div>
    </div>
  );
}
