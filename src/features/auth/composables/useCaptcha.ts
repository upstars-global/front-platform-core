import { log } from '../../../shared/helpers/log';
import { captchaHandler as defaultCaptchaHandler } from '../config';
import type { CaptchaHandler } from '../types';

type CaptchaPromiseCallback<T> = (captchaValue: string) => Promise<T>;

export function useCaptcha() {
  async function tryCaptcha<T>(promise: CaptchaPromiseCallback<T>, captchaHandler?: CaptchaHandler): Promise<T> {
    try {
      const captchaValue = await (captchaHandler || defaultCaptchaHandler)();
      if (captchaValue) {
        return await promise(captchaValue);
      }
    } catch (error: unknown) {
      log.error('USE_CAPTCHA_ERROR', error);
      throw error;
    }

    throw new Error('Captcha input failed');
  }

  return {
    tryCaptcha,
  };
}
