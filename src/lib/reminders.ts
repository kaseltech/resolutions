'use client';

import { Capacitor } from '@capacitor/core';
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Resolution } from '@/types';

// Generate consistent notification ID from resolution ID
function getNotificationId(resolutionId: string): number {
  // Convert string ID to a positive integer
  let hash = 0;
  for (let i = 0; i < resolutionId.length; i++) {
    const char = resolutionId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Request notification permissions
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Check if notifications are enabled
export async function checkNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    if ('Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  }

  try {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
}

// Get motivational reminder messages
function getRandomReminderMessage(title: string): { title: string; body: string } {
  const messages = [
    { title: 'Time to check in!', body: `How's your progress on "${title}"?` },
    { title: 'Resolution Reminder', body: `Don't forget about "${title}" - you've got this!` },
    { title: 'Stay on track!', body: `A quick check-in for "${title}"` },
    { title: 'Progress time!', body: `Every step counts. Update "${title}"?` },
    { title: 'You can do it!', body: `Your resolution "${title}" is waiting for you` },
    { title: 'Keep going!', body: `Small steps lead to big changes. Check on "${title}"` },
    { title: 'Reminder', body: `Take a moment for "${title}" today` },
    { title: 'Daily check-in', body: `How are you doing with "${title}"?` },
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Convert frequency to ScheduleEvery
function getScheduleEvery(frequency: 'daily' | 'weekly' | 'monthly'): ScheduleEvery {
  switch (frequency) {
    case 'daily':
      return 'day';
    case 'weekly':
      return 'week';
    case 'monthly':
      return 'month';
    default:
      return 'day';
  }
}

// Parse time string to hours and minutes
function parseTime(timeString: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = timeString.split(':');
  return {
    hour: parseInt(hourStr, 10) || 9,
    minute: parseInt(minuteStr, 10) || 0,
  };
}

// Schedule a reminder for a resolution
export async function scheduleReminder(resolution: Resolution): Promise<boolean> {
  if (!resolution.reminder?.enabled) {
    return false;
  }

  const { frequency, time } = resolution.reminder;
  const notificationId = getNotificationId(resolution.id);

  // First cancel any existing reminder
  await cancelReminder(resolution.id);

  if (!Capacitor.isNativePlatform()) {
    // Web doesn't support recurring notifications well, skip for now
    console.log('Recurring notifications not supported on web');
    return false;
  }

  try {
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('Notification permission not granted');
        return false;
      }
    }

    const { hour, minute } = parseTime(time);
    const message = getRandomReminderMessage(resolution.title);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: message.title,
          body: message.body,
          schedule: {
            on: {
              hour,
              minute,
            },
            every: getScheduleEvery(frequency),
            allowWhileIdle: true,
          },
          sound: 'default',
          extra: {
            resolutionId: resolution.id,
            type: 'reminder',
          },
        },
      ],
    });

    console.log(`Scheduled ${frequency} reminder for "${resolution.title}" at ${time}`);
    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
}

// Cancel a reminder for a resolution
export async function cancelReminder(resolutionId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const notificationId = getNotificationId(resolutionId);
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    console.log(`Cancelled reminder for resolution ${resolutionId}`);
  } catch (error) {
    console.error('Error cancelling reminder:', error);
  }
}

// Cancel all reminders
export async function cancelAllReminders(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
    console.log('Cancelled all reminders');
  } catch (error) {
    console.error('Error cancelling all reminders:', error);
  }
}

// Get all pending reminders
export async function getPendingReminders(): Promise<{ id: number; title: string }[]> {
  if (!Capacitor.isNativePlatform()) {
    return [];
  }

  try {
    const pending = await LocalNotifications.getPending();
    return pending.notifications.map(n => ({
      id: n.id,
      title: n.title || 'Reminder',
    }));
  } catch (error) {
    console.error('Error getting pending reminders:', error);
    return [];
  }
}

// Sync all reminders with current resolutions
export async function syncReminders(resolutions: Resolution[]): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Cancel all existing reminders first
    await cancelAllReminders();

    // Schedule reminders for all resolutions with enabled reminders
    const reminderPromises = resolutions
      .filter(r => r.reminder?.enabled && r.progress < 100)
      .map(r => scheduleReminder(r));

    await Promise.all(reminderPromises);
    console.log('Synced all reminders');
  } catch (error) {
    console.error('Error syncing reminders:', error);
  }
}

// Initialize notification listeners
export async function initNotificationListeners(
  onNotificationReceived?: (resolutionId: string) => void,
  onNotificationAction?: (resolutionId: string) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Listen for notifications received while app is in foreground
    await LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
      const resolutionId = notification.extra?.resolutionId;
      if (resolutionId && onNotificationReceived) {
        onNotificationReceived(resolutionId);
      }
    });

    // Listen for notification actions (user tapped notification)
    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      console.log('Notification action:', action);
      const resolutionId = action.notification.extra?.resolutionId;
      if (resolutionId && onNotificationAction) {
        onNotificationAction(resolutionId);
      }
    });

    console.log('Notification listeners initialized');
  } catch (error) {
    console.error('Error initializing notification listeners:', error);
  }
}

// Schedule a one-time test notification
export async function sendTestNotification(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'Your reminders are working!',
      });
      return true;
    }
    return false;
  }

  try {
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      return false;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999999,
          title: 'Test Notification',
          body: 'Your reminders are working! Keep crushing those resolutions.',
          schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
          sound: 'default',
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
}
