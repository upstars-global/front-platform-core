import { publicApiV1 } from '../../../shared';
import type { CustomUserNotificationPayload, CustomUserNotificationShowData } from '../types';

export const clientNotificationsAPI = {
  async checkClientNotification({ code, ttl = 0, maxShowCount = 1 }: CustomUserNotificationPayload) {
      return await publicApiV1<CustomUserNotificationShowData>({
        url: 'custom-user-notification/show',
        secured: true,
        type: () => 'PublicApi.V1.Json.CustomUserNotification.Show',
        data: {
          data: { code, ttl, maxShowCount },
        },
      });
  },
};
