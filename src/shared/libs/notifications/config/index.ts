import type { NotificationType } from '../types';

export interface DurationConfig {
  defaultDuration: number;
  durationByType: Partial<Record<NotificationType, number | null>>;
}

interface NotificationsState {
  maxVisible: number;
  defaultDuration: number;
  durationByType: Partial<Record<NotificationType, number | null>>;
}

const defaultState: NotificationsState = {
  maxVisible: 5,
  defaultDuration: 5000,
  durationByType: {},
};

let state: NotificationsState = { ...defaultState };

export const configNotifications = {
  getMaxVisible: (): number => state.maxVisible,
  setMaxVisible: (value: number) => {
    state = { ...state, maxVisible: Math.max(1, value) };
  },

  getDefaultDuration: (): number => state.defaultDuration,
  setDefaultDuration: (value: number) => {
    state = { ...state, defaultDuration: Math.max(0, value) };
  },

  getDurationByType: (): Partial<Record<NotificationType, number | null>> => state.durationByType,
  setDurationByType: (value: Partial<Record<NotificationType, number | null>>) => {
    const sanitized = Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        val === null ? null : Math.max(0, val),
      ]),
    );
    state = { ...state, durationByType: sanitized };
  },

  getDurationConfig: (): DurationConfig => ({
    defaultDuration: state.defaultDuration,
    durationByType: state.durationByType,
  }),

  resetConfig: () => {
    state = { ...defaultState };
  },
};
