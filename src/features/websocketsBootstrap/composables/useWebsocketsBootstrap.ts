import { useInitUserProgressionsWebsockets } from './useInitUserProgressionsWebsockets';
import { useInitAuthSessionWebsocket } from './useInitAuthSessionWebsocket';

export function useWebsocketsBootstrap() {
  useInitUserProgressionsWebsockets();
  useInitAuthSessionWebsocket();
}
