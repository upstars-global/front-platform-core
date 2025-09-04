import type { Pinia } from 'pinia';
import { createI18n as _createI18n } from 'vue-i18n';
import { useMultiLangLocalesLoad } from '../api';
import { useMultiLangStore } from '../../../entities/multilang/store';
import type { MessageSchema } from '../../../shared/multilang/types';
import { i18nConfig } from '../../../shared/i18n/config/config';
import { setI18n } from '../../../shared/multilang/instance';

export function useCreateI18n(pinia?: Pinia) {
  const { loadLocales } = useMultiLangLocalesLoad(pinia);
  const multiLangStore = useMultiLangStore(pinia);

  async function createI18n() {
    await loadLocales();

    const oldLocale = multiLangStore.userLocale;

    const i18nCreate = _createI18n<[MessageSchema], string, false>({
      ...i18nConfig(oldLocale, oldLocale),
      legacy: false,
      allowComposition: true,
      warnHtmlMessage: false,
    });

    setI18n(i18nCreate.global);

    return i18nCreate;
  }

  return {
    createI18n,
  };
}
