import mitt from 'mitt';
import type { UserWebsocketsEvents } from './types';

export const userWebsocketsEvents = mitt<UserWebsocketsEvents>();
