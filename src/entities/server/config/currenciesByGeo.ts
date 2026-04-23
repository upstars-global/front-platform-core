import type { Currency } from '../../../shared/api';
import { DEFAULT_CURRENCY_BY_GEO } from '../../../shared/config/currenciesByGeo';

let currencyByGeoMap: Record<string, Currency> = { ...DEFAULT_CURRENCY_BY_GEO };

export const configCurrencyByGeo = {
  set: (map: Record<string, Currency>) => {
    currencyByGeoMap = map;
  },
  get: (): Record<string, Currency> => currencyByGeoMap,
  reset: () => {
    currencyByGeoMap = { ...DEFAULT_CURRENCY_BY_GEO };
  },
};
