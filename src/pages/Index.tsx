import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TransactionProvider } from '@/context/TransactionContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import BottomNav, { Tab } from '@/components/BottomNav';
import DashboardScreen from '@/components/DashboardScreen';
import AddTransactionScreen from '@/components/AddTransactionScreen';
import HistoryScreen from '@/components/HistoryScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import SettingsScreen from '@/components/SettingsScreen';

const screens: Record<Tab, React.ComponentType<any>> = {
  dashboard: DashboardScreen,
  history: HistoryScreen,
  add: AddTransactionScreen,
  analytics: AnalyticsScreen,
  settings: SettingsScreen,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const Screen = screens[activeTab];

  return (
    <CurrencyProvider>
    <TransactionProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'add' ? (
              <AddTransactionScreen onDone={setActiveTab} />
            ) : (
              <Screen />
            )}
          </motion.div>
        </AnimatePresence>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </TransactionProvider>
    </CurrencyProvider>
  );
}
