import { jsonHttp } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  IClientContextResource,
  IDigitainConfigResource,
  IFastTrackConfigResource,
  ILivespinsDataResource,
  ITopLeaders,
} from './resources';
import type { AppGlobalConfig, ReelsVersion, HreflangListConfig } from '../types';

export const configAPI = {
  async getFastTrack() {
    try {
      return await jsonHttp<IFastTrackConfigResource>('/fasttrack-config');
    } catch (error) {
      log.error('LOAD_FAST_TRACK_CONFIG', error);
    }
  },
  async getDigitain() {
    try {
      return await jsonHttp<IDigitainConfigResource>('/digitain-config');
    } catch (error) {
      log.error('LOAD_DIGITAIN_CONFIG', error);
    }
  },
  async getClientContext() {
    try {
      return await jsonHttp<IClientContextResource>('/client-context', {}, { baseURL: '/' });
    } catch (error) {
      log.error('LOAD_CLIENT_CONTEXT', error);
      throw error;
    }
  },
  async loadTopLeaders() {
    try {
      const data = await jsonHttp<ITopLeaders>('/fe-api/top-leaders', {
        method: 'POST',
      });
      return data || ({} as ITopLeaders);
    } catch (error) {
      log.error('LOAD_TOP_LEADERS', error);
    }

    return {} as ITopLeaders;
  },
  async loadLivespinsData() {
    try {
      const data = await jsonHttp<ILivespinsDataResource>('/fe-api/livespins-data', {
        method: 'GET',
      });
      return data || ({} as ILivespinsDataResource);
    } catch (error) {
      log.error('LOAD_LIVESPINS_DATA', error);
    }

    return {} as ILivespinsDataResource;
  },
  async loadAppGlobalConfig() {
    try {
      return await jsonHttp<AppGlobalConfig>('/fe-api/app-global-config?v2');
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
