### WebSocket setup in applications
__IMPORTANT!__ This package uses WebSockets in the browser environment only!

You only need to set the event bus (kept for backward compatibility) and, if needed, `hostnameAndProtocol` (e.g., to use WebSockets locally).

To configure, use `configWebsocket`:

```typescript
// in app configuration before using websockets
configWebsocket.bus(eventBus);
configWebsocket.hostnameAndProtocol(DEV ? `ws://localhost:3000` : null);
```

### How to use websockets

`websocketController` emits all events through the provided event bus and through `websocketsEmitter`.
Use only `websocketsEmitter`; the provided event bus is kept solely for backward compatibility and will be removed.

`websocketsEmitter` emits all WebSocket events with their payloads. Event names exactly match the event types.
(previously, a `websocket.` prefix was added; this prefix is still used on the legacy event bus for backward compatibility)

Events and payloads are untyped because `websocketController` operates at a global level and should not depend on feature-scoped logic. To add type safety, map raw events to your local typed emitters via the bridge. See the [Bridge documentation](./bridge/readme.md).
