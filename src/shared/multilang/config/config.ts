import { Locale } from '../../api';

let defaultLocale = Locale.ENGLISH;

let defaultCountry = 'en';

export type AvailableLocale = Record<Locale, boolean>;

let availableLocales: AvailableLocale = {} as AvailableLocale;
let availableLocalesLicenseDomains: AvailableLocale = {} as AvailableLocale;

export const configI18nConfig = {
  getDefaultLocale() {
    return defaultLocale;
  },
  setDefaultLocale(locale: Locale) {
    defaultLocale = locale;
  },
  getDefaultCountry() {
    return defaultCountry;
  },
  setDefaultCountry(country: string) {
    defaultCountry = country;
  },
  getAvailableLocales() {
    return availableLocales;
  },
  setAvailableLocales(locales: Partial<AvailableLocale>) {
    availableLocales = { ...availableLocales, ...locales };
  },
  getAvailableLocalesLicenseDomains() {
    return availableLocalesLicenseDomains;
  },
  setAvailableLocalesLicenseDomains(locales: Partial<AvailableLocale>) {
    availableLocalesLicenseDomains = { ...availableLocalesLicenseDomains, ...locales };
  },
};
