/**
 * Custom Hook for Notifications
 */

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '@/services/notifications';

export const useNotifications = () => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await notificationService.requestPermissions();
      if (hasPermission) {
        const deviceToken = await notificationService.getDeviceToken();
        console.log('Device token:', deviceToken);
      }
    };

    setupNotifications();

    return () => {
      if (notificationListener.current) {
        notificationService.removeSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        notificationService.removeSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleNotification = async (
    title: string,
    body: string,
    seconds?: number,
    data?: Record<string, any>,
  ) => {
    return notificationService.scheduleLocalNotification(title, body, seconds, data);
  };

  const onNotificationReceived = (
    callback: (notification: Notifications.Notification) => void,
  ) => {
    notificationListener.current = notificationService.onNotificationReceived(callback);
  };

  const onNotificationTapped = (
    callback: (response: Notifications.NotificationResponse) => void,
  ) => {
    responseListener.current = notificationService.onNotificationTapped(callback);
  };

  return {
    scheduleNotification,
    onNotificationReceived,
    onNotificationTapped,
  };
};