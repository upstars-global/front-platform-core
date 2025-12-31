import { clientNotificationsAPI } from '../api';
import type {
  CustomUserNotificationError,
  CustomUserNotificationPayload,
} from '../types';
import {
  isServer,
  log,
  LocalStorageKeyController
} from '../../../shared';

export function useShowClientNotification() {
    const notificationsLocalStorageController = new LocalStorageKeyController<string[]>('clientNotificationsShown', {
      defaultValue: () => [],
    });

    function getShownNotifications(): string[] {
      if (isServer) {
        return [];
      }

      return notificationsLocalStorageController.get();
    }

    function addShownNotification(code: string): void {
      if (isServer) {
        return;
      }

      const notificationIds = getShownNotifications();

      if (!notificationIds.includes(code)) {
        notificationIds.push(code);
        notificationsLocalStorageController.set(notificationIds);
      }
    }

    function isNotificationShown(id: string) {
      const notificationIds = getShownNotifications();
      return notificationIds.includes(id);
    }

    async function showClientNotification(
      id: CustomUserNotificationPayload['code']
    ): Promise<boolean | { error: CustomUserNotificationError }> {
      const code = id.trim();

      if (isNotificationShown(code)) {
        return true;
      }

      try {
        const response = await clientNotificationsAPI.showCustomUserNotification({ code });

        if (response.error) {
          const message = `[Type]: ${response.error.type} [Description]: ${response.error.description}`;
          log.error('SHOW_CLIENT_NOTIFICATION', message);
          return { error: response.error };
        }

        addShownNotification(code);

        return Boolean(response.data?.count);
      } catch (error) {
        log.error('SHOW_CLIENT_NOTIFICATION', String(error));
        return {
          error: {
            type: 'SHOW_CLIENT_NOTIFICATION',
            description: String(error),
          },
        };
      }
    }

    return {
        showClientNotification,
    };
}
