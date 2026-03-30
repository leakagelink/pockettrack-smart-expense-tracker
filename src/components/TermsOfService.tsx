import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: PolicyPageProps) {
  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-secondary"><ArrowLeft size={18} /></button>
        <h1 className="text-xl font-bold font-heading">Terms of Service</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 space-y-4 text-xs text-muted-foreground leading-relaxed">
        <p className="text-[10px] text-muted-foreground/60">Last updated: March 30, 2026</p>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">1. Acceptance of Terms</h3>
          <p>By downloading, installing, or using PocketTrack – Smart Expense & Income Tracker ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the App.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">2. Description of Service</h3>
          <p>PocketTrack is a personal finance tracking application that allows users to record income and expenses, categorize transactions, and view financial analytics. The App is provided "as is" for personal, non-commercial use.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">3. User Responsibilities</h3>
          <p>• You are responsible for the accuracy of data you enter<br />
          • You must not use the App for any illegal or unauthorized purpose<br />
          • You must not attempt to reverse engineer or modify the App<br />
          • You are responsible for maintaining the security of your device</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">4. Intellectual Property</h3>
          <p>The App, including its design, code, graphics, and content, is the intellectual property of Socilet and is protected by copyright laws. You may not copy, modify, or distribute any part of the App without prior written consent.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">5. Advertisements</h3>
          <p>The App displays advertisements through Google AdMob. By using the App, you agree to view these advertisements. Ad content is provided by third parties and we are not responsible for the content of advertisements.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">6. Disclaimer of Warranties</h3>
          <p>The App is provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee that the App will be error-free, uninterrupted, or free of harmful components. The App is not a substitute for professional financial advice.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">7. Limitation of Liability</h3>
          <p>In no event shall Socilet be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of the App, including but not limited to loss of data or financial losses.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">8. Data & Privacy</h3>
          <p>Your use of the App is also governed by our Privacy Policy. All financial data is stored locally on your device. We do not access, collect, or store your personal financial data on our servers.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">9. Termination</h3>
          <p>We reserve the right to terminate or suspend access to the App at any time, without notice, for any reason. You may stop using the App at any time by uninstalling it from your device.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">10. Changes to Terms</h3>
          <p>We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the modified Terms.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">11. Contact</h3>
          <p>For questions about these Terms, contact us at:<br />
          <a href="https://socilet.in" target="_blank" rel="noopener noreferrer" className="text-primary font-medium">socilet.in</a></p>
        </div>
      </motion.div>
    </div>
  );
}
