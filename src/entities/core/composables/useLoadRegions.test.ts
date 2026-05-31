import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCoreStore } from '../store/useCoreStore';
import { coreAPI } from '../api';
import type { IRegionResource } from '../api/types';

vi.mock('../api', () => ({
  coreAPI: {
    getRegionsByCountryCode: vi.fn(),
  },
}));

vi.mock('../../../shared/helpers/promise', () => ({
  promiseMemo: vi.fn((fn) => fn),
}));

const mockCacheGet = vi.fn();
const mockCacheSet = vi.fn();

vi.mock('../../../shared/helpers/cache', () => ({
  createCache: vi.fn(() => ({
    get: mockCacheGet,
    set: mockCacheSet,
  })),
}));

describe('useLoadRegions', () => {
  let pinia: ReturnType<typeof createPinia>;

  const mockRegionsA: IRegionResource[] = [
    { code: 'AA-01', fullName: 'Region Alpha 1' },
    { code: 'AA-02', fullName: 'Region Alpha 2' },
    { code: 'AA-03', fullName: 'Region Alpha 3' },
  ];

  const mockRegionsB: IRegionResource[] = [
    { code: 'BB-01', fullName: 'Region Beta 1' },
    { code: 'BB-02', fullName: 'Region Beta 2' },
  ];

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockCacheGet.mockReturnValue(null);
    
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should load regions from API when not cached', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode).mockResolvedValue(mockRegionsA);
    mockCacheGet.mockReturnValue(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    const result = await loadRegions('AA');

    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledTimes(1);
    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledWith('AA');
    expect(mockCacheSet).toHaveBeenCalledWith('AA', mockRegionsA);
    expect(result).toEqual(mockRegionsA);
  });

  it('should update store with loaded regions', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode).mockResolvedValue(mockRegionsA);
    mockCacheGet.mockReturnValue(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    await loadRegions('AA');

    const store = useCoreStore(pinia);
    expect(store.getRegions('AA')).toEqual(mockRegionsA);
  });

  it('should return cached regions without calling API', async () => {
    mockCacheGet.mockReturnValue(mockRegionsA);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    const result = await loadRegions('AA');

    expect(coreAPI.getRegionsByCountryCode).not.toHaveBeenCalled();
    expect(mockCacheGet).toHaveBeenCalledWith('AA');
    expect(result).toEqual(mockRegionsA);
  });

  it('should cache regions separately for different country codes', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode)
      .mockResolvedValueOnce(mockRegionsA)
      .mockResolvedValueOnce(mockRegionsB);
    mockCacheGet.mockReturnValue(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    
    const resultA = await loadRegions('AA');
    const resultB = await loadRegions('BB');

    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledTimes(2);
    expect(mockCacheSet).toHaveBeenCalledWith('AA', mockRegionsA);
    expect(mockCacheSet).toHaveBeenCalledWith('BB', mockRegionsB);
    expect(resultA).toEqual(mockRegionsA);
    expect(resultB).toEqual(mockRegionsB);

    const store = useCoreStore(pinia);
    expect(store.getRegions('AA')).toEqual(mockRegionsA);
    expect(store.getRegions('BB')).toEqual(mockRegionsB);
  });

  it('should reload regions after cache TTL expires', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode).mockResolvedValue(mockRegionsA);
    mockCacheGet.mockReturnValueOnce(null).mockReturnValueOnce(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    
    await loadRegions('AA');
    await loadRegions('AA');

    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledTimes(2);
  });

  it('should not reload regions before cache TTL expires', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode).mockResolvedValue(mockRegionsA);
    mockCacheGet.mockReturnValueOnce(null).mockReturnValueOnce(mockRegionsA);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    
    await loadRegions('AA');
    await loadRegions('AA');

    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledTimes(1);
  });

  it('should handle empty regions array', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode).mockResolvedValue([]);
    mockCacheGet.mockReturnValue(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    const result = await loadRegions('CC');

    expect(result).toEqual([]);
    expect(mockCacheSet).toHaveBeenCalledWith('CC', []);
    
    const store = useCoreStore(pinia);
    expect(store.getRegions('CC')).toEqual([]);
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network error');
    vi.mocked(coreAPI.getRegionsByCountryCode).mockRejectedValue(error);
    mockCacheGet.mockReturnValue(null);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();

    await expect(loadRegions('AA')).rejects.toThrow('Network error');
    expect(mockCacheSet).not.toHaveBeenCalled();
  });

  it('should update store even when returning from cache', async () => {
    mockCacheGet.mockReturnValue(mockRegionsA);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    
    const store = useCoreStore(pinia);
    // Simulating an empty store before fetching from cache
    if (store.clearRegions) {
      store.clearRegions('AA');
    }
    
    await loadRegions('AA');

    expect(coreAPI.getRegionsByCountryCode).not.toHaveBeenCalled();
    expect(store.getRegions('AA')).toEqual(mockRegionsA);
  });

  it('should cache different country codes independently without overlap', async () => {
    vi.mocked(coreAPI.getRegionsByCountryCode)
      .mockResolvedValueOnce(mockRegionsA)
      .mockResolvedValueOnce(mockRegionsB);
    
    mockCacheGet
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(mockRegionsA)
      .mockReturnValueOnce(mockRegionsB);

    const { useLoadRegions } = await import('./useLoadRegions');
    const { loadRegions } = useLoadRegions();
    
    await loadRegions('AA');
    await loadRegions('BB');
    await loadRegions('AA');
    await loadRegions('BB');

    expect(coreAPI.getRegionsByCountryCode).toHaveBeenCalledTimes(2);
    expect(mockCacheGet).toHaveBeenCalledWith('AA');
    expect(mockCacheGet).toHaveBeenCalledWith('BB');
  });
});