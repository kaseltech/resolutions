import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export async function initPushNotifications() {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    console.log('Push notifications only available on native platforms');
    return null;
  }

  try {
    // Request permission
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      // Register with Apple Push Notification service
      await PushNotifications.register();

      // Listen for registration success
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
        // TODO: Send this token to your backend to send notifications
        // You'll need a backend service (Firebase, AWS SNS, etc.) to send push notifications
        localStorage.setItem('push-token', token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      // Listen for push notifications received
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ' + JSON.stringify(notification));
        // Handle the notification (show in-app alert, update UI, etc.)
      });

      // Listen for push notification action (user tapped notification)
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed: ' + JSON.stringify(notification));
        // Navigate to relevant screen based on notification data
      });

      return true;
    } else {
      console.log('Push notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
}

export async function scheduleLocalReminder(title: string, body: string, date: Date) {
  // For local reminders, we'll use the browser's Notification API as fallback
  // or native local notifications when available
  if (!Capacitor.isNativePlatform()) {
    // Web fallback - request permission and schedule
    if ('Notification' in window && Notification.permission === 'granted') {
      const delay = date.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          new Notification(title, { body });
        }, delay);
      }
    }
  }
  // For native, you'd use @capacitor/local-notifications
}
