import mitt from 'mitt';
import type { UserBalanceWebsockets } from './types';

export const userBalanceWebsocketsEmitter = mitt<UserBalanceWebsockets>();
