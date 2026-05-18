import { publicApiV1 } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type { DICreateErrorResource, DICreateSuccessResource, DIInfoResource } from './types';

export const depositInsuranceAPI = {
  async info() {
    try {
      return await publicApiV1<DIInfoResource>({
        url: 'deposit-insurance/info',
        secured: true,
        type: () => `PublicApi.V1.Secured.DepositInsurance.Info`,
      });
    } catch (error) {
      log.error('DEPOSIT_INSURANCE_INFO', error);
    }
  },

  async create() {
    try {
      return await publicApiV1<DICreateSuccessResource | DICreateErrorResource>({
        url: 'deposit-insurance/create',
        secured: true,
        type: () => 'PublicApi.V1.Secured.DepositInsurance.Create',
      });
    } catch (error) {
      log.error('DEPOSIT_INSURANCE_CREATE', error);
    }
  },
};
