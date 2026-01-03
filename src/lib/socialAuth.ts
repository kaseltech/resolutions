import { SocialLogin } from '@capgo/capacitor-social-login';
import type { GoogleLoginResponseOnline, AppleProviderResponse } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';

// Google OAuth Client IDs
const GOOGLE_WEB_CLIENT_ID = '363544011116-lol2r4dcr7dlrnu2f9tj28429647elea.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '363544011116-7enkp3ihbjefdldldkieg5k3d67sjlnq.apps.googleusercontent.com';

export async function initializeSocialLogin() {
  if (!Capacitor.isNativePlatform()) {
    console.log('Social login: Web platform - using Supabase OAuth');
    return;
  }

  try {
    // Initialize social login providers
    await SocialLogin.initialize({
      apple: {
        clientId: 'com.resolutions2026.app', // Your App ID
      },
      google: {
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iOSClientId: GOOGLE_IOS_CLIENT_ID,
        iOSServerClientId: GOOGLE_WEB_CLIENT_ID, // Token audience for Supabase
        mode: 'online',
      },
    });

    console.log('Social login initialized');
  } catch (error) {
    console.error('Failed to initialize social login:', error);
  }
}

// Helper to generate random nonce for Apple
function generateNonce(length = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = crypto.getRandomValues(new Uint8Array(length));
  values.forEach((value) => {
    result += charset[value % charset.length];
  });
  return result;
}

// Helper to hash nonce for Apple
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function signInWithApple(): Promise<{ error?: string }> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback - use Supabase OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error?.message };
  }

  try {
    // Generate nonce for security
    const rawNonce = generateNonce();
    const hashedNonce = await sha256(rawNonce);

    const result = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name'],
        nonce: hashedNonce,
      },
    });

    const appleResult = result.result as AppleProviderResponse;

    if (!appleResult || !appleResult.idToken) {
      return { error: 'Apple sign in failed - no token received' };
    }

    // Sign in to Supabase with the Apple ID token
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: appleResult.idToken,
      nonce: rawNonce, // Send raw nonce, Supabase will hash it
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Apple sign in error:', error);
    return { error: error instanceof Error ? error.message : 'Apple sign in failed' };
  }
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback - use Supabase OAuth
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error?.message };
  }

  try {
    const result = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    // In 'online' mode, we get GoogleLoginResponseOnline with idToken
    const googleResult = result.result as GoogleLoginResponseOnline;

    if (!googleResult || !googleResult.idToken) {
      return { error: 'Google sign in failed - no token received' };
    }

    // Sign in to Supabase with the Google ID token
    // Note: "Skip nonce check" must be enabled in Supabase for iOS
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: googleResult.idToken,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error('Google sign in error:', error);
    return { error: error instanceof Error ? error.message : 'Google sign in failed' };
  }
}

// Check if social login is available
export function isSocialLoginAvailable(): boolean {
  return Capacitor.isNativePlatform();
}
