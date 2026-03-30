import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Mail, MapPin, Star } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-secondary"><ArrowLeft size={18} /></button>
        <h1 className="text-xl font-bold font-heading">About</h1>
      </motion.div>

      {/* App Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
        <img src={logo} alt="PocketTrack" className="w-20 h-20 rounded-2xl shadow-lg object-cover" />
        <div>
          <h2 className="text-lg font-bold font-heading">PocketTrack</h2>
          <p className="text-xs text-muted-foreground">Smart Expense & Income Tracker</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
          Version 1.0.0
        </div>
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">About the App</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          PocketTrack helps you easily track your daily income and expenses with a clean, modern interface. 
          Get insightful analytics, manage categories, and stay on top of your finances — all in one app.
        </p>
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-accent" /> Simple & fast expense tracking
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-accent" /> Beautiful charts & analytics
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-accent" /> Multi-currency support (INR, USD, EUR)
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-accent" /> Dark mode & custom categories
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star size={14} className="text-accent" /> 100% offline — your data stays on your device
          </div>
        </div>
      </motion.div>

      {/* Developer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Developer</h3>
        <div className="space-y-2.5">
          <a href="https://socilet.in" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Globe size={16} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Socilet</p>
              <p className="text-[10px] text-muted-foreground">socilet.in</p>
            </div>
          </a>
          <a href="mailto:contact@socilet.in"
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Mail size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Email Support</p>
              <p className="text-[10px] text-muted-foreground">contact@socilet.in</p>
            </div>
          </a>
        </div>
      </motion.div>

      {/* Legal */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-5 text-center text-xs text-muted-foreground space-y-1">
        <p>© 2026 Socilet. All rights reserved.</p>
        <p>Made with ❤️ in India</p>
      </motion.div>
    </div>
  );
}
