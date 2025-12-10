import { jsonHttp } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  ClientContextResource,
  DigitainConfigResource,
  FastTrackConfigResource,
  TopLeaders,
} from './resources';
import type { AppGlobalConfig, ReelsVersion, HreflangListConfig } from '../types';

export const configAPI = {
  async getFastTrack() {
    try {
      return await jsonHttp<FastTrackConfigResource>('/fasttrack-config');
    } catch (error) {
      log.error('LOAD_FAST_TRACK_CONFIG', error);
    }
  },
  async getDigitain() {
    try {
      return await jsonHttp<DigitainConfigResource>('/digitain-config');
    } catch (error) {
      log.error('LOAD_DIGITAIN_CONFIG', error);
    }
  },
  async getClientContext() {
    try {
      return await jsonHttp<ClientContextResource>('/client-context', {}, { baseURL: '/' });
    } catch (error) {
      log.error('LOAD_CLIENT_CONTEXT', error);
      throw error;
    }
  },
  async loadTopLeaders() {
    try {
      const data = await jsonHttp<TopLeaders>('/fe-api/top-leaders', {
        method: 'POST',
      });
      return data || ({} as TopLeaders);
    } catch (error) {
      log.error('LOAD_TOP_LEADERS', error);
    }

    return {} as TopLeaders;
  },
  async loadAppGlobalConfig(version: string = 'v3') {
    try {
      return await jsonHttp<AppGlobalConfig>(`/fe-api/app-global-config?${version}`);
    } catch (error) {
      log.error('LOAD_APP_GLOBAL_CONFIG', error);
    }
  },
  async loadReelsVersion() {
    const DEFAULT_VERSION = 1;
    try {
      const data = await jsonHttp<ReelsVersion>('/fe-api/reels-version', {
        method: 'GET',
      });

      if (!data?.version) {
        return DEFAULT_VERSION;
      }
      return Number(data.version);
    } catch (error) {
      log.error('LOAD_REELS_VERSION', error);
    }

    return DEFAULT_VERSION;
  },
  async loadHreflangList(lang: string) {
    try {
      const data = await jsonHttp<HreflangListConfig>(`/fe-api/hreflangs?lang=${lang}`, {
        method: 'GET',
      });
      return data.hreflangList;
    } catch (error) {
      log.error('LOAD_HREFLANG_LIST', error);
    }
    return {};
  },
};
