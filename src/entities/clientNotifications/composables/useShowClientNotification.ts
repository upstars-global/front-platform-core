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

export class ClientNotificationError extends Error {
  public readonly errorData: CustomUserNotificationError;

  constructor(message: string, errorData: CustomUserNotificationError) {
    super(message);
    this.errorData = errorData;
  }
}

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
    ): Promise<boolean> {
      const code = id.trim();

      if (isNotificationShown(code)) {
        return true;
      }

      try {
        const response = await clientNotificationsAPI.showCustomUserNotification({ code });

        if (response.error) {
          throw new ClientNotificationError('SHOW_CLIENT_NOTIFICATION', response.error);
        }

        addShownNotification(code);

        return Boolean(response.data?.count);
      } catch (error) {
        log.error('SHOW_CLIENT_NOTIFICATION', error);
        throw error;
      }
    }

    return {
        showClientNotification,
    };
}
