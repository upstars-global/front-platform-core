import { ref, computed, readonly } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType, NotificationPriority, type Notification, type NotificationOptions } from '../types';
import {
  getEffectiveDuration,
  startTimer,
  clearTimer,
  pauseNotificationTimer,
  resumeNotificationTimer,
  insertSorted,
  insertAndEvict,
  promoteFromQueue,
  _clearAllTimersForTesting,
} from '../helpers';
import { configNotifications } from '../config';

const notifications = ref<Notification[]>([]);
const queue = ref<Notification[]>([]);
const isOnHold = ref(false);

function findById(list: Notification[], targetId: string): Notification | undefined {
  return list.find(({ id }) => id === targetId);
}

function tryPromote(hold: boolean): void {
  if (!hold) {
    promoteFromQueue(notifications.value, queue.value, configNotifications.getMaxVisible(), removeNotification);
  }
}

function removeNotification(targetId: string): void {
  const index = notifications.value.findIndex(({ id }) => id === targetId);

  if (index === -1) return;

  clearTimer(notifications.value[index]);
  notifications.value.splice(index, 1);
  tryPromote(isOnHold.value);
}

function findByGroup(targetGroup: string): { notification: Notification; isVisible: boolean } | undefined {
  const visible = notifications.value.find(({ group }) => group === targetGroup);

  if (visible) return { notification: visible, isVisible: true };

  const queued = queue.value.find(({ group }) => group === targetGroup);
  
  if (queued) return { notification: queued, isVisible: false };

  return undefined;
}

function notify(message: string, options: NotificationOptions = {}): string {
  const group = options.group ?? null;
  const force = options.force ?? false;

  if (group) {
    const found = findByGroup(group);

    if (found) {
      const { notification: existing, isVisible } = found;

      existing.history.push({
        ...existing,
        actions: existing.actions.map(action => ({ ...action })),
        history: [],
        id: uuidv4(),
      });

      Object.assign(existing, {
        message,
        type: options.type ?? existing.type,
        actions: options.actions ?? existing.actions,
        createdAt: Date.now(),
        duplicateCount: existing.duplicateCount + 1,
      });

      if (isVisible && existing.duration) {
        if (existing.paused) {
          existing.remainingTime = existing.duration;
        } else {
          clearTimer(existing);
          startTimer(existing, removeNotification);
        }
      }

      return existing.id;
    }
  }

  const notification: Notification = {
    id: uuidv4(),
    message,
    type: options.type ?? NotificationType.Info,
    priority: options.priority ?? NotificationPriority.Normal,
    duration: getEffectiveDuration(options, configNotifications.getDurationConfig()),
    group,
    actions: options.actions ?? [],
    createdAt: Date.now(),
    duplicateCount: 1,
    paused: false,
    remainingTime: null,
    startedAt: null,
    history: [],
  };

  const maxVisible = configNotifications.getMaxVisible();
  const lowestVisible = notifications.value[notifications.value.length - 1];

  const canShowNow =
    force ||
    (!isOnHold.value &&
      (notifications.value.length < maxVisible ||
        (lowestVisible && notification.priority > lowestVisible.priority)));

  if (canShowNow) {
    insertAndEvict(notifications.value, queue.value, notification, maxVisible);
    startTimer(notification, removeNotification);
  } else {
    insertSorted(queue.value, notification);
  }

  return notification.id;
}

function dismiss(targetId: string): void {
  const queueIndex = queue.value.findIndex(({ id }) => id === targetId);

  if (queueIndex !== -1) {
    queue.value.splice(queueIndex, 1);
    return;
  }

  removeNotification(targetId);
}

function dismissVisible(): void {
  notifications.value.forEach(clearTimer);
  notifications.value = [];
  tryPromote(isOnHold.value);
}

function dismissQueue(): void {
  queue.value = [];
}

function dismissAll(): void {
  notifications.value.forEach(clearTimer);
  notifications.value = [];
  queue.value = [];
}

function holdNotifications(hold: boolean): void {
  isOnHold.value = hold;
  tryPromote(hold);
}

function pauseTimer(id: string): void {
  const notification = findById(notifications.value, id);
  if (notification) pauseNotificationTimer(notification);
}

function resumeTimer(id: string): void {
  const notification = findById(notifications.value, id);
  if (notification) resumeNotificationTimer(notification, removeNotification);
}

function setMaxVisible(count: number): void {
  configNotifications.setMaxVisible(count);
  const maxVisible = configNotifications.getMaxVisible();

  while (notifications.value.length > maxVisible) {
    const evicted = notifications.value.pop();
    
    if (evicted) {
      clearTimer(evicted);
      insertSorted(queue.value, evicted);
    }
  }
  tryPromote(isOnHold.value);
}

const groupedNotifications = computed(() =>
  notifications.value.reduce(
    (groups, notification) => {
      const key = notification.group ?? '__ungrouped__';

      (groups[key] ??= []).push(notification);

      return groups;
    },
    {} as Record<string, Notification[]>,
  ),
);

export function _resetForTesting(): void {
  dismissAll();
  isOnHold.value = false;
  configNotifications.resetConfig();
  _clearAllTimersForTesting();
}

export function useNotifications() {
  return {
    notifications: readonly(notifications),
    queue: readonly(queue),
    isOnHold: readonly(isOnHold),
    notify,
    dismiss,
    dismissQueue,
    dismissVisible,
    dismissAll,
    holdNotifications,
    pauseTimer,
    resumeTimer,
    setMaxVisible,
    groupedNotifications,
  };
}
