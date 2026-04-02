import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// AdMob Configuration - Your real Ad Unit IDs
const ADMOB_CONFIG = {
  appId: 'ca-app-pub-9135467957897987~6645958141',
  bannerId: 'ca-app-pub-9135467957897987/5394974707',
  interstitialId: 'ca-app-pub-9135467957897987/4802910359',
  nativeId: 'ca-app-pub-9135467957897987/3890321340',
};

// Check if running inside Capacitor (native app)
const isNative = () => {
  return typeof (window as any)?.Capacitor !== 'undefined';
};

// Initialize AdMob (call once on app start)
export async function initializeAdMob() {
  if (!isNative()) {
    console.log('[AdMob] Running in browser - using mock ads');
    return;
  }

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.initialize({
      initializeForTesting: false,
    });
    console.log('[AdMob] Initialized successfully');
  } catch (error) {
    console.error('[AdMob] Initialization failed:', error);
  }
}

interface AdBannerProps {
  size?: 'banner' | 'large-banner' | 'medium-rect';
  className?: string;
}

export function AdBanner({ size = 'banner', className = '' }: AdBannerProps) {
  const [nativeAdShown, setNativeAdShown] = useState(false);

  useEffect(() => {
    if (isNative()) {
      showNativeBanner();
    }
  }, []);

  const showNativeBanner = async () => {
    try {
      const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
      
      const bannerSize = size === 'medium-rect' 
        ? BannerAdSize.MEDIUM_RECTANGLE 
        : size === 'large-banner' 
          ? BannerAdSize.LARGE_BANNER 
          : BannerAdSize.BANNER;

      await AdMob.showBanner({
        adId: ADMOB_CONFIG.bannerId,
        adSize: bannerSize,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false,
      });
      setNativeAdShown(true);
      console.log('[AdMob] Banner shown');
    } catch (error) {
      console.error('[AdMob] Banner error:', error);
    }
  };

  // If native ad is shown, don't render mock
  if (nativeAdShown) return null;

  // Mock ad for browser preview
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
        <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase z-10">Ad Preview (Browser)</p>
        <p className="text-[9px] text-muted-foreground/60 z-10">Real ads will show in native app</p>
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

  useEffect(() => {
    if (isOpen && isNative()) {
      showNativeInterstitial();
    }
  }, [isOpen]);

  const showNativeInterstitial = async () => {
    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.prepareInterstitial({
        adId: ADMOB_CONFIG.interstitialId,
        isTesting: false,
      });
      await AdMob.showInterstitial();
      onClose();
      console.log('[AdMob] Interstitial shown');
    } catch (error) {
      console.error('[AdMob] Interstitial error:', error);
    }
  };

  // Don't show mock in native
  if (!isOpen || isNative()) return null;

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
          <h3 className="text-lg font-bold font-heading">Ad Preview</h3>
          <p className="text-xs text-muted-foreground">
            This is a browser preview.<br />
            Real interstitial ads will show in the native app.
          </p>
          <div className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
            Learn More
          </div>
        </div>

        <p className="absolute bottom-3 text-[9px] text-muted-foreground/50 z-10">
          AdMob • Native App Only
        </p>
      </div>
    </motion.div>
  );
}

export function useInterstitialAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [adCount, setAdCount] = useState(0);

  const showAd = () => {
    setIsOpen(true);
    setAdCount(c => c + 1);
  };

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
