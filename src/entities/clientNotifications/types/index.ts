export type CustomUserNotificationPayload = {
  code: string;
  ttl?: number;
  maxShowCount?: number;
};

export type CustomUserNotificationError = {
  type: string;
  description: string;
};

type CustomUserNotificationShowData = {
  count: 0 | 1;
  validUntil: string | null;
  countChangedAt: string;
};

export type CustomUserNotificationShowResponse = {
  responseId: string;
  error: CustomUserNotificationError | null;
  data: CustomUserNotificationShowData | null;
};
