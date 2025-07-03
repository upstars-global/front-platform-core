import type { UserProfileResource } from '../api';

export type UserEvents = {
  'user.data.received': void;
  'profile.loaded': UserProfileResource;
};
