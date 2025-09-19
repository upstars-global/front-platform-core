import { onBeforeUnmount, onMounted } from 'vue';
import type { Emitter } from 'mitt';
import { websocketsEmitter } from '../controller';
import { useWebsocketsTimestampsStore } from './websocketsTimestampStore';

type WebsocketEventConfig<T> = {
  event: T;
  verifyTimestamp: boolean;
}
export type WebsocketsBridgeParams<T extends Record<string, Record<string, unknown>>> = {
  emitter: Emitter<T>;
  websocketConfigMap: Record<string, WebsocketEventConfig<keyof T>>;
};

export function useWebsocketsBridge<T extends Record<string, Record<string, unknown>>>(
  params: WebsocketsBridgeParams<T>,
) {
  const websocketsTimestampsStore = useWebsocketsTimestampsStore();
  const handlers: Record<string, (arg: Record<string, unknown>) => void> = {};

  function verifyTimestamp<K extends keyof T>(event: K, data: Record<string, unknown>) {
    if (typeof data.timestamp === 'number') {
      return websocketsTimestampsStore.verifyEventTimestamp(event as string, data.timestamp);
    }
    return true;
  }

  function createTimestampHandler<K extends keyof T>(eventConfig: WebsocketEventConfig<K>) {
    return (data: Record<string, unknown>) => {
      if (!eventConfig.verifyTimestamp || verifyTimestamp(eventConfig.event, data)) {
        params.emitter.emit(eventConfig.event, data as T[K]);
      }
    };
  }

  onMounted(() => {
    for (const websocketEvent in params.websocketConfigMap) {
      const emitterEventConfig = params.websocketConfigMap[websocketEvent];
      const handler = createTimestampHandler(emitterEventConfig);
      websocketsEmitter.on(websocketEvent, handler);
      handlers[websocketEvent] = handler;
    }
  });
  onBeforeUnmount(() => {
    Object.entries(handlers).forEach(([ event, handler ]) => {
      websocketsEmitter.off(event, handler);
    });
  });
}
