import mitt from 'mitt';
import type { AuthEvents } from './types';

export const authEvents = mitt<AuthEvents>();
