import { useServerStore } from '../store';
import { configCurrencyByGeo } from '../config';
import { DEFAULT_CURRENCY } from '../../../shared/config/currencies';
import type { Currency } from '../../../shared/api';

export function useCurrencyByGeo() {
  const serverStore = useServerStore();

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