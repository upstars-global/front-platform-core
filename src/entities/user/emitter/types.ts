import type { UserProfileResource } from '../api';

export type UserEvents = {
  'user.data.received': void;
  'profile.loaded': UserProfileResource;
  'progressions.static.level-up': void;
  'progressions.dynamic.level-up': void;
  'progressions.dynamic.level-confirm': void;
};
