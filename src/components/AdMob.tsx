import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  size?: 'banner' | 'large-banner' | 'medium-rect';
  className?: string;
}

export function AdBanner({ size = 'banner', className = '' }: AdBannerProps) {
  const heights: Record<string, string> = {
    'banner': 'h-[50px]',
    'large-banner': 'h-[100px]',
    'medium-rect': 'h-[250px]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
    >
      <div className={`${heights[size]} w-full rounded-xl border border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-1 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase z-10">Test Ad</p>
        <p className="text-[9px] text-muted-foreground/60 z-10">AdMob Banner • ca-app-pub-3940256099942544</p>
        {size === 'medium-rect' && (
          <div className="mt-2 px-3 py-1.5 rounded-lg bg-primary/10 z-10">
            <p className="text-xs text-primary font-semibold">Install Now</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InterstitialAd({ isOpen, onClose }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);

  if (!isOpen) return null;

  // Auto countdown
  if (countdown > 0) {
    setTimeout(() => setCountdown(c => c - 1), 1000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
    >
      <div className="w-[90%] max-w-sm aspect-[3/4] rounded-2xl bg-card border border-border relative overflow-hidden flex flex-col items-center justify-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        {/* Close button */}
        <button
          onClick={countdown <= 0 ? onClose : undefined}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
            countdown <= 0
              ? 'bg-foreground/10 hover:bg-foreground/20 cursor-pointer'
              : 'bg-muted cursor-not-allowed'
          }`}
        >
          {countdown > 0 ? (
            <span className="text-xs font-bold text-muted-foreground">{countdown}</span>
          ) : (
            <X size={16} className="text-foreground" />
          )}
        </button>

        <div className="z-10 flex flex-col items-center gap-3 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ExternalLink size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold font-heading">Test Interstitial Ad</h3>
          <p className="text-xs text-muted-foreground">
            This is a test interstitial ad from AdMob.<br />
            ca-app-pub-3940256099942544/1033173712
          </p>
          <div className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
            Learn More
          </div>
        </div>

        <p className="absolute bottom-3 text-[9px] text-muted-foreground/50 z-10">
          AdMob Test • Google Mobile Ads SDK
        </p>
      </div>
    </motion.div>
  );
}

// Hook to manage interstitial ad display
export function useInterstitialAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [adCount, setAdCount] = useState(0);

  const showAd = () => {
    setIsOpen(true);
    setAdCount(c => c + 1);
  };

  // Show ad every 3 transactions
  const maybeShowAd = () => {
    const newCount = adCount + 1;
    setAdCount(newCount);
    if (newCount % 3 === 0) {
      setIsOpen(true);
    }
  };

  return {
    isOpen,
    closeAd: () => setIsOpen(false),
    showAd,
    maybeShowAd,
    InterstitialComponent: () => <InterstitialAd isOpen={isOpen} onClose={() => setIsOpen(false)} />,
  };
}
