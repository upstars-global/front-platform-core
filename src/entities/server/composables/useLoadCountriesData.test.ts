import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLoadCountriesData } from './useLoadCountriesData';
import { useCountriesDataStore } from '../store/useCountriesDataStore';
import { serverAPI } from '../api';
import type { PhoneCodeList } from '../types';

vi.mock('../api', () => ({
  serverAPI: {
    loadCountriesData: vi.fn(),
  },
}));

vi.mock('../../../shared/helpers/promise', () => ({
  promiseMemo: vi.fn((fn) => fn),
}));

describe('useLoadCountriesData', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load countries data if not already loaded', async () => {
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

    vi.mocked(serverAPI.loadCountriesData).mockResolvedValue(mockData);

    const { loadCountriesData } = useLoadCountriesData(pinia);
    const result = await loadCountriesData();

    expect(serverAPI.loadCountriesData).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);

    const store = useCountriesDataStore(pinia);
    expect(store.phoneCodeLoaded).toBe(true);
    expect(store.phoneCodes).toEqual(mockData);
  });

  it('should not call API if data is already loaded', async () => {
    const mockData: PhoneCodeList = {
      UA: {
        code: 'UA',
        dialCode: 380,
        name: 'Ukraine',
        example: '501234567',
        phone_mask: '## ### ## ##',
      },
    };

    const store = useCountriesDataStore(pinia);
    store.setPhoneCodes(mockData);
    store.setPhoneCodeLoaded(true);

    const { loadCountriesData } = useLoadCountriesData(pinia);
    const result = await loadCountriesData();

    expect(serverAPI.loadCountriesData).not.toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should set phoneCodeLoaded even if API returns undefined', async () => {
    vi.mocked(serverAPI.loadCountriesData).mockResolvedValue(undefined);

    const { loadCountriesData } = useLoadCountriesData(pinia);
    await loadCountriesData();

    const store = useCountriesDataStore(pinia);
    expect(store.phoneCodeLoaded).toBe(true);
  });

  it('should work correctly without passing pinia instance', async () => {
    const mockData: PhoneCodeList = {
      GB: {
        code: 'GB',
        dialCode: 44,
        name: 'United Kingdom',
        example: '7400123456',
        phone_mask: '#### ### ####',
      },
    };

    vi.mocked(serverAPI.loadCountriesData).mockResolvedValue(mockData);

    const { loadCountriesData } = useLoadCountriesData();
    const result = await loadCountriesData();

    expect(result).toEqual(mockData);
  });

  it('should handle errors when loading data', async () => {
    const error = new Error('Network error');
    vi.mocked(serverAPI.loadCountriesData).mockRejectedValue(error);

    const { loadCountriesData } = useLoadCountriesData(pinia);

    await expect(loadCountriesData()).rejects.toThrow('Network error');

    const store = useCountriesDataStore(pinia);
    expect(store.phoneCodeLoaded).toBe(false);
  });
});