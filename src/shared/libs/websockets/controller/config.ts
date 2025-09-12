import type { EventBus } from '../../../types';

let bus: EventBus | null = null;
let hostnameAndProtocol: string | null = null;

export function getWebsocketsConfig() {
  if (!bus) {
    throw new Error('websocket config: bus not defined');
  }

  return {
    bus,
    hostnameAndProtocol,
  };
}

export const configWebsockets = {
  bus: (value: EventBus) => {
    bus = value;
  },
  hostnameAndProtocol: (value: string | null) => {
    hostnameAndProtocol = value;
  },
};

export const DEFAULT_TIME_RECONNECT = 1000;
export const MAX_TIME_RECONNECT = 60000;
export const RECONNECTION_TIME_MULTIPLIER = 2;
