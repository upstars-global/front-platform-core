import { clientNotificationsAPI } from '../api';
import type {
  CustomUserNotificationError,
  CustomUserNotificationPayload,
} from '../types';
import { isServer, log } from '../../../shared';

const STORAGE_KEY = "clientNotificationsShown";

function getShownNotifications(): string[] {
    if (isServer) {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      log.error('GET_SHOWN_NOTIFICATIONS', 'Failed to parse stored notifications, clearing storage');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
}

function addShownNotification(code: string): void {
    if (isServer) {
      return;
    }

    const notificationIds = getShownNotifications();

    if (!notificationIds.includes(code)) {
        notificationIds.push(code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notificationIds));
    }
}

function isNotificationShown(id: string) {
    const notificationIds = getShownNotifications();
    return notificationIds.includes(id);
}

export function useCheckClientNotification() {
    async function checkClientNotification(id: CustomUserNotificationPayload['code']): Promise<boolean | { error: CustomUserNotificationError }> {
      const code = id.trim();

      if (isNotificationShown(code)) {
        return true;
      }

      try {
        const response = await clientNotificationsAPI.checkClientNotification({ code });

        if (response.error) {
          const message = `[Type]: ${response.error.type} [Description]: ${response.error.description}`;
          log.error('CHECK_CLIENT_NOTIFICATION', message);
          return { error: response.error };
        }

        addShownNotification(code);

        return Boolean(response.data?.count);
      } catch (error) {
        return {
          error: {
            type: 'CHECK_CLIENT_NOTIFICATION',
            description: String(error),
          },
        };
      }
    }

    return {
        checkClientNotification,
    };
}
