import { log } from '../../../shared/helpers/log';
import { publicApiV1 } from '../../../shared/libs/http';
import type { PokerLaunchSessionResource } from './types';

export const pokerAPI = {
    async launchPokerSession() {
        try {
          const { data } = await publicApiV1<PokerLaunchSessionResource>({
            url: '/poker/session/create',
            secured: true,
            type: () => 'PublicApi.V1.Secured.Poker.Session.Create',
          })
  
          return data;
        } catch(error: unknown) {
          log.error('LAUNCH_POKER_SESSION', error);
          throw error;
        }
    },
}