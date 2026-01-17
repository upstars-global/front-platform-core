import { ref } from 'vue';
import { authAPI, authEvents, type LoginDTO, type LoginResource } from '../../../entities/auth';
import { log } from '../../../shared/helpers/log';
import { useFetchAllUserData } from './useFetchAllUserData';
import { useCaptcha } from './useCaptcha';
import { isServer } from '../../../shared/helpers/ssr';
import { afterLoginHook, onErrorLoginHook } from '../config';
import { isLoginErrorCaptchaRequiredResource } from '../guards';
import { JsonHttpServerError } from '../../../shared/libs/http';

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

  async function loginAction(params: LoginParams, options?: LoginOptions): Promise<LoginResource | undefined> {
    const { login, password, captcha, ...extraParams } = params;
    const { preventCaptchaHandler } = options || {};

    try {
      const loginData: LoginDTO = {
        _password: password,
        _username: login.trim(),
        captcha_key: captcha,
        ...extraParams,
      };

      const response = await authAPI.login(loginData);

      await fetchAllUserData();

      afterLoginHook.run(response);

      authEvents.emit('login');

      return response;
    } catch (error: unknown) {
      onErrorLoginHook.run(error);


      if (error instanceof JsonHttpServerError && isLoginErrorCaptchaRequiredResource(error.error.data)) {
        captchaFailed.value = true;

        if (!preventCaptchaHandler) {
          return await loginWithCaptcha(params, options);
        }
      }

      log.error('LOGIN_REQUEST_ERROR', error);
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
