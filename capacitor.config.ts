import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yearvow.app',
  appName: 'YearVow',
  webDir: 'out',
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    backgroundColor: '#1E3A5F',
  },
  server: {
    iosScheme: 'capacitor',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1E3A5F',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
