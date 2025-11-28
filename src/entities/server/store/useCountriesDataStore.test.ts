import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCountriesDataStore, DEFAULT_COUNTRIES_DATA } from './useCountriesDataStore';
import type { PhoneCodeList } from '../types';

describe('useCountriesDataStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useCountriesDataStore();

    expect(store.phoneCodeLoaded).toBe(false);
    expect(store.phoneCodes).toEqual(DEFAULT_COUNTRIES_DATA);
  });

  it('should set phone codes', () => {
    const store = useCountriesDataStore();
    const mockData: PhoneCodeList = {
      UA: {
        code: 'UA',
        dialCode: 380,
        name: 'Ukraine',
        example: '501234567',
        phone_mask: '## ### ## ##',
      },
      US: {
        code: 'US',
        dialCode: 1,
        name: 'United States',
        example: '2015550123',
        phone_mask: '(###) ###-####',
      },
    };

    store.setPhoneCodes(mockData);

    expect(store.phoneCodes).toEqual(mockData);
  });

  it('should set phoneCodeLoaded flag to true', () => {
    const store = useCountriesDataStore();

    expect(store.phoneCodeLoaded).toBe(false);

    store.setPhoneCodeLoaded(true);

    expect(store.phoneCodeLoaded).toBe(true);
  });

  it('should set phoneCodeLoaded flag to false', () => {
    const store = useCountriesDataStore();

    store.setPhoneCodeLoaded(true);
    expect(store.phoneCodeLoaded).toBe(true);

    store.setPhoneCodeLoaded(false);
    expect(store.phoneCodeLoaded).toBe(false);
  });

  it('should return countries as array through getCountries computed', () => {
    const store = useCountriesDataStore();
    const mockData: PhoneCodeList = {
      UA: {
        code: 'UA',
        dialCode: 380,
        name: 'Ukraine',
        example: '501234567',
        phone_mask: '## ### ## ##',
      },
      US: {
        code: 'US',
        dialCode: 1,
        name: 'United States',
        example: '2015550123',
        phone_mask: '(###) ###-####',
      },
    };

    store.setPhoneCodes(mockData);

    const countries = store.getCountries;

    expect(Array.isArray(countries)).toBe(true);
    expect(countries).toHaveLength(2);
    expect(countries).toContainEqual(mockData.UA);
    expect(countries).toContainEqual(mockData.US);
  });

  it('should return default country in getCountries initially', () => {
    const store = useCountriesDataStore();

    const countries = store.getCountries;

    expect(countries).toHaveLength(1);
    expect(countries[0]).toEqual({
      code: 'au',
      dialCode: 61,
      name: 'Australia',
      example: '4 1234-5678',
    });
  });

  it('should update getCountries when phoneCodes change', () => {
    const store = useCountriesDataStore();

    expect(store.getCountries).toHaveLength(1);

    const newData: PhoneCodeList = {
      GB: {
        code: 'GB',
        dialCode: 44,
        name: 'United Kingdom',
        example: '7400123456',
        phone_mask: '#### ### ####',
      },
    };

    store.setPhoneCodes(newData);

    expect(store.getCountries).toHaveLength(1);
    expect(store.getCountries[0]).toEqual(newData.GB);
  });

  it('should handle empty phoneCodes object', () => {
    const store = useCountriesDataStore();

    store.setPhoneCodes({});

    expect(store.phoneCodes).toEqual({});
    expect(store.getCountries).toHaveLength(0);
  });

  it('should handle phoneCodes with null phone_mask', () => {
    const store = useCountriesDataStore();
    const mockData: PhoneCodeList = {
      DE: {
        code: 'DE',
        dialCode: 49,
        name: 'Germany',
        example: '15123456789',
        phone_mask: null,
      },
    };

    store.setPhoneCodes(mockData);

    expect(store.phoneCodes).toEqual(mockData);
    expect(store.getCountries[0].phone_mask).toBeNull();
  });

  it('should maintain reactivity between multiple store instances', () => {
    const store1 = useCountriesDataStore();
    const store2 = useCountriesDataStore();

    const mockData: PhoneCodeList = {
      FR: {
        code: 'FR',
        dialCode: 33,
        name: 'France',
        example: '612345678',
        phone_mask: '# ## ## ## ##',
      },
    };

    store1.setPhoneCodes(mockData);
    store1.setPhoneCodeLoaded(true);

    expect(store2.phoneCodes).toEqual(mockData);
    expect(store2.phoneCodeLoaded).toBe(true);
  });
});