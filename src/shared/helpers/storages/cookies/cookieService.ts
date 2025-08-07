import cookie from './controllers/CookieController';
import { COOKIE_NAME, COOKIES_CONFIG_MAP, type CookieConfig } from './config';

export class CookieService {
  private static getExpire(options?: CookieConfig) {
    if (options?.expires) {
      return options.expires();
    }
    return undefined;
  }

  static set(name: COOKIE_NAME, value: string, options?: CookieConfig) {
    const config = COOKIES_CONFIG_MAP[name];
    if (config.readonly) {
      return;
    }

    cookie.set(name, value, {
      ...options,
      expires: this.getExpire(options),
      path: config.path,
    });
  }

  static get(name: COOKIE_NAME) {
    return cookie.get(name);
  }

  static clear(name: COOKIE_NAME) {
    const config = COOKIES_CONFIG_MAP[name];
    if (config.readonly) {
      return;
    }

    cookie.set(name, '', {
      expires: -1,
      path: config.path,
    });
  }
}
