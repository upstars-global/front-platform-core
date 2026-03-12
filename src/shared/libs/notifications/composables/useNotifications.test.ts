import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNotifications, _resetForTesting } from './useNotifications';
import { NotificationType, NotificationPriority } from '../types';
import { configNotifications } from '../config';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetForTesting();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('notify', () => {
    it('adds a notification to the visible list', () => {
      const { notify, notifications } = useNotifications();

      notify('Hello');

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].message).toBe('Hello');
    });

    it('returns a unique id', () => {
      const { notify } = useNotifications();

      const id1 = notify('one');
      const id2 = notify('two');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('uses default type Info when not specified', () => {
      const { notify, notifications } = useNotifications();

      notify('test');

      expect(notifications.value[0].type).toBe(NotificationType.Info);
    });

    it('uses custom type when specified', () => {
      const { notify, notifications } = useNotifications();

      notify('error!', { type: NotificationType.Error });

      expect(notifications.value[0].type).toBe(NotificationType.Error);
    });

    it('uses default priority Normal when not specified', () => {
      const { notify, notifications } = useNotifications();

      notify('test');

      expect(notifications.value[0].priority).toBe(NotificationPriority.Normal);
    });

    it('stores actions on the notification', () => {
      const handler = vi.fn();
      const { notify, notifications } = useNotifications();

      notify('retry?', { actions: [{ label: 'Retry', handler }] });

      expect(notifications.value[0].actions).toHaveLength(1);
      expect(notifications.value[0].actions[0].label).toBe('Retry');

      notifications.value[0].actions[0].handler();

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  describe('dismiss', () => {
    it('removes a notification by id', () => {
      const { notify, dismiss, notifications } = useNotifications();

      const id = notify('test');
      expect(notifications.value).toHaveLength(1);

      dismiss(id);

      expect(notifications.value).toHaveLength(0);
    });

    it('removes from queue if not visible', () => {
      configNotifications.setMaxVisible(1);
      const { notify, dismiss, queue } = useNotifications();

      notify('first');
      const id = notify('second');

      expect(queue.value).toHaveLength(1);

      dismiss(id);

      expect(queue.value).toHaveLength(0);
    });

    it('promotes next from queue after dismiss', () => {
      configNotifications.setMaxVisible(1);
      const { notify, dismiss, notifications, queue } = useNotifications();

      const id1 = notify('first');
      notify('second');

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(1);

      dismiss(id1);

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].message).toBe('second');
      expect(queue.value).toHaveLength(0);
    });

    it('does nothing for non-existent id', () => {
      const { notify, dismiss, notifications } = useNotifications();
      notify('test');

      dismiss('non-existent-id');

      expect(notifications.value).toHaveLength(1);
    });
  });

  describe('dismissAll', () => {
    it('clears all notifications and queue', () => {
      configNotifications.setMaxVisible(1);
      const { notify, dismissAll, notifications, queue } = useNotifications();

      notify('a');
      notify('b');
      notify('c');

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(2);

      dismissAll();

      expect(notifications.value).toHaveLength(0);
      expect(queue.value).toHaveLength(0);
    });
  });

  describe('auto-dismiss', () => {
    it('removes notification after default duration', () => {
      configNotifications.setDefaultDuration(3000);
      const { notify, notifications } = useNotifications();

      notify('test');

      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(3000);

      expect(notifications.value).toHaveLength(0);
    });

    it('does not auto-dismiss persistent notifications', () => {
      const { notify, notifications } = useNotifications();

      notify('persistent', { persistent: true });

      vi.advanceTimersByTime(60_000);

      expect(notifications.value).toHaveLength(1);
    });

    it('does not auto-dismiss when duration is null', () => {
      const { notify, notifications } = useNotifications();

      notify('sticky', { duration: null });

      vi.advanceTimersByTime(60_000);

      expect(notifications.value).toHaveLength(1);
    });

    it('respects custom duration per notification', () => {
      const { notify, notifications } = useNotifications();

      notify('fast', { duration: 1000 });

      vi.advanceTimersByTime(1000);

      expect(notifications.value).toHaveLength(0);
    });

    it('respects durationByType config', () => {
      configNotifications.setDefaultDuration(5000);
      configNotifications.setDurationByType({ [NotificationType.Error]: 10_000 });
      const { notify, notifications } = useNotifications();

      notify('error msg', { type: NotificationType.Error });

      vi.advanceTimersByTime(5000);
      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(5000);
      expect(notifications.value).toHaveLength(0);
    });

    it('promotes from queue after auto-dismiss', () => {
      configNotifications.setMaxVisible(1);
      configNotifications.setDefaultDuration(2000);
      const { notify, notifications, queue } = useNotifications();

      notify('first');
      notify('second');

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(1);

      vi.advanceTimersByTime(2000);

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].message).toBe('second');
      expect(queue.value).toHaveLength(0);
    });
  });

  describe('duplicate control', () => {
    it('increments duplicateCount for same group instead of adding duplicate', () => {
      const { notify, notifications } = useNotifications();

      notify('same message', { group: 'dup-1' });
      notify('same message', { group: 'dup-1' });
      notify('same message', { group: 'dup-1' });

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].duplicateCount).toBe(3);
    });

    it('returns the existing id for duplicates', () => {
      const { notify } = useNotifications();

      const id1 = notify('msg', { group: 'dup-1' });
      const id2 = notify('msg', { group: 'dup-1' });

      expect(id1).toBe(id2);
    });

    it('allows different groups', () => {
      const { notify, notifications } = useNotifications();

      notify('msg A', { group: 'key-a' });
      notify('msg B', { group: 'key-b' });

      expect(notifications.value).toHaveLength(2);
    });

    it('detects duplicates in queue as well', () => {
      configNotifications.setMaxVisible(1);
      const { notify, queue } = useNotifications();

      notify('first');
      notify('queued', { group: 'q-dup' });
      notify('queued again', { group: 'q-dup' });

      expect(queue.value).toHaveLength(1);
      expect(queue.value[0].duplicateCount).toBe(2);
    });

    it('notifications without group are never deduplicated', () => {
      const { notify, notifications } = useNotifications();

      notify('same message');
      notify('same message');

      expect(notifications.value).toHaveLength(2);
    });

    it('restarts timer when duplicate arrives and notification is visible', () => {
      configNotifications.setDefaultDuration(5000);
      const { notify, notifications } = useNotifications();

      notify('msg', { group: 'g1' });

      vi.advanceTimersByTime(4000);
      notify('msg', { group: 'g1' });

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].duplicateCount).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(4000);
      expect(notifications.value).toHaveLength(0);
    });

    it('does not start timer when duplicate is in queue', () => {
      configNotifications.setMaxVisible(1);
      configNotifications.setDefaultDuration(2000);
      const { notify, notifications } = useNotifications();

      notify('first');
      notify('queued', { group: 'q-dup' });
      notify('queued again', { group: 'q-dup' });

      vi.advanceTimersByTime(2000);

      expect(notifications.value).toHaveLength(1);
      
      expect(notifications.value[0].message).toBe('queued again');
      
      expect(notifications.value[0].history).toHaveLength(1);
      expect(notifications.value[0].history[0].message).toBe('queued');
      
      expect(notifications.value[0].duplicateCount).toBe(2);

      vi.advanceTimersByTime(2000);
      expect(notifications.value).toHaveLength(0);
    });

    it('creates a flat history snapshot for multiple duplicates', () => {
      const { notify, notifications } = useNotifications();

      notify('first', { group: 'stack', type: NotificationType.Info });
      notify('second', { group: 'stack', type: NotificationType.Success });
      notify('third', { group: 'stack' });

      const item = notifications.value[0];
      expect(item.message).toBe('third');
      expect(item.type).toBe(NotificationType.Success);
      expect(item.duplicateCount).toBe(3);
      expect(item.history).toHaveLength(2);

      expect(item.history[0].message).toBe('first');
      expect(item.history[0].type).toBe(NotificationType.Info);
      expect(item.history[0].history).toEqual([]); 

      expect(item.history[1].message).toBe('second');
      expect(item.history[1].type).toBe(NotificationType.Success);
      
      expect(item.history[0].id).not.toBe(item.history[1].id);
    });
  });

  describe('hold notifications', () => {
    it('queues new notifications when on hold', () => {
      const { notify, notifications, queue, holdNotifications } = useNotifications();

      holdNotifications(true);
      notify('held');

      expect(notifications.value).toHaveLength(0);
      expect(queue.value).toHaveLength(1);
    });

    it('promotes queued notifications when released', () => {
      const { notify, notifications, queue, holdNotifications } = useNotifications();

      holdNotifications(true);
      notify('held 1');
      notify('held 2');

      holdNotifications(false);

      expect(notifications.value).toHaveLength(2);
      expect(queue.value).toHaveLength(0);
    });

    it('exposes isOnHold as reactive ref', () => {
      const { isOnHold, holdNotifications } = useNotifications();

      expect(isOnHold.value).toBe(false);

      holdNotifications(true);

      expect(isOnHold.value).toBe(true);
    });

    it('starts timers for promoted notifications when released', () => {
      configNotifications.setDefaultDuration(3000);
      const { notify, notifications, holdNotifications } = useNotifications();

      holdNotifications(true);
      notify('held');
      holdNotifications(false);

      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(3000);

      expect(notifications.value).toHaveLength(0);
    });
  });

  describe('queue management', () => {
    it('queues when maxVisible is reached', () => {
      configNotifications.setMaxVisible(2);
      const { notify, notifications, queue } = useNotifications();

      notify('1');
      notify('2');
      notify('3');

      expect(notifications.value).toHaveLength(2);
      expect(queue.value).toHaveLength(1);
    });

    it('setMaxVisible increases capacity and promotes', () => {
      configNotifications.setMaxVisible(1);
      const { notify, notifications, queue, setMaxVisible } = useNotifications();

      notify('a');
      notify('b');
      notify('c');

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(2);

      setMaxVisible(3);

      expect(notifications.value).toHaveLength(3);
      expect(queue.value).toHaveLength(0);
    });

    it('setMaxVisible decreases capacity and evicts to queue', () => {
      configNotifications.setMaxVisible(3);
      const { notify, notifications, queue, setMaxVisible } = useNotifications();

      notify('a');
      notify('b');
      notify('c');

      expect(notifications.value).toHaveLength(3);

      setMaxVisible(1);

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(2);
    });

    it('setMaxVisible enforces minimum of 1', () => {
      configNotifications.setMaxVisible(3);
      const { notify, notifications, setMaxVisible } = useNotifications();

      notify('a');
      notify('b');

      setMaxVisible(0);

      expect(notifications.value).toHaveLength(1);
    });

    it('does not promote from queue when setMaxVisible is called while on hold', () => {
      configNotifications.setMaxVisible(1);
      const { notify, notifications, queue, holdNotifications, setMaxVisible } = useNotifications();

      notify('a');
      notify('b'); 

      holdNotifications(true); 
      setMaxVisible(5); 

      expect(notifications.value).toHaveLength(1);
      expect(queue.value).toHaveLength(1); 
    });
  });

  describe('priority', () => {
    it('higher priority notification appears first', () => {
      const { notify, notifications } = useNotifications();

      notify('low', { priority: NotificationPriority.Low });
      notify('critical', { priority: NotificationPriority.Critical });

      expect(notifications.value[0].message).toBe('critical');
      expect(notifications.value[1].message).toBe('low');
    });

    it('same priority preserves insertion order', () => {
      const { notify, notifications } = useNotifications();

      notify('first', { priority: NotificationPriority.Normal });
      notify('second', { priority: NotificationPriority.Normal });

      expect(notifications.value[0].message).toBe('first');
      expect(notifications.value[1].message).toBe('second');
    });

    it('high priority evicts low priority when at maxVisible', () => {
      configNotifications.setMaxVisible(2);
      const { notify, notifications, queue } = useNotifications();

      notify('low', { priority: NotificationPriority.Low });
      notify('normal', { priority: NotificationPriority.Normal });
      notify('critical', { priority: NotificationPriority.Critical });

      expect(notifications.value).toHaveLength(2);
      expect(notifications.value[0].message).toBe('critical');
      expect(notifications.value[1].message).toBe('normal');
      expect(queue.value).toHaveLength(1);
      expect(queue.value[0].message).toBe('low');
    });

    it('queue respects priority order', () => {
      configNotifications.setMaxVisible(1);
      const { notify, notifications, queue } = useNotifications();

      notify('normal', { priority: NotificationPriority.Normal });
      notify('low-a', { priority: NotificationPriority.Low });
      notify('low-b', { priority: NotificationPriority.Low });

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].message).toBe('normal');
      expect(queue.value).toHaveLength(2);
      expect(queue.value[0].message).toBe('low-a');
      expect(queue.value[1].message).toBe('low-b');
    });

    it('higher priority displaces lower priority from visible list', () => {
      configNotifications.setMaxVisible(1);
      const { notify, notifications, queue } = useNotifications();

      notify('normal', { priority: NotificationPriority.Normal });
      notify('high', { priority: NotificationPriority.High });

      expect(notifications.value).toHaveLength(1);
      expect(notifications.value[0].message).toBe('high');
      expect(queue.value).toHaveLength(1);
      expect(queue.value[0].message).toBe('normal');
    });

    it('clears timer of evicted notification when displaced by high priority', () => {
      configNotifications.setMaxVisible(1);
      configNotifications.setDefaultDuration(5000);
      const { notify, notifications, queue } = useNotifications();

      notify('normal', { priority: NotificationPriority.Normal });
      vi.advanceTimersByTime(2000); 

      notify('high', { priority: NotificationPriority.High });

      expect(notifications.value[0].message).toBe('high');
      expect(queue.value[0].message).toBe('normal');

      vi.advanceTimersByTime(4000);
      
      expect(queue.value).toHaveLength(1);
    });
  });

  describe('pause on hover', () => {
    it('pauses auto-dismiss timer', () => {
      configNotifications.setDefaultDuration(3000);
      const { notify, notifications, pauseTimer } = useNotifications();

      const id = notify('test');

      vi.advanceTimersByTime(1000);
      pauseTimer(id);
      vi.advanceTimersByTime(10_000);

      expect(notifications.value).toHaveLength(1);
    });

    it('resumes timer with remaining time', () => {
      configNotifications.setDefaultDuration(4000);
      const { notify, notifications, pauseTimer, resumeTimer } = useNotifications();

      const id = notify('test');

      vi.advanceTimersByTime(1000);
      pauseTimer(id);

      vi.advanceTimersByTime(10_000);
      expect(notifications.value).toHaveLength(1);

      resumeTimer(id);

      vi.advanceTimersByTime(2999);
      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(notifications.value).toHaveLength(0);
    });

    it('does nothing for persistent notifications', () => {
      const { notify, notifications, pauseTimer, resumeTimer } = useNotifications();

      const id = notify('persistent', { persistent: true });

      pauseTimer(id);
      resumeTimer(id);

      vi.advanceTimersByTime(60_000);
      expect(notifications.value).toHaveLength(1);
    });

    it('does nothing for non-existent id', () => {
      configNotifications.setDefaultDuration(3000);
      const { notify, notifications, pauseTimer, resumeTimer } = useNotifications();

      notify('test');

      pauseTimer('non-existent');
      resumeTimer('non-existent');

      vi.advanceTimersByTime(3000);
      expect(notifications.value).toHaveLength(0);
    });

    it('marks notification as paused', () => {
      configNotifications.setDefaultDuration(5000);
      const { notify, notifications, pauseTimer } = useNotifications();

      const id = notify('test');

      expect(notifications.value[0].paused).toBe(false);

      pauseTimer(id);

      expect(notifications.value[0].paused).toBe(true);
    });

    it('multiple pause calls are idempotent', () => {
      configNotifications.setDefaultDuration(5000);
      const { notify, notifications, pauseTimer } = useNotifications();

      const id = notify('test');

      vi.advanceTimersByTime(1000);
      pauseTimer(id);
      pauseTimer(id);

      vi.advanceTimersByTime(60_000);
      expect(notifications.value).toHaveLength(1);
    });

    it('updates remainingTime but does not start timer if duplicate arrives while paused', () => {
      configNotifications.setDefaultDuration(5000);
      const { notify, notifications, pauseTimer, resumeTimer } = useNotifications();

      const id = notify('msg', { group: 'g1' });
      
      vi.advanceTimersByTime(2000); 
      pauseTimer(id); 

      notify('msg 2', { group: 'g1' }); 
      
      expect(notifications.value[0].paused).toBe(true);

      vi.advanceTimersByTime(10000); 
      expect(notifications.value).toHaveLength(1); 

      resumeTimer(id); 

      vi.advanceTimersByTime(4999);
      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(1); 
      expect(notifications.value).toHaveLength(0); 
    });
  });

  describe('grouping', () => {
    it('groups notifications by group key', () => {
      const { notify, groupedNotifications } = useNotifications();

      notify('a', { group: 'auth' });
      notify('b', { group: 'payment' });

      expect(groupedNotifications.value['auth']).toHaveLength(1);
      expect(groupedNotifications.value['payment']).toHaveLength(1);
    });

    it('ungrouped notifications go to __ungrouped__', () => {
      const { notify, groupedNotifications } = useNotifications();

      notify('no group');

      expect(groupedNotifications.value['__ungrouped__']).toHaveLength(1);
    });

    it('updates dynamically when notifications change', () => {
      const { notify, dismiss, groupedNotifications } = useNotifications();

      const id = notify('a');
      notify('b');

      expect(groupedNotifications.value['__ungrouped__']).toHaveLength(2);

      dismiss(id);

      expect(groupedNotifications.value['__ungrouped__']).toHaveLength(1);
    });

    it('duplicate within group increments count and stays in same group', () => {
      const { notify, groupedNotifications, notifications } = useNotifications();

      notify('msg', { group: 'auth' });
      notify('msg', { group: 'auth' });

      expect(groupedNotifications.value['auth']).toHaveLength(1);
      expect(notifications.value[0].duplicateCount).toBe(2);
    });
  });

  describe('singleton behavior', () => {
    it('shares state between multiple useNotifications() calls', () => {
      const instance1 = useNotifications();
      const instance2 = useNotifications();

      instance1.notify('from instance 1');

      expect(instance2.notifications.value).toHaveLength(1);
      expect(instance2.notifications.value[0].message).toBe('from instance 1');
    });
  });

  describe('configNotifications', () => {
    it('setDefaultDuration changes duration for new notifications', () => {
      configNotifications.setDefaultDuration(8000);
      const { notify, notifications } = useNotifications();

      notify('test');

      vi.advanceTimersByTime(5000);
      expect(notifications.value).toHaveLength(1);

      vi.advanceTimersByTime(3000);
      expect(notifications.value).toHaveLength(0);
    });

    it('resetConfig restores defaults', () => {
      configNotifications.setMaxVisible(1);
      configNotifications.setDefaultDuration(1000);
      configNotifications.resetConfig();

      expect(configNotifications.getMaxVisible()).toBe(5);
      expect(configNotifications.getDefaultDuration()).toBe(5000);
    });

    it('setMaxVisible clamps to minimum 1', () => {
      configNotifications.setMaxVisible(0);

      expect(configNotifications.getMaxVisible()).toBe(1);
    });
  });
});
