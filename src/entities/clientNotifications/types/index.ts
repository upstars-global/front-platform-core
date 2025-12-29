export type CustomUserNotificationPayload = {
  code: string;
  ttl?: number;
  maxShowCount?: number;
};

export type CustomUserNotificationError = {
  type: string;
  description: string;
};

export type CustomUserNotificationShowData = {
  count: 0 | 1;
  validUntil: string | null;
  countChangedAt: string;
};
