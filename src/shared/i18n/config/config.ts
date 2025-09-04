const DEFAULT_I18N_CONFIG = {
  fallbackLocale: 'en',
  locale: 'en',
  messages: {},
  silentTranslationWarn: true,
  pluralizationRules: {
    ru: function (choice: number, choicesLength: number) {
      if (choice === 0) {
        return 0;
      }
      const teen = choice > 10 && choice < 20;
      const endsWithOne = choice % 10 === 1;

      if (choicesLength < 4) {
        return !teen && endsWithOne ? 1 : 2;
      }
      if (!teen && endsWithOne) {
        return 1;
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
      }

      return choicesLength < 4 ? 2 : 3;
    },
  },
};

export function createI18nConfig(messages: Record<string, unknown>, overrides?: Partial<typeof DEFAULT_I18N_CONFIG>) {
  return (defaultLang: string, oldLocale: string) => ({
    ...DEFAULT_I18N_CONFIG,
    fallbackLocale: defaultLang,
    locale: oldLocale || defaultLang,
    messages,
    ...overrides,
  });
}

export const i18nConfig = createI18nConfig({ en: null });
