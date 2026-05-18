import { Currency } from '../api';
import { COUNTRIES } from './countries';

export const DEFAULT_CURRENCY_BY_GEO: Record<string, Currency> = {
  [COUNTRIES.BRASILIA]: Currency.BRL,
  [COUNTRIES.CANADA]: Currency.CAD,
  [COUNTRIES.AUSTRALIA]: Currency.AUD,
  [COUNTRIES.NEW_ZEALAND]: Currency.NZD,
  [COUNTRIES.INDIA]: Currency.INR,
  [COUNTRIES.USA]: Currency.USD,
  [COUNTRIES.ENGLAND]: Currency.GBP,
  [COUNTRIES.NETHERLANDS]: Currency.EUR,
  [COUNTRIES.FRANCE]: Currency.EUR,
};