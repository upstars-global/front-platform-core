import { clientNotificationsAPI } from '../api';
import type {
  CustomUserNotificationError,
  CustomUserNotificationPayload,
} from '../types';
import { log } from '../../../shared';

const STORAGE_KEY = "clientNotificationsShown";

function getShownNotifications(): string[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function addShownNotification(code: string): void {
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
