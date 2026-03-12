import type { Notification } from '../types';
import { clearTimer, startTimer } from './timerHelpers';

function findInsertionIndex(list: Notification[], notification: Notification): number {
  return list.findIndex(
    ({ priority, createdAt }) =>
      priority < notification.priority ||
      (priority === notification.priority && createdAt > notification.createdAt),
  );
}

export function insertSorted(list: Notification[], notification: Notification): void {
  const index = findInsertionIndex(list, notification);

  if (index === -1) {
    list.push(notification);
  } else {
    list.splice(index, 0, notification);
  }
}

export function insertAndEvict(
  notifications: Notification[],
  queue: Notification[],
  notification: Notification,
  maxVisible: number,
): void {
  insertSorted(notifications, notification);

  while (notifications.length > maxVisible) {
    const evicted = notifications.pop()!;
    clearTimer(evicted);
    insertSorted(queue, evicted);
  }
}

export function promoteFromQueue(
  notifications: Notification[],
  queue: Notification[],
  maxVisible: number,
  onExpire: (id: string) => void,
): void {
  while (queue.length > 0 && notifications.length < maxVisible) {
    const next = queue.shift()!;
    insertSorted(notifications, next);
    startTimer(next, onExpire);
  }
}
