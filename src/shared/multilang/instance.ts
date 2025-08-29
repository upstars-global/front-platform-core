import type { I18nGlobal, I18nInstance } from './types';

const i18n: I18nInstance = {
  instance: null,
};

export function setI18n(instance: I18nGlobal) {
  i18n.instance = instance;
}

export default i18n;
