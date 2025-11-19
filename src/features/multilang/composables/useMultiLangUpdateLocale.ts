import type { Pinia } from 'pinia';
import { useMultiLangStore } from '../../../entities/multilang/store';
import { setLocaleCookie } from '../../../shared/multilang/lib/cookie';
import { isServer } from '../../../shared/helpers/ssr';
import { useSetLocale } from '../../../entities/multilang/composables/useSetLocale';

export type UpdateLocalUserLocaleParams = {
  locale: string;
  redirectUrl?: string;
};

export function useMultiLangUpdateLocale(pinia?: Pinia) {
  const multilangStore = useMultiLangStore(pinia);
  const { setLocale } = useSetLocale(pinia);

  function getLocalizedUrl(locale: string, redirectUrl?: string) {
    if (isServer) {
      return;
    }

    const originalUrl = window.location.pathname + window.location.search;

    const urlLang = originalUrl.split('/')[1];

    if (locale === urlLang) {
      return;
    }

    const urlLangInEnableLocale = multilangStore.locales?.find((item) => {
      return item.code === urlLang;
    });

    let newUrl = ''

    if (redirectUrl) {
      if (urlLangInEnableLocale) {
        if (locale === multilangStore.defaultLocale) {
          newUrl = redirectUrl;
        } else {
          newUrl = `/${locale}${redirectUrl}`;
        }
      } else if (locale !== multilangStore.defaultLocale) {
        newUrl = `/${locale}${redirectUrl}`;
      }

      return newUrl;
    }

    if (urlLangInEnableLocale) {
      if (locale === multilangStore.defaultLocale) {
        newUrl = originalUrl.replace(/\/[a-z]{2}-?[A-Z]{0,2}\/?/, '/');
      } else {
        newUrl = originalUrl.replace(urlLang, locale);
      }
    } else if (locale !== multilangStore.defaultLocale) {
      newUrl = `/${locale}${originalUrl}`;
    }

    return newUrl;
  }

  function redirectToLocale(locale: string, redirectUrl?: string): void {
    if (isServer) {
      return;
    }
  
    const url = getLocalizedUrl(locale, redirectUrl);

    if (url) {
      window.location.href = url;
    }
  }

  function updateUserLocale(locale: string) {
    setLocaleCookie(locale);
    setLocale(locale);
    redirectToLocale(locale);
  }

  async function updateLocalUserLocale(payload: UpdateLocalUserLocaleParams) {
    return new Promise<string | undefined>((resolve) => {
      const { locale: localeName, redirectUrl } = payload;

      if (localeName && multilangStore.availableLocales[localeName] && multilangStore.localeInCookies !== localeName) {
        setLocaleCookie(localeName);

        resolve(getLocalizedUrl(localeName, redirectUrl));
      }

      resolve(undefined);
    });
  }

  return {
    setLocale,
    updateUserLocale,
    updateLocalUserLocale,
  };
}
