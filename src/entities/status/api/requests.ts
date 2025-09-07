import { publicApiV1 } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type { StatusDataResources } from './types';

export const statusApi = {
  async loadStatusData() {
    try {
      const response = await publicApiV1<StatusDataResources>({
        url: '/vip/settings/read',
        secured: false,
        type: (securedType) => `Vip.V1.${securedType}.Settings.Read`,
      });
      return response.data;
    } catch (error) {
      log.error('LOAD_STATUS_DATA', error);
      throw error;
    }
  },
};
