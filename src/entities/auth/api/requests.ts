import { jsonApi, publicApi, publicApiV1 } from '../../../shared/libs/http';
import { isServer } from '../../../shared/helpers/ssr';
import type {
  LoginDTO,
  ILoginResource,
  ILogoutResource,
  RegisterDTO,
  RegisterResource,
  IChangePasswordDTO,
  IVerifyEmailResource,
} from './types';
import { log } from '../../../shared/helpers/log';

export const authAPI = {
  async login(data: LoginDTO) {
    const response = await jsonApi<ILoginResource>('/login', {
      data,
    });
    return response.step;
  },
  async logout() {
    try {
      return await jsonApi<ILogoutResource>('/logout');
    } catch (error: unknown) {
      log.error('LOGOUT_ERROR', error);
    }
  },
  async register(data: RegisterDTO) {
    return await jsonApi<RegisterResource>('/users/register', {
      data,
    });
  },
  async changePassword(data: IChangePasswordDTO) {
    try {
      return await publicApi('/set-password', {
        // @ts-expect-error Type IChangePasswordDTO is not assignable to type Record<string, unknown>
        data,
      });
    } catch (error) {
      log.error('SET_NEW_PASSWORD', error);
    }
  },
  async verifyEmail(email: string) {
    try {
      const { data } = await publicApiV1<IVerifyEmailResource>({
        url: '/verify-email',
        type: (securedType) => `PublicApi.V1.${securedType}.Email.Verify`,
        data: {
          data: {
            email,
          },
        },
      });
      return data;
    } catch (error) {
      log.error('VERIFY_EMAIL', error);
    }
  },
  async getAutologinUrl(path = '/'): Promise<string> {
    try {
      const { data } = await publicApi<{
        data: {
          url: string;
        };
      }>('/auto-login', {
        data: {
          path,
          domain: isServer ? '' : window.location.hostname,
        },
      });

      return data.url;
    } catch (error) {
      log.error('GET_AUTOLOGIN_URL', error);
      throw error;
    }
  },
};
