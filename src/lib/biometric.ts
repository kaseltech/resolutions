import { NativeBiometric, BiometryType } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const BIOMETRIC_ENABLED_KEY = 'biometric_login_enabled';
const CREDENTIALS_STORED_KEY = 'biometric_credentials_stored';
const CREDENTIALS_SERVER = 'com.yearvow.app';

export async function isBiometricAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

export async function getBiometryType(): Promise<string> {
  if (!Capacitor.isNativePlatform()) {
    return 'none';
  }

  try {
    const result = await NativeBiometric.isAvailable();
    if (!result.isAvailable) return 'none';

    switch (result.biometryType) {
      case BiometryType.FACE_ID:
        return 'Face ID';
      case BiometryType.TOUCH_ID:
        return 'Touch ID';
      case BiometryType.FINGERPRINT:
        return 'Fingerprint';
      case BiometryType.FACE_AUTHENTICATION:
        return 'Face Authentication';
      case BiometryType.IRIS_AUTHENTICATION:
        return 'Iris Authentication';
      default:
        return 'Biometric';
    }
  } catch {
    return 'none';
  }
}

export async function isBiometricLoginEnabled(): Promise<boolean> {
  const { value } = await Preferences.get({ key: BIOMETRIC_ENABLED_KEY });
  return value === 'true';
}

export async function setBiometricLoginEnabled(enabled: boolean): Promise<void> {
  await Preferences.set({
    key: BIOMETRIC_ENABLED_KEY,
    value: enabled ? 'true' : 'false',
  });
}

// Check if credentials have been stored (without triggering Face ID)
export async function hasStoredCredentials(): Promise<boolean> {
  const { value } = await Preferences.get({ key: CREDENTIALS_STORED_KEY });
  return value === 'true';
}

// Store credentials securely for Face ID login
export async function storeCredentials(email: string, password: string): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('storeCredentials: Not on native platform');
    return false;
  }

  try {
    console.log('storeCredentials: Storing credentials for', email);

    // First verify identity with Face ID to authorize storing
    await NativeBiometric.verifyIdentity({
      reason: 'Verify your identity to enable Face ID login',
      title: 'Enable Face ID',
      subtitle: 'Authenticate to enable quick login',
      description: '',
      useFallback: true,
      fallbackTitle: 'Cancel',
    });

    await NativeBiometric.setCredentials({
      username: email,
      password: password,
      server: CREDENTIALS_SERVER,
    });

    // Track that credentials are stored (so we can check without triggering Face ID)
    await Preferences.set({ key: CREDENTIALS_STORED_KEY, value: 'true' });
    await setBiometricLoginEnabled(true);
    console.log('storeCredentials: Credentials stored successfully');
    return true;
  } catch (error) {
    console.error('storeCredentials error:', error);
    return false;
  }
}

// Get stored credentials after Face ID authentication
export async function getStoredCredentials(): Promise<{ email: string; password: string } | null> {
  if (!Capacitor.isNativePlatform()) {
    console.log('getStoredCredentials: Not on native platform');
    return null;
  }

  try {
    // Check if we have credentials stored using our tracking preference (no Face ID prompt)
    const credentialsStored = await hasStoredCredentials();
    if (!credentialsStored) {
      console.log('getStoredCredentials: No credentials stored (checked via Preferences)');
      return null;
    }

    // Verify identity with Face ID
    console.log('getStoredCredentials: Requesting Face ID verification');
    await NativeBiometric.verifyIdentity({
      reason: 'Sign in to YearVow',
      title: 'Sign In',
      subtitle: 'Authenticate to access your account',
      description: '',
      useFallback: true,
      fallbackTitle: 'Use Password',
    });

    // Get the stored credentials
    console.log('getStoredCredentials: Face ID verified, getting credentials');
    const credentials = await NativeBiometric.getCredentials({
      server: CREDENTIALS_SERVER,
    });

    console.log('getStoredCredentials: Retrieved credentials for', credentials.username);
    return {
      email: credentials.username,
      password: credentials.password,
    };
  } catch (error) {
    console.error('getStoredCredentials error:', error);
    // If credentials retrieval fails, clear the stored flag to prevent future issues
    await Preferences.remove({ key: CREDENTIALS_STORED_KEY });
    await setBiometricLoginEnabled(false);
    return null;
  }
}

// Delete stored credentials when disabling Face ID login
export async function deleteStoredCredentials(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await NativeBiometric.deleteCredentials({
      server: CREDENTIALS_SERVER,
    });
  } catch {
    // Ignore errors when deleting
  }

  // Always clear our tracking preferences
  await Preferences.remove({ key: CREDENTIALS_STORED_KEY });
  await setBiometricLoginEnabled(false);
}

// Legacy function for app lock (keeping for compatibility)
export async function authenticateWithBiometric(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    await NativeBiometric.verifyIdentity({
      reason: 'Access YearVow',
      title: 'Unlock App',
      subtitle: 'Use biometric authentication to continue',
      description: '',
    });
    return true;
  } catch {
    return false;
  }
}

// Legacy - keeping for backward compatibility
export const isBiometricEnabled = isBiometricLoginEnabled;
export const setBiometricEnabled = setBiometricLoginEnabled;
