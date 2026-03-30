import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PolicyPageProps) {
  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-secondary"><ArrowLeft size={18} /></button>
        <h1 className="text-xl font-bold font-heading">Privacy Policy</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 space-y-4 text-xs text-muted-foreground leading-relaxed">
        <p className="text-[10px] text-muted-foreground/60">Last updated: March 30, 2026</p>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">1. Introduction</h3>
          <p>PocketTrack ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application PocketTrack – Smart Expense & Income Tracker ("App").</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">2. Information We Collect</h3>
          <p><strong className="text-foreground">Personal Data:</strong> We do not collect any personal identification information. All financial data (transactions, categories, preferences) is stored locally on your device.</p>
          <p className="mt-2"><strong className="text-foreground">Usage Data:</strong> We may collect anonymous usage statistics to improve app performance and user experience. This includes device type, OS version, and app usage patterns.</p>
          <p className="mt-2"><strong className="text-foreground">Advertising:</strong> Our app uses Google AdMob to display advertisements. AdMob may collect device identifiers and usage data for personalized advertising. You can opt out of personalized ads in your device settings.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">3. How We Use Your Information</h3>
          <p>• To provide and maintain the App functionality<br />
          • To improve user experience and app performance<br />
          • To display relevant advertisements<br />
          • To detect and prevent technical issues</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">4. Data Storage & Security</h3>
          <p>All your financial data is stored locally on your device. We do not transmit, store, or have access to your personal financial information on any server. We implement appropriate security measures to protect against unauthorized access.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">5. Third-Party Services</h3>
          <p>Our App may contain links to third-party services. We use:<br />
          • <strong className="text-foreground">Google AdMob</strong> – for displaying advertisements<br />
          These services have their own privacy policies, and we encourage you to review them.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">6. Children's Privacy</h3>
          <p>Our App is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">7. Data Deletion</h3>
          <p>You can delete all your data at any time from the Settings screen by using the "Delete All Data" option. Since all data is stored locally, uninstalling the app will also remove all data.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">8. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">9. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at:<br />
          <a href="https://socilet.in" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">socilet.in</a></p>
        </div>
      </motion.div>
    </div>
  );
}
