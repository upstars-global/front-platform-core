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

const notificationsController = new LocalStorageKeyController<string[]>('clientNotificationsShown', {
  defaultValue: () => [],
});

function getShownNotifications(): string[] {
    if (isServer) {
      return [];
    }

    return notificationsController.get();
}

function addShownNotification(code: string): void {
    if (isServer) {
      return;
    }

    const notificationIds = getShownNotifications();

    if (!notificationIds.includes(code)) {
        notificationIds.push(code);
        notificationsController.set(notificationIds);
    }
}

function isNotificationShown(id: string) {
    const notificationIds = getShownNotifications();
    return notificationIds.includes(id);
}

export function useCheckClientNotification() {
    async function checkClientNotification(
      id: CustomUserNotificationPayload['code']
    ): Promise<boolean | { error: CustomUserNotificationError }> {
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
        log.error('CHECK_CLIENT_NOTIFICATION', String(error));
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
