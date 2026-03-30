import { LayoutDashboard, Plus, ListFilter, PieChart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export type Tab = 'dashboard' | 'history' | 'add' | 'analytics' | 'settings';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: any; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'history', icon: ListFilter, label: 'History' },
  { id: 'add', icon: Plus, label: 'Add' },
  { id: 'analytics', icon: PieChart, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isAdd = id === 'add';
          const isActive = active === id;

          if (isAdd) {
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className="relative -mt-6"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon size={24} className="text-primary-foreground" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-6 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
