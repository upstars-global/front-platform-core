import type { Pinia } from 'pinia';
import { useMultiLangStore } from '../store';
import i18n from '../../../shared/multilang/instance';

export function useSetLocale(pinia?: Pinia) {
  const multilangStore = useMultiLangStore(pinia);

  function setLocale(locale: string) {
    if (i18n.instance) {
      i18n.instance.locale.value = locale;
    }

    multilangStore.setLocale(locale);
  }

  return {
    setLocale,
  };
}
