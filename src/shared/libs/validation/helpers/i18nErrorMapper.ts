import { log } from "../../..";

export type I18nErrorMapper<
  TErrorKeys extends string = string,
  TReturn extends string = string
> = {
  getI18nKey: (errorKey: TErrorKeys) => TReturn;
};

export type I18nErrorMapperMappings<TErrorKeys extends string, TReturn extends string> = {
  [K in TErrorKeys]: TReturn;
};

export const createI18nErrorMapper = <
  TErrorKeys extends string,
  TReturn extends string
>(
  mappings: I18nErrorMapperMappings<TErrorKeys, TReturn>,
  options: {
    fallback: (errorKey: TErrorKeys) => TReturn;
  }
) => {
  const getI18nKey = (errorKey: TErrorKeys): TReturn => {
    const i18nKey = mappings[errorKey];
    
    if (!i18nKey) {
      log.error(`UNKNOWN_ERROR_KEY`, {
        errorKey
      })
      
      return options.fallback(errorKey);
    }
    
    return i18nKey;
  };

  return {
    getI18nKey,
  };
};
