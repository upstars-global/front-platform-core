import { jsonHttp } from '../../../shared/libs/http';
import type { IClientContextResource } from './types';
import { log } from '../../../shared/helpers/log';

export const contextAPI = {
  async getClientContext() {
    try {
      return await jsonHttp<IClientContextResource>('/client-context', {}, { baseURL: '/' });
    } catch (error) {
      log.error('LOAD_CLIENT_CONTEXT', error);
      throw error;
    }
  },
};
