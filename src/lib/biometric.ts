import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

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

export async function isBiometricEnabled(): Promise<boolean> {
  const { value } = await Preferences.get({ key: BIOMETRIC_ENABLED_KEY });
  return value === 'true';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await Preferences.set({
    key: BIOMETRIC_ENABLED_KEY,
    value: enabled ? 'true' : 'false',
  });
}

export async function authenticateWithBiometric(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    await NativeBiometric.verifyIdentity({
      reason: 'Access your 2026 Resolutions',
      title: 'Unlock App',
      subtitle: 'Use biometric authentication to continue',
      description: '',
    });
    return true;
  } catch {
    return false;
  }
}
