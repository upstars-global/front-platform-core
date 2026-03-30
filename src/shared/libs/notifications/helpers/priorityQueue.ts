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

export function evictExcess(
  notifications: Notification[],
  queue: Notification[],
  max: number,
): void {
  while (notifications.length > max) {
    const minPriority = notifications[notifications.length - 1].priority;
    
    const evictionIndex = notifications.findIndex(n => n.priority === minPriority);

    const [evicted] = notifications.splice(evictionIndex, 1);
    
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
    const next = queue.shift();
    if (!next) break; 

    insertSorted(notifications, next);
    startTimer(next, onExpire);
  }
}