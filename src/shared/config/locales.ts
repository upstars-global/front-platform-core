import { Locale } from '../api';

export let DEFAULT_LOCALE = Locale.ENGLISH;

export function setDefaultLocale(locale: Locale) {
  DEFAULT_LOCALE = locale;
}
