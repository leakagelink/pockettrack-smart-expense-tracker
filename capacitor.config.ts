import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pockettrack.app',
  appName: 'PocketTrack',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9135467957897987~6645958141',
    },
  },
};

export default config;
