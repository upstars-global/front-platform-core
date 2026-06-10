import { useInitUserProgressionsWebsockets } from './useInitUserProgressionsWebsockets';
import { useInitAuthSessionWebsocket } from './useInitAuthSessionWebsocket';
import  { useInitStatusVipSettingWebsockets } from "./useInitStatusVipSettingWebsockets"
import { useInitTournamentAutoChoiceWebsocket } from './useInitTournamentAutoChoiceWebsocket';

export function useWebsocketsBootstrap() {
  useInitUserProgressionsWebsockets();
  useInitAuthSessionWebsocket();
  useInitStatusVipSettingWebsockets();
  useInitTournamentAutoChoiceWebsocket();
}
