import { localStorageService } from '../service';
import type { LocalStorageKeyControllerOptions, LocalStorageData } from './types';
import { log } from '../../../../log';

export class LocalStorageKeyController<T> {
  private readonly key: string;
  private readonly options: LocalStorageKeyControllerOptions<T>;

  constructor(key: string, options: LocalStorageKeyControllerOptions<T>) {
    this.key = key;
    this.options = options;
  }

  getDefaultValue(defaultValue?: T): T {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    return this.options.defaultValue();
  }

  get(defaultValue?: T) {
    const value = localStorageService.getItem(this.key);
    if (value) {
      try {
        const data = JSON.parse(value) as LocalStorageData<T>;
        if (data.expire) {
          const expired = data.expire < Math.floor(Date.now() / 1000);
          if (expired) {
            this.clear();
            return this.getDefaultValue(defaultValue);
          }
          return data.value;
        }
        return data.value;
      } catch {
        log.error(`LocalStorageKeyController can't parse JSON for '${this.key}', value: '${value}'`);
      }
    }

    return this.getDefaultValue(defaultValue);
  }

  private getExpiresValue(expires?: number): number | null {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expires) {
      return currentTime + expires;
    }

    if (this.options.expires) {
      return currentTime + this.options.expires();
    }

    return null;
  }

  set(value: T, expires?: number) {
    localStorageService.setItem(
      this.key,
      JSON.stringify({
        value,
        expire: this.getExpiresValue(expires),
      }),
    );
  }

  clear() {
    localStorageService.removeItem(this.key);
  }
}
