import { jsonApi, jsonHttp, publicApi, publicApiV1, publicApiV2 } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import {
  type ICreateContactResource,
  type UserProfileResource,
  type IUpdateUserProfileDTO,
  type IUserUpdateProfileResource,
  type IUserRestorePasswordResource,
  type IUserRestorePasswordDTO,
  type IUserContactsOnVerificationResource,
  type IUserNotificationResource,
  type IUserConsentsResource,
  type UserConsentDTO,
  type IUserBalanceResource,
  type IUserFeatureResource,
  type IUserBettingTokenResource,
  type IUserWinbackDataResource,
  VerificationTypes,
  type IUserKYCData,
  type IUserStrategiesResource,
  type IUserCallbackDataDTO,
  type IUserCallbackDataResource,
  type IUserFastTrackSIDResource,
  type IUserStatusResource,
} from './types';

export const userAPI = {
  // profile data
  async loadUserProfile() {
    try {
      const response = await publicApi<{
        data: UserProfileResource;
      }>('/profile', { method: 'GET' });
      return response.data;
    } catch (error) {
      log.error('LOAD_USER_PROFILE', error);
      throw error;
    }
  },
  async updateUserProfile(data: IUpdateUserProfileDTO) {
    try {
      return await publicApi<IUserUpdateProfileResource>('/profile', {
        method: 'PUT',
        data,
      });
    } catch (error) {
      log.error('UPDATE_USER_PROFILE', error);
      throw error;
    }
  },
  async addPhone(phone: string) {
    try {
      return await publicApiV1<ICreateContactResource>({
        url: '/contacts/contact/create',
        secured: true,
        type: (securedType) => `Contacts.V1.${securedType}.Contact.Create`,
        data: {
          data: {
            type: 'phone',
            value: phone,
          },
        },
      });
    } catch (error) {
      log.error('ADD_PHONE_API', error);
      throw error;
    }
  },
  async updateUserNickname(nickname: string) {
    try {
      return await publicApiV1({
        url: '/users/update',
        secured: true,
        type: (securedType) => `Users.${securedType}.User.Update`,
        data: {
          data: { nickname },
        },
      });
    } catch (error: unknown) {
      log.error('UPDATE_USER_NICKNAME', error);
      throw error;
    }
  },

  // password
  async restorePasswordRequest(login: string) {
    try {
      return await jsonApi<IUserRestorePasswordResource>('/users/restore-password/request', {
        data: {
          contact_value: login,
          contact_type: 'email',
        },
      });
    } catch (error) {
      log.error('RESTORE_PASSWORD_REQUEST', error);
      throw error;
    }
  },
  async restorePassword(data: IUserRestorePasswordDTO) {
    try {
      return await jsonApi<IUserRestorePasswordResource>('/users/restore-password/restore', { data });
    } catch (error) {
      log.error('RESTORE_PASSWORD', error);
      throw error;
    }
  },

  // verification
  async verifyEmail(email: string) {
    try {
      await jsonHttp(`/users/email-verification/request/${email}`, {
        method: 'POST',
      });
    } catch (error) {
      log.error('EMAIL_VERIFY proxy', error);
    }
  },
  async loadContactsOnVerification() {
    try {
      return await jsonApi<{
        data: IUserContactsOnVerificationResource[];
      }>('/players/contacts/onverification', { method: 'GET' });
    } catch (error) {
      log.error('LOAD_CONTACTS_ON_VERIFICATION', error);
      throw error;
    }
  },

  // notifications
  async loadUserNotification() {
    try {
      const { data } = await jsonApi<{
        data: IUserNotificationResource[];
      }>('/user-notifications', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('LOAD_USER_NOTIFICATION', error);
      throw error;
    }
  },
  async readUserNotification(id: string) {
    try {
      const { data } = await jsonApi<{
        data: {
          id: string;
        };
      }>(`/user-notifications/read/${id}`);
      return data;
    } catch (error) {
      log.error('READ_USER_NOTIFICATION', error);
      throw error;
    }
  },

  // consents
  async loadUserConsents(token?: string) {
    try {
      const url = token ? `/anon/consents?token=${token}` : '/user/consents';
      return await publicApi<IUserConsentsResource>(url, { method: 'GET' });
    } catch (error) {
      log.error('LOAD_USER_CONSENTS', error);
      throw error;
    }
  },
  async updateUserConsents(data: UserConsentDTO[], token?: string) {
    try {
      const url = token ? `/anon/consents?token=${token}` : '/user/consents';
      const method = token ? 'PATCH' : 'PUT';
      return await publicApi<IUserConsentsResource>(url, {
        method,
        data: {
          consents: data,
        },
      });
    } catch (error) {
      log.error('UPDATE_USER_CONSENTS', error);
      throw error;
    }
  },

  // chats
  async loadFreshchatRestoreId(userId: string, project: string) {
    try {
      const { data } = await publicApiV1<{ restoreId: string }>({
        url: '/restore-id/get',
        secured: true,
        type: () => 'PublicApi.V1.Secured.RestoreId.Get',
        data: {
          data: {
            internalId: userId,
            project,
          },
        },
      });

      return data?.restoreId;
    } catch (error) {
      log.error('LOAD_FRESHCHAT_RESTORE_ID', error);
    }
  },
  async setFreshchatRestoreId(userId: string, restoreId: string, project: string) {
    try {
      await publicApiV1<void>({
        url: '/restore-id/set',
        secured: true,
        type: () => 'PublicApi.V1.Secured.RestoreId.Set',
        data: {
          data: {
            restoreId,
            project,
            internalId: userId,
          },
        },
      });
    } catch (error) {
      log.error('SET_FRESHCHAT_RESTORE_ID', error);
    }
  },

  // balance
  async loadUserBalance() {
    try {
      const { data } = await jsonApi<{ data: IUserBalanceResource }>('users/balance', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('LOAD_USER_BALANCE', error);
      throw error;
    }
  },

  // other
  async loadUserFeatures() {
    try {
      return await publicApi<IUserFeatureResource[]>('/features/available-features', { method: 'GET' });
    } catch (error) {
      log.error('LOAD_USER_FEATURES', error);
    }
    return [];
  },
  async loadUserBettingToken() {
    try {
      return await publicApi<IUserBettingTokenResource>('/betting/token', { method: 'GET' });
    } catch (error) {
      log.error('LOAD_USER_BETTING_TOKEN', error);
      throw error;
    }
  },
  async loadWinbackData() {
    try {
      const response = await publicApiV1<IUserWinbackDataResource>({
        url: '/winback/get',
        secured: true,
        type: (securedType) => `Winback.${securedType}.Winback.Get`,
      });
      return response.data;
    } catch (error) {
      log.error('LOAD_WINBACK_DATA', error);
      throw error;
    }
  },
  async loadKYCData(paymentMethodId?: string) {
    try {
      const verificationType = paymentMethodId ? VerificationTypes.PAYMENT_METHOD : VerificationTypes.IDENTITY;

      const response = await publicApiV2<IUserKYCData>({
        url: 'kyc-verification/access-token',
        secured: true,
        type: () => 'Ronda.V2.PublicSecured.GetAccessToken',
        data: {
          data: {
            verificationType,
            paymentMethodId,
          },
        },
      });
      return response.data;
    } catch (error) {
      log.error('LOAD_KYC_DATA', error);
      throw error;
    }
  },
  async loadRefcodeTypes() {
    try {
      const response = await publicApiV1<{
        types: string[];
      }>({
        url: '/refcodes/types',
        type: () => 'Refcode.Public.Refcodes.Types',
      });
      return response.data?.types || [];
    } catch (error) {
      log.error('LOAD_REFCODE_TYPES', error);
    }
    return [];
  },
  async loadUserStrategies() {
    try {
      const response = await publicApiV1<{
        strategies: IUserStrategiesResource;
      }>({
        url: '/users/identifier',
        type: () => 'user.identifier.config',
        secured: true,
      });
      return response.data?.strategies || {};
    } catch (error) {
      log.error('LOAD_USER_STRATEGIES', error);
    }
    return {};
  },
  async sendCallbackData(data: IUserCallbackDataDTO) {
    try {
      return await publicApiV1<IUserCallbackDataResource>({
        url: '/user-interaction/callback/create',
        type: (securedType) => `UserInteraction.${securedType}.UserCallback.Create`,
        secured: true,
        data: { data },
      });
    } catch (error) {
      log.error('SEND_CALLBACK_DATA', error);
      throw error;
    }
  },
  async loadFastTrackUserSID() {
    try {
      const { data } = await publicApiV1<IUserFastTrackSIDResource>({
        url: '/users/sid/get',
        type: (securedType) => `Users.${securedType}.SID.Get`,
        secured: true,
      });
      return data?.sid;
    } catch (error) {
      log.error('LOAD_FAST_TRACK_USER_SID', error);
      throw error;
    }
  },

  // statuses

  async loadUserStatusData() {
    try {
      const data = await jsonHttp<IUserStatusResource>('/fe-api/user-status-data');
      return data || ({} as IUserStatusResource);
    } catch (error) {
      log.error('LOAD_USER_STATUS_DATA', error);
    }

    return {} as IUserStatusResource;
  },
};
