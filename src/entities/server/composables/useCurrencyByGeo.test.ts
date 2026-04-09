import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCurrencyByGeo } from './useCurrencyByGeo';
import { useServerStore } from '../store';
import { Currency } from '../../../shared/api';
import { DEFAULT_CURRENCY } from '../../../shared/config/currencies';
import { COUNTRIES } from '../../../shared/config/countries';

describe('useCurrencyByGeo', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns geo currency when it is in server currencies list', () => {
    const store = useServerStore();
    store.serverData = { currencies: [Currency.BRL], defaultCurrency: Currency.EUR, metrics: {} };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo(COUNTRIES.BRASILIA)).toBe(Currency.BRL);
  });

  it('returns server defaultCurrency when geo currency is not in server currencies list', () => {
    const store = useServerStore();
    store.serverData = { currencies: [Currency.USD], defaultCurrency: Currency.USD, metrics: {} };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo(COUNTRIES.BRASILIA)).toBe(Currency.USD);
  });

  it('returns DEFAULT_CURRENCY when geo currency is not in list and server has no defaultCurrency', () => {
    const store = useServerStore();
    store.serverData = { currencies: [], defaultCurrency: undefined, metrics: {} };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo(COUNTRIES.BRASILIA)).toBe(DEFAULT_CURRENCY);
  });

  it('returns server defaultCurrency for unknown geo country', () => {
    const store = useServerStore();
    store.serverData = { currencies: [Currency.EUR], defaultCurrency: Currency.EUR, metrics: {} };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo('XX')).toBe(Currency.EUR);
  });

  it('returns DEFAULT_CURRENCY for unknown geo country when server has no defaultCurrency', () => {
    const store = useServerStore();
    store.serverData = { currencies: [], defaultCurrency: undefined, metrics: {} };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo('XX')).toBe(DEFAULT_CURRENCY);
  });

  it('handles multiple mapped geo currencies correctly', () => {
    const store = useServerStore();
    store.serverData = {
      currencies: [Currency.CAD, Currency.AUD, Currency.NZD, Currency.INR, Currency.USD, Currency.GBP, Currency.EUR],
      defaultCurrency: Currency.EUR,
      metrics: {},
    };

    const { getCurrencyByGeo } = useCurrencyByGeo();

    expect(getCurrencyByGeo(COUNTRIES.CANADA)).toBe(Currency.CAD);
    expect(getCurrencyByGeo(COUNTRIES.AUSTRALIA)).toBe(Currency.AUD);
    expect(getCurrencyByGeo(COUNTRIES.NEW_ZEALAND)).toBe(Currency.NZD);
    expect(getCurrencyByGeo(COUNTRIES.INDIA)).toBe(Currency.INR);
    expect(getCurrencyByGeo(COUNTRIES.USA)).toBe(Currency.USD);
    expect(getCurrencyByGeo(COUNTRIES.ENGLAND)).toBe(Currency.GBP);
    expect(getCurrencyByGeo(COUNTRIES.NETHERLANDS)).toBe(Currency.EUR);
    expect(getCurrencyByGeo(COUNTRIES.FRANCE)).toBe(Currency.EUR);
  });
});