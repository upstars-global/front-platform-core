import { useInitUserProgressionsWebsockets } from './useInitUserProgressionsWebsockets';
import { useInitAuthSessionWebsocket } from './useInitAuthSessionWebsocket';
import  { useInitStatusVipSettingWebsockets } from "./useInitStatusVipSettingWebsockets"

export function useWebsocketsBootstrap() {
  useInitUserProgressionsWebsockets();
  useInitAuthSessionWebsocket();
  useInitStatusVipSettingWebsockets();
}
