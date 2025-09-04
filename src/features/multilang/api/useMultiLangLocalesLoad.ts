import { useMultiLangStore } from '../../../entities/multilang/store';
import { useFetchAppGlobalConfig } from '../../../entities/app-config';
import { isServer } from '../../../shared/helpers/ssr';
import { configI18nConfig } from '../../../shared/multilang/config/config';
import { useSetLocale } from '../../../entities/multilang/composables/useSetLocale';
import { getLocaleCookie } from '../../../shared/multilang/lib/cookie';
import type { Pinia } from 'pinia';
import { promiseMemo } from '../../../shared/helpers/promise';

export function useMultiLangLocalesLoad(pinia?: Pinia) {
  const multilangStore = useMultiLangStore(pinia);
  const { setLocale } = useSetLocale(pinia);
  const { loadAppGlobalConfig } = useFetchAppGlobalConfig(pinia);

  async function loadAvailableLocales(): Promise<Record<string, boolean>> {
    let isLicenceDomain = false;

    if (!isServer) {
      const globalConfig = await loadAppGlobalConfig();
      isLicenceDomain = Boolean(globalConfig?.licenceDomainConfig);
    }

    const AVAILABLE_LOCALES = configI18nConfig.getAvailableLocales();
    const AVAILABLE_LOCALES_LICENSE_DOMAINS = configI18nConfig.getAvailableLocalesLicenseDomains();

    return isLicenceDomain ? AVAILABLE_LOCALES_LICENSE_DOMAINS : AVAILABLE_LOCALES;
  }

  const loadLocales = promiseMemo(
    async () => {
      multilangStore.setLocaleInCookies(getLocaleCookie());
      setLocale(multilangStore.userLocale || multilangStore.defaultLocale);
      multilangStore.setAvailableLocales(await loadAvailableLocales());
    },
    {
      key: 'loadLocales',
    },
  );

  return {
    loadLocales,
  };
}
