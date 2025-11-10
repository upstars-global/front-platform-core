import cookie from './controllers/CookieController';
import { type CookieConfig, type CookieConfigMap } from './config';

export class CookieService<T extends string> {
  private readonly config: CookieConfigMap<T>;

  constructor(config: CookieConfigMap<T>) {
    this.config = config;
  }

  private getExpire(options?: CookieConfig) {
    if (options?.expires) {
      return options.expires();
    }
    return undefined;
  }

  set(name: T, value: string, options?: CookieConfig) {
    const config = this.config[name];
    if (config.readonly) {
      return;
    }

    cookie.set(name, value, {
      ...options,
      expires: this.getExpire(options),
      path: config.path || '/',
    });
  }

  get(name: T) {
    return cookie.get(name);
  }

  clear(name: T) {
    const config = this.config[name];
    if (config.readonly) {
      return;
    }

    cookie.set(name, '', {
      expires: -1,
      path: config.path,
    });
  }
}
