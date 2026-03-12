export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export enum NotificationPriority {
  Low = 0,
  Normal = 1,
  High = 2,
  Critical = 3,
}

export interface NotificationAction {
  label: string;
  handler: () => void;
}

export interface NotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  /** Auto-dismiss duration in ms. `null` = persistent. Overrides `persistent`. */
  duration?: number | null;
  /** If `true`, notification stays until manually dismissed (shorthand for `duration: null`). */
  persistent?: boolean;
  /**
   * Grouping key — serves two purposes:
   * 1. Visual grouping: notifications with the same group are grouped for UI collapse.
   * 2. Duplicate control: if a notification with the same group is already active,
   *    its counter increments (×2, ×3…) instead of showing a new one.
   */
  group?: string;
  actions?: NotificationAction[];
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  duration: number | null;
  group: string | null;
  actions: NotificationAction[];
  createdAt: number;
  duplicateCount: number;
  paused: boolean;
  remainingTime: number | null;
  startedAt: number | null;
  history: Notification[];
}
