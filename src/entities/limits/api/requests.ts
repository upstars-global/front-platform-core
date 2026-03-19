import { log } from '../../../shared/helpers/log';
import { publicApiV1 } from '../../../shared/libs/http';
import type {
  LimitType,
  ILimitResource,
  IDisableLimitDTO,
  IManageLimitDTO,
  ISelfExclusionActivateDTO, CoolingOffActivateDTO,
} from './types';

export const limitsAPI = {
  async getActiveLimits<T extends LimitType = LimitType>(type: T) {
    try {
      const { data } = await publicApiV1<Array<ILimitResource<T>>>({
        type: () => 'PublicApi.V1.Json.Limit.Active.List',
        url: '/action/limit/active-list',
        secured: true,
        data: {
          filter: {
            search: type,
          },
        },
      });
      return data || [];
    } catch (error) {
      log.error('GET_ACTIVE_LIMITS', error);
    }
    return [];
  },

  async createLimit<T extends LimitType = LimitType>(params: IManageLimitDTO<T>) {
    try {
      return await publicApiV1<ILimitResource<T>>({
        type: () => 'PublicApi.V1.Json.Limit.Create',
        url: '/action/limit/create',
        secured: true,
        data: {
          data: params,
        },
      });
    } catch (error) {
      log.error('CREATE_LIMIT', error);
      throw error;
    }
  },

  async updateLimit<T extends LimitType = LimitType>(params: IManageLimitDTO<T>) {
    try {
      return await publicApiV1<ILimitResource<T>>({
        type: () => 'PublicApi.V1.Json.Limit.Update',
        url: '/action/limit/update',
        secured: true,
        data: {
          data: params,
        },
      });
    } catch (error) {
      log.error('UPDATE_LIMIT', error);
      throw error;
    }
  },

  async disableLimit<T extends LimitType = LimitType>(params: IDisableLimitDTO<T>) {
    try {
      return await publicApiV1<ILimitResource<T>>({
        type: () => 'PublicApi.V1.Json.Limit.Disable',
        url: '/action/limit/disable',
        secured: true,
        data: {
          data: params,
        },
      });
    } catch (error) {
      log.error('DISABLE_LIMIT', error);
      throw error;
    }
  },

  async initCoolingOff() {
    try {
      return await publicApiV1({
        type: () => 'PublicApi.V1.Json.Limit.Self.Exclusion.Init',
        url: '/action/limit/self-exclusion/init',
        secured: true,
        data: {
          data: {
            type: 'self-exclusion',
          },
        },
      });
    } catch (error) {
      log.error('INIT_COOLING_OFF_ERROR', error);
    }
  },

  async resendCoolingOffEmail() {
    try {
      return await publicApiV1({
        type: () => 'PublicApi.V1.Json.Limit.Resend.Cooling.Off.Email',
        url: '/action/limit/resend/email',
        secured: true,
      });
    } catch (error) {
      log.error('RESEND_COOLING_OFF_EMAIL_ERROR', error);
    }
  },

  async resendSelfExclusionEmail() {
    try {
      return await publicApiV1({
        type: () => 'PublicApi.V1.Json.Limit.Resend.Self.Exclusion.Email',
        url: '/action/limit/resend/self-exclusion/email',
        secured: true,
      });
    } catch (error) {
      log.error('RESEND_SELF_EXCLUSION_EMAIL_ERROR', error);
    }
  },

  async activateCoolingOff(token: string) {
    try {
      const { data } = await publicApiV1<{
        success: boolean;
      }>({
        type: () => 'PublicApi.V1.Json.Limit.Cooling.Off.Activate',
        url: '/action/limit/cooling-off/activate',
        secured: true,
        data: {
          data: {
            token,
          },
        },
      });
      return data?.success || false;
    } catch (error) {
      log.error('ACTIVATE_COOLING_OFF_ERROR', error);
      return false;
    }
  },

  async coolingOffStandaloneActivate(params: CoolingOffActivateDTO) {
    try {
      const { data } = await publicApiV1<{
        success: boolean;
      }>({
        type: () => 'PublicApi.V1.CoolingOff.Standalone.Activate',
        url: '/action/limit/cooling-off/activate-standalone',
        secured: true,
        data: {
          data: params,
        },
      });
      return data?.success || false;
    } catch (error) {
      log.error('ACTIVATE_COOLING_OFF_STANDALONE_ERROR', error);
      return false;
    }
  },

  async checkSelfExclusionToken(token: string) {
    try {
      const { data } = await publicApiV1<{
        isAvailableLink: boolean;
      }>({
        type: () => 'PublicApi.V1.Json.Limit.Self.Exclusion.Check',
        url: '/action/limit/self-exclusion/check',
        secured: true,
        data: {
          data: {
            token,
          },
        },
      });
      return data?.isAvailableLink || false;
    } catch (error) {
      log.error('CHECK_SELF_EXCLUSION_TOKEN_ERROR', error);
      return false;
    }
  },

  async selfExclusionActivate(params: ISelfExclusionActivateDTO) {
    try {
      const { data } = await publicApiV1<{
        success: boolean;
      }>({
        type: () => 'PublicApi.V1.Json.Limit.Self.Exclusion.Activate',
        url: '/action/limit/self-exclusion/activate',
        secured: true,
        data: {
          data: params,
        },
      });
      return data?.success || false;
    } catch (error) {
      log.error('SELF_EXCLUSION_ACTIVATE_ERROR', error);
      return false;
    }
  },
};
