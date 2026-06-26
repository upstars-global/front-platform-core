import { useServerStore } from '../store';
import { configCurrencyByGeo } from '../config';
import { DEFAULT_CURRENCY } from '../../../shared/config/currencies';
import type { Currency } from '../../../shared/api';
import type { Pinia } from 'pinia';

export function useCurrencyByGeo(pinia?: Pinia) {
  const serverStore = useServerStore(pinia);

  function getCurrencyByGeo(geo: string): Currency {
    const geoCurrency = configCurrencyByGeo.get()[geo];
    const currencies = serverStore.currencies;

    if (geoCurrency && currencies?.includes(geoCurrency)) {
      return geoCurrency;
    }

    return serverStore.defaultCurrency || DEFAULT_CURRENCY;
  }

  return { getCurrencyByGeo };
}