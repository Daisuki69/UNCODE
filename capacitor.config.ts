import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.uncode.app',
  appName: 'UNCODE',
  webDir: 'dist',
  android: {
    backgroundColor: '#F9FAFB',
  },
  plugins: {
    // Keep keyboard from pushing the WebView up (better for the lockscreen UX)
    Keyboard: {
      resize: 'none',
    },
  },
};

export default config;
