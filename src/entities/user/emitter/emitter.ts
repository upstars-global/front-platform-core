import mitt from 'mitt';
import type { UserEvents } from './types';

export const userEvents = mitt<UserEvents>();
