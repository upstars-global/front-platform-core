import { isServer } from '../../../shared/helpers/ssr';
import { CookieService } from '../../../shared/helpers/storages';
import { cookieConfig } from '../../../shared/config/cookie';
import { log } from '../../../shared/helpers';

export function getLocaleCookie() {
  const cookieService = new CookieService(cookieConfig.getCookieConfigMap());
  const cookieNames = cookieConfig.getCookieNames();

  if (!cookieNames.LOCALE) {
    log.error('FAILED_TO_GET_LOCALE_COOKIE_COOKIE_NAME_NOT_FOUND');

    return undefined;
  }

  if (!isServer) {
    return cookieService.get(cookieNames.LOCALE);
  }

  return undefined;
}

export function setLocaleCookie(lang: string) {
  const cookieService = new CookieService(cookieConfig.getCookieConfigMap());
  const cookieNames = cookieConfig.getCookieNames();

  if (!cookieNames.LOCALE) {
    log.error('FAILED_TO_SET_LOCALE_COOKIE_COOKIE_NAME_NOT_FOUND');
    return;
  }

  if (isServer) {
    return;
  }

  const localeInCookie = cookieService.get(cookieNames.LOCALE);

  if (localeInCookie === lang) {
    return;
  }

  cookieService.set(cookieNames.LOCALE, lang);
}
