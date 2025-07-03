import { log } from '../../../shared/helpers/log';
import type { CaptchaHandler } from '../types';

let captchaHandlerFunction: CaptchaHandler | null = null;

export function setCaptchaHandler(handler: CaptchaHandler) {
  captchaHandlerFunction = handler;
}

export async function captchaHandler() {
  if (!captchaHandlerFunction) {
    log.error('Captcha handler is not set');
    return '';
  }
  try {
    return await captchaHandlerFunction();
  } catch (error: unknown) {
    log.error('Captcha handler failed', error);
  }
  return '';
}
