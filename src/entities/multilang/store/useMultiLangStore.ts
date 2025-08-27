import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { configI18nConfig } from '../../../shared/multilang/config/config';

export type Locale = {
  code: string;
  default: boolean;
  name: string;
};

export const useMultiLangStore = defineStore('multilang', () => {
  const DEFAULT_LOCALE = configI18nConfig.getDefaultLocale();
  const DEFAULT_COUNTRY = configI18nConfig.getDefaultCountry();

  const localeInCookies = ref<string>();
  const country = ref(DEV ? DEFAULT_COUNTRY : '');
  const defaultLocale = ref(DEFAULT_LOCALE);
  const locale = ref('');
  const forcedLocale = ref(''); // used just during ssg
  const userGeo = ref(DEV ? DEFAULT_COUNTRY : '');
  const userGeoRegion = ref('');
  const availableLocales = ref<Record<string, boolean>>({});

  const userLocale = computed(() => {
    return localeInCookies.value && availableLocales.value[localeInCookies.value]
      ? localeInCookies.value
      : locale.value || defaultLocale.value;
  });

  const userLanguage = computed(() => {
    return userLocale.value.slice(0, 2);
  });

  const locales = computed<Locale[]>(() => {
    return Object.keys(availableLocales.value).map((availableLocale, index) => {
      return {
        code: availableLocale,
        name: availableLocale,
        default: index === 0,
      };
    });
  });

  function setLocale(localeName: string) {
    locale.value = localeName;
  }

  function setUserGeo(geo: string) {
    userGeo.value = geo;
  }

  function setUserGeoRegion(region: string) {
    userGeoRegion.value = region;
  }

  function setAvailableLocales(data: Record<string, boolean>) {
    availableLocales.value = data;
  }

  function setLocaleInCookies(localeName?: string) {
    localeInCookies.value = localeName;
  }

  return {
    country,
    defaultLocale,
    locale,
    forcedLocale,
    locales,
    userGeo,
    userGeoRegion,
    userLocale,
    userLanguage,
    localeInCookies,
    availableLocales,
    setLocale,
    setUserGeo,
    setUserGeoRegion,
    setAvailableLocales,
    setLocaleInCookies,
  };
});
