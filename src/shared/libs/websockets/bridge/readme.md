## Purpose & Example `useWebsocketsBridge`

### Purpose

`useWebsocketBridge` subscribes to global websocket events source and re-emits mapped events into a local, strictly typed emitter. It can also verify a timestamp on each payload to drop stale or out-of-order updates, ensuring consistent, idempotent state.

__IMPORTANT!__ Ensure only one instance of the bridge per configuration. It’s not a singleton! Creating it twice with the same config will result in duplicate event emissions.

### Example

```typescript
// entities/cashbox/websockets/types.ts
export type BalanceWebsockets = {
  'mapped.balance.changed': {
    timestamp: number;
    newBalance: number;
    prevBalance: number;
  };
  'mapped.payout.created': {
    timestamp: number;
    id: number;
  }
};


// entities/cashbox/websockets/balanceWebsocketsEmitter.ts
import mitt from 'mitt';
import { BalanceWebsockets } from './types';

// you will use this emitter for subscribing to websockets in this scope
export const balanceWebsocketsEmitter = mitt<BalanceWebsockets>();


// entities/cashbox/websockets/useInitBalanceWebsockets.ts
import { useWebsocketsBridge } from './useWebsocketsBridge';
import { balanceWebsocketsEmitter } from './balanceWebsocketsEmitter';

export function useInitBalanceWebsockets() {
  useWebsocketsBridge({
    emitter: balanceWebsocketsEmitter,
    websocketConfigMap: {
      'real.websocket.event.balance.changed': {
        event: 'mapped.balance.changed',
        verifyTimestamp: true,
      },
      'real.websocket.event.payout.created': {
        event: 'mapped.payout.created',
        verifyTimestamp: true,
      }
    },
  });
}


// App.vue: somewhere in beginning of setup
useInitBalanceWebsockets();
```