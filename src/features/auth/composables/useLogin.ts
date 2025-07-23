import { ref } from 'vue';
import { authAPI, authEvents, type LoginDTO, type LoginErrorDTO } from '../../../entities/auth';
import { log } from '../../../shared/helpers/log';
import { JsonHttpServerError } from '../../../shared/libs/http';
import { useFetchAllUserData } from './useFetchAllUserData';
import { useCaptcha } from './useCaptcha';
import { isServer } from '../../../shared/helpers/ssr';

export type LoginParams = Record<string, unknown> & {
  login: string;
  password: string;
  captcha?: string;
};

export type LoginOptions = {
  preventCaptchaHandler?: boolean;
  captchaHandler?: () => Promise<string>;
};

declare global {
  interface CredentialRequestOptions {
    password?: boolean;
  }
  interface Credential {
    password?: string;
  }
}

export function useLogin() {
  const { fetchAllUserData } = useFetchAllUserData();
  const { tryCaptcha } = useCaptcha();

  const captchaFailed = ref(false);

  function resetCaptchaFailed() {
    captchaFailed.value = false;
  }

  async function loginAction(params: LoginParams, options?: LoginOptions): Promise<string | undefined> {
    const { login, password, captcha, ...extraParams } = params;
    const { preventCaptchaHandler } = options || {};

    try {
      const loginData: LoginDTO = {
        _password: password,
        _username: login.trim(),
        captcha_key: captcha,
        ...extraParams,
      };

      const step = await authAPI.login(loginData);
      await fetchAllUserData();
      authEvents.emit('login');

      return step;
    } catch (error: unknown) {
      if (error instanceof JsonHttpServerError) {
        const errorData = error.error.data as LoginErrorDTO;
        if (errorData && errorData.captcha_required) {
          captchaFailed.value = true;
          if (!preventCaptchaHandler) {
            return await loginWithCaptcha(params, options);
          }
        }
      }

      log.error('LOGIN_ERROR', error);
      throw error;
    }
  }

  async function loginWithCaptcha(params: LoginParams, options?: LoginOptions) {
    const { captchaHandler } = options || {};

    return await tryCaptcha(
      (captchaValue) =>
        loginAction({
          ...params,
          captcha: captchaValue,
        }),
      captchaHandler,
    );
  }

  async function safeLogin(params: LoginParams, options?: LoginOptions) {
    if (captchaFailed.value) {
      return await loginWithCaptcha(params, {
        ...options,
        preventCaptchaHandler: true,
      });
    }
    return await loginAction(params, options);
  }

  async function tryCredentialsLogin(options?: LoginOptions) {
    try {
      if (!isServer && window.navigator.credentials) {
        const credentials = await navigator.credentials.get({ password: true });
        if (credentials && credentials.password) {
          const loginParams = {
            login: credentials.id,
            password: credentials.password,
          };
          await safeLogin(loginParams, options);
          return true;
        }
      }
    } catch (error: unknown) {
      log.error('CREDENTIALS_LOGIN_ERROR', error);
    }
    return false;
  }

  return {
    safeLogin,
    tryCredentialsLogin,
    resetCaptchaFailed,
  };
}
