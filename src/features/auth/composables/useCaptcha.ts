import { log } from '../../../shared/helpers/log';
import { captchaHandler as defaultCaptchaHandler } from '../config';
import type { CaptchaHandler } from '../types';

export class CaptchaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
      throw new CaptchaError('Captcha input error');
    }

    throw new CaptchaError('Captcha input failed');
  }

  return {
    tryCaptcha,
  };
}
