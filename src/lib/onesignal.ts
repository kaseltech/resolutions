// OneSignal App ID - configure in Xcode with native SDK
export const ONESIGNAL_APP_ID = 'bb5ec4ed-5fb9-4256-b551-82ac19943dae';

// OneSignal is initialized natively in iOS via AppDelegate.swift
// This file provides the App ID for reference and any web-based functionality

export async function initOneSignal() {
  // OneSignal initialization happens in native code (AppDelegate.swift)
  // This function is a placeholder for any web-side initialization if needed
  console.log('OneSignal configured with App ID:', ONESIGNAL_APP_ID);
}
