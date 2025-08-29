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

  function redirectToLocale(locale: string, redirectUrl?: string) {
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

    if (redirectUrl) {
      if (urlLangInEnableLocale) {
        if (locale === multilangStore.defaultLocale) {
          window.location.href = redirectUrl;
        } else {
          window.location.href = `/${locale}${redirectUrl}`;
        }
      } else if (locale !== multilangStore.defaultLocale) {
        window.location.href = `/${locale}${redirectUrl}`;
      }

      return;
    }

    if (urlLangInEnableLocale) {
      if (locale === multilangStore.defaultLocale) {
        window.location.href = originalUrl.replace(/\/[a-z]{2}-?[A-Z]{0,2}\/?/, '/');
      } else {
        window.location.href = originalUrl.replace(urlLang, locale);
      }
    } else if (locale !== multilangStore.defaultLocale) {
      window.location.href = `/${locale}${originalUrl}`;
    }
  }

  function updateUserLocale(locale: string) {
    setLocaleCookie(locale);
    redirectToLocale(locale);
    setLocale(locale);
  }

  async function updateLocalUserLocale(payload: UpdateLocalUserLocaleParams) {
    const { locale: localeName, redirectUrl } = payload;

    if (localeName && multilangStore.availableLocales[localeName] && multilangStore.localeInCookies !== localeName) {
      setLocaleCookie(localeName);
      redirectToLocale(localeName, redirectUrl);
    }

    return Promise.resolve();
  }

  return {
    setLocale,
    updateUserLocale,
    updateLocalUserLocale,
  };
}
