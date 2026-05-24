/**
 * Notification Service
 * Handles push notifications and local notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async getDeviceToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    seconds: number = 5,
    data?: Record<string, any>,
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          badge: 1,
        },
        trigger: {
          seconds,
          type: 'time',
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async sendNotification(title: string, body: string, taskId?: string): Promise<void> {
    try {
      await Notifications.presentNotificationAsync({
        title,
        body,
        data: { taskId },
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  onNotificationReceived(
    callback: (notification: Notifications.Notification) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  onNotificationTapped(
    callback: (response: Notifications.NotificationResponse) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  removeSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
  }
}

export default new NotificationService();