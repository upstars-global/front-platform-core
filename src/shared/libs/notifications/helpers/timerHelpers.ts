import type { Notification } from '../types';

const timerMap = new Map<string, ReturnType<typeof setTimeout>>();

export function startTimer(
  notification: Notification,
  onExpire: (id: string) => void,
): void {
  if (!notification.duration) return;

  clearTimer(notification);

  notification.remainingTime = notification.duration;
  notification.startedAt = Date.now();

  const timerId = setTimeout(() => {
    timerMap.delete(notification.id);
    onExpire(notification.id);
  }, notification.remainingTime);

  timerMap.set(notification.id, timerId);
}

export function clearTimer(notification: Notification): void {
  const timerId = timerMap.get(notification.id);
  if (timerId !== undefined) {
    clearTimeout(timerId);
    timerMap.delete(notification.id);
  }
}

export function pauseNotificationTimer(notification: Notification): void {
  if (!notification.duration || notification.paused) return;

  clearTimer(notification);
  notification.paused = true;

  if (notification.startedAt && notification.remainingTime) {
    const elapsed = Date.now() - notification.startedAt;
    notification.remainingTime = Math.max(0, notification.remainingTime - elapsed);
  }
}

export function resumeNotificationTimer(
  notification: Notification,
  onExpire: (id: string) => void,
): void {
  if (!notification.paused || !notification.duration) return;

  notification.paused = false;
  notification.startedAt = Date.now();

  if (notification.remainingTime && notification.remainingTime > 0) {
    const timerId = setTimeout(() => {
      timerMap.delete(notification.id);
      onExpire(notification.id);
    }, notification.remainingTime);
    timerMap.set(notification.id, timerId);
  } else {
    onExpire(notification.id);
  }
}

export function _clearAllTimersForTesting(): void {
  timerMap.forEach((timerId) => clearTimeout(timerId));
  timerMap.clear();
}
