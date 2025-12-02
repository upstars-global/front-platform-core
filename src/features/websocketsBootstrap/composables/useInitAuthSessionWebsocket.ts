import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import { AuthWebsocketType, userWebsocketsEvents, userEvents } from '../../../entities/user';
import { onMounted } from 'vue';

function useInitAuthSessionWebsocketsBridge() {
  useWebsocketsBridge({
    emitter: userWebsocketsEvents,
    websocketConfigMap: {
      [AuthWebsocketType.SESSION_INVALIDATED]: {
        event: AuthWebsocketType.SESSION_INVALIDATED,
        verifyTimestamp: true,
      },
    },
  });
}

function useInitAuthSessionWebsocketsHandlers() {
  function handleSessionInvalidate() {
    userEvents.emit('users.session.invalidate');
  }

  onMounted(() => {
    userWebsocketsEvents.on(AuthWebsocketType.SESSION_INVALIDATED, handleSessionInvalidate);
  });
}

export function useInitAuthSessionWebsocket() {
  useInitAuthSessionWebsocketsBridge();
  useInitAuthSessionWebsocketsHandlers();
}
