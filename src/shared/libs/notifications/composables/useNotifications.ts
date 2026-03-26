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
  evictExcess,
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

function createNotification(message: string, options: NotificationOptions): Notification {
  return {
    id: uuidv4(),
    message,
    type: options.type ?? NotificationType.Info,
    priority: options.priority ?? NotificationPriority.Normal,
    duration: getEffectiveDuration(options, configNotifications.getDurationConfig()),
    group: options.group ?? null,
    actions: options.actions ?? [],
    createdAt: Date.now(),
    duplicateCount: 1,
    paused: false,
    remainingTime: null,
    startedAt: null,
    history: [],
  };
}

function updateExisting(
  target: Notification,
  message: string,
  options: Partial<NotificationOptions>,
  isVisible: boolean,
  onExpire: (id: string) => void,
  sourceHistory: Notification['history'] = [],
  addDuplicateCount: number = 1
): void {
  target.history.push(
    {
      ...target,
      actions: target.actions.map(action => ({ ...action })),
      history: [],
      id: uuidv4(),
    },
    ...sourceHistory
  );

  Object.assign(target, {
    message,
    type: options.type ?? target.type,
    actions: options.actions ?? target.actions,
    createdAt: Date.now(),
    duplicateCount: target.duplicateCount + addDuplicateCount,
  });

  if (!isVisible || !target.duration) return;

  if (target.paused) {
    target.remainingTime = target.duration;
  } else {
    clearTimer(target);
    startTimer(target, onExpire);
  }
}

function tryPromote(hold: boolean): void {
  if (hold) return;

  queue.value = queue.value.filter(queued => {
    if (!queued.group) return true;
    const visible = notifications.value.find(n => n.group === queued.group);
    
    if (visible) {
      updateExisting(
        visible,
        queued.message,
        { type: queued.type, actions: queued.actions },
        true,
        removeNotification,
        queued.history,
        queued.duplicateCount
      );
      
      return false;
    }

    return true;
  });

  promoteFromQueue(
    notifications.value,
    queue.value,
    configNotifications.getMaxVisible(),
    removeNotification
  );
}

function removeNotification(targetId: string): void {
  const index = notifications.value.findIndex(({ id }) => id === targetId);

  if (index === -1) return;

  clearTimer(notifications.value[index]);
  notifications.value.splice(index, 1);
  tryPromote(isOnHold.value);
}

function notify(message: string, options: NotificationOptions = {}): string {
  const group = options.group;

  if (group) {
    const visible = notifications.value.find(n => n.group === group);
    const queued = queue.value.find(n => n.group === group);

    if (isOnHold.value && visible) {
      if (queued) {
        updateExisting(queued, message, options, false, removeNotification);
        return queued.id;
      }
    } else {
      const target = visible || queued;
      if (target) {
        updateExisting(target, message, options, !!visible, removeNotification);
        return target.id;
      }
    }
  }

  const notification = createNotification(message, options);
  const maxVisible = configNotifications.getMaxVisible();
  const lowestVisible = notifications.value[notifications.value.length - 1];

  const canShowNow =
    !isOnHold.value &&
    (notifications.value.length < maxVisible ||
      (lowestVisible && notification.priority > lowestVisible.priority));

  if (canShowNow) {
    insertSorted(notifications.value, notification);
    evictExcess(notifications.value, queue.value, maxVisible);
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

  evictExcess(notifications.value, queue.value, maxVisible);
  tryPromote(isOnHold.value);
}

const groupedNotifications = computed(() =>
  notifications.value.reduce((groups, notification) => {
    const key = notification.group ?? '__ungrouped__';
    (groups[key] ??= []).push(notification);
    return groups;
  }, {} as Record<string, Notification[]>)
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