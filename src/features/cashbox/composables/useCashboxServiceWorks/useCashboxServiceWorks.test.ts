import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCashboxServiceWorks } from './useCashboxServiceWorks';
import type { IUserFeatureResource, IUserStatusResource } from '../../../../entities/user';

// Mock dependencies
vi.mock('../../../../entities/cashbox/config', () => ({
  configCashbox: {
    getPreventCashboxServiceWorksKey: vi.fn(),
    getPreventCashboxServiceWorksHash: vi.fn(),
  },
}));

vi.mock('../../../../shared/helpers/ssr', () => ({
  isServer: false,
}));

vi.mock('../../../../entities/user/composables/useUserInfoLoad', () => ({
  useUserInfoLoad: vi.fn(),
}));

import { configCashbox } from '../../../../entities/cashbox';
import { useUserInfoLoad } from '../../../../entities/user';
import type { PromiseMemoizerCallback } from '../../../../shared';

describe('useCashboxServiceWorks', () => {
  const MOCK_SERVICE_WORKS_KEY = 'PREVENT_CASHBOX_SERVICE_WORKS_KEY';
  const MOCK_SERVICE_WORKS_HASH = '#show-cashbox-force';
  const PREVENT_VALUE = '1';
  const HIDE_CASHBOX_FEATURE = 'hide-cashbox';

  // Helper to create a properly typed mock for loadUserFeatures
  const createMockLoadUserFeatures = (
    returnValue: IUserFeatureResource[] | Promise<IUserFeatureResource[]>
  ): PromiseMemoizerCallback<() => Promise<IUserFeatureResource[]>> => {
    // Using as unknown as to add clearCache to the vi.fn() mock, simulating promiseMemo behavior
    const mockFn = vi.fn().mockResolvedValue(returnValue) as unknown as PromiseMemoizerCallback<
      () => Promise<IUserFeatureResource[]>
    >;
    mockFn.clearCache = vi.fn();
    return mockFn;
  };

  // Helper to create mock for useUserInfoLoad return value
  const createUserInfoLoadMock = (
    loadUserFeatures: PromiseMemoizerCallback<() => Promise<IUserFeatureResource[]>>
  ): ReturnType<typeof useUserInfoLoad> => {
    // Using as unknown as to add clearCache to the vi.fn() mock, simulating promiseMemo behavior
    const mockLoadUserStatusData = vi.fn() as unknown as PromiseMemoizerCallback<
      () => Promise<IUserStatusResource>
    >;
    mockLoadUserStatusData.clearCache = vi.fn();

    return {
      loadUserFeatures,
      loadUserBettingToken: vi.fn().mockResolvedValue('mock-token'),
      loadRefcodeTypes: vi.fn().mockResolvedValue(undefined),
      loadUserStatusData: mockLoadUserStatusData,
    };
  };

  // Helper to set up server-side environment for testing
  const setupServerEnvironment = async (
    mockLoadUserFeatures: PromiseMemoizerCallback<() => Promise<IUserFeatureResource[]>>
  ) => {
    // Reset all modules to clear cache
    vi.resetModules();

    // Mock isServer as true BEFORE importing
    vi.doMock('../../../../shared/helpers/ssr', () => ({
      isServer: true,
    }));

    // Re-mock other dependencies
    vi.doMock('../../../../entities/cashbox/config', () => ({
      configCashbox: {
        getPreventCashboxServiceWorksKey: () => MOCK_SERVICE_WORKS_KEY,
        getPreventCashboxServiceWorksHash: () => MOCK_SERVICE_WORKS_HASH,
      },
    }));

    vi.doMock('../../../../entities/user/composables/useUserInfoLoad', () => ({
      useUserInfoLoad: () => createUserInfoLoadMock(mockLoadUserFeatures),
    }));

    // Dynamic import to get the module with server mock
    const { useCashboxServiceWorks: useCashboxServiceWorksServer } = await import(
      './useCashboxServiceWorks'
    );

    return useCashboxServiceWorksServer;
  };

  // Helper to cleanup after server-side tests
  const cleanupServerEnvironment = () => {
    vi.resetModules();
    vi.doUnmock('../../../../shared/helpers/ssr');
    vi.doUnmock('../../../../entities/cashbox/config');
    vi.doUnmock('../../../../entities/user/composables/useUserInfoLoad');
  };

  // Mock localStorage
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    localStorageMock = {};

    // Setup global mock if it doesn't exist
    if (typeof global.window === 'undefined') {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });
    }

    // Setup localStorage mock
    Object.defineProperty(global.window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => localStorageMock[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
      configurable: true,
    });

    // Setup window.location mock
    Object.defineProperty(global.window, 'location', {
      value: {
        hash: '',
      },
      writable: true,
      configurable: true,
    });

    // Setup default config mocks
    vi.mocked(configCashbox.getPreventCashboxServiceWorksKey).mockReturnValue(MOCK_SERVICE_WORKS_KEY);
    vi.mocked(configCashbox.getPreventCashboxServiceWorksHash).mockReturnValue(MOCK_SERVICE_WORKS_HASH);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isServiceWorks', () => {
    it('should return true when hide-cashbox feature is available and not prevented', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(true);
      expect(mockLoadUserFeatures).toHaveBeenCalledTimes(1);
    });

    it('should return false when hide-cashbox feature is not available', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: false },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(false);
    });

    it('should return false when hide-cashbox feature is not in the list', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: 'other-feature', isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(false);
    });

    it('should return false when feature is available but prevented via localStorage', async () => {
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = PREVENT_VALUE;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(false);
      expect(global.window.localStorage.getItem).toHaveBeenCalledWith(MOCK_SERVICE_WORKS_KEY);
    });

    it('should return true when feature is available and localStorage has different value', async () => {
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = '0';

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(true);
    });

    it('should return false when features list is empty', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(false);
    });

    it('should handle multiple features and find the correct one', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: 'feature-1', isAvailable: false },
        { feature: 'feature-2', isAvailable: true },
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
        { feature: 'feature-4', isAvailable: false },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      expect(result).toBe(true);
    });
  });

  describe('checkLocationHash', () => {
    it('should set localStorage when location hash matches prevent hash', () => {
      global.window.location.hash = MOCK_SERVICE_WORKS_HASH;

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();
      checkLocationHash();

      expect(global.window.localStorage.setItem).toHaveBeenCalledWith(
        MOCK_SERVICE_WORKS_KEY,
        PREVENT_VALUE
      );
      expect(localStorageMock[MOCK_SERVICE_WORKS_KEY]).toBe(PREVENT_VALUE);
    });

    it('should not set localStorage when location hash does not match', () => {
      global.window.location.hash = '#different-hash';

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();
      checkLocationHash();

      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not set localStorage when location hash is empty', () => {
      global.window.location.hash = '';

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();
      checkLocationHash();

      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should retrieve hash from config', () => {
      global.window.location.hash = MOCK_SERVICE_WORKS_HASH;

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();
      checkLocationHash();

      expect(configCashbox.getPreventCashboxServiceWorksHash).toHaveBeenCalled();
    });
  });

  describe('isServer handling', () => {
    it('should work correctly on client side (isServer=false)', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      // With isServer=false (our current mock), this should work normally and access localStorage
      expect(result).toBe(true);
      expect(global.window.localStorage.getItem).toHaveBeenCalled();
    });

    it('checkLocationHash should not throw when accessing window.location on client', () => {
      global.window.location.hash = MOCK_SERVICE_WORKS_HASH;

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();

      // Should not throw and should set localStorage
      expect(() => checkLocationHash()).not.toThrow();
      expect(global.window.localStorage.setItem).toHaveBeenCalledWith(
        MOCK_SERVICE_WORKS_KEY,
        PREVENT_VALUE
      );
    });

    it('checkLocationHash should handle empty hash gracefully', () => {
      global.window.location.hash = '';

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash } = useCashboxServiceWorks();

      // Should not throw and should not set localStorage
      expect(() => checkLocationHash()).not.toThrow();
      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle localStorage access correctly when checking prevent flag', async () => {
      // Set a prevent flag
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = PREVENT_VALUE;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      // Should access localStorage and respect the prevent flag
      expect(global.window.localStorage.getItem).toHaveBeenCalledWith(MOCK_SERVICE_WORKS_KEY);
      expect(result).toBe(false);
    });

    it('should handle localStorage access correctly when prevent flag is not set', async () => {
      // Ensure no prevent flag is set
      delete localStorageMock[MOCK_SERVICE_WORKS_KEY];

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { isServiceWorks } = useCashboxServiceWorks();
      const result = await isServiceWorks();

      // Should access localStorage and allow service to work
      expect(global.window.localStorage.getItem).toHaveBeenCalledWith(MOCK_SERVICE_WORKS_KEY);
      expect(result).toBe(true);
    });
  });

  describe('server-side behavior (isServer=true)', () => {
    it('should not access localStorage when isPrevent is called on server (via isServiceWorks)', async () => {
      // Set prevent flag in mock storage (should be ignored on server)
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = PREVENT_VALUE;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      const useCashboxServiceWorksServer = await setupServerEnvironment(mockLoadUserFeatures);

      const { isServiceWorks } = useCashboxServiceWorksServer();
      const result = await isServiceWorks();

      // On server, isPrevent should return false (ignoring localStorage)
      // so if feature is available, service should work
      expect(result).toBe(true);

      cleanupServerEnvironment();
    });

    it('should not access window.location when checkLocationHash is called on server', async () => {
      global.window.location.hash = MOCK_SERVICE_WORKS_HASH;

      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      const useCashboxServiceWorksServer = await setupServerEnvironment(mockLoadUserFeatures);

      const { checkLocationHash } = useCashboxServiceWorksServer();

      // Clear mock calls before testing
      vi.clearAllMocks();

      // Call checkLocationHash - it should return early on server
      checkLocationHash();

      // Verify localStorage.setItem was NOT called
      expect(global.window.localStorage.setItem).not.toHaveBeenCalled();

      cleanupServerEnvironment();
    });

    it('should not throw errors when accessing window on server in checkLocationHash', async () => {
      const mockLoadUserFeatures = createMockLoadUserFeatures([]);
      const useCashboxServiceWorksServer = await setupServerEnvironment(mockLoadUserFeatures);

      const { checkLocationHash } = useCashboxServiceWorksServer();

      // Should not throw even though window might not be available on server
      expect(() => checkLocationHash()).not.toThrow();

      cleanupServerEnvironment();
    });

    it('should allow service to work on server even when prevent flag would be set', async () => {
      // Set prevent flag in localStorage (which should be ignored on server)
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = PREVENT_VALUE;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      const useCashboxServiceWorksServer = await setupServerEnvironment(mockLoadUserFeatures);

      const { isServiceWorks } = useCashboxServiceWorksServer();
      const result = await isServiceWorks();

      // On server, localStorage is ignored, so service should work based on feature flag alone
      // This test verifies isPrevent returns false on server regardless of localStorage value
      expect(result).toBe(true);

      cleanupServerEnvironment();
    });

    it('should return false from isPrevent on server when feature is not available', async () => {
      // Set prevent flag in localStorage (should be ignored)
      localStorageMock[MOCK_SERVICE_WORKS_KEY] = PREVENT_VALUE;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: false },
      ]);

      const useCashboxServiceWorksServer = await setupServerEnvironment(mockLoadUserFeatures);

      const { isServiceWorks } = useCashboxServiceWorksServer();
      const result = await isServiceWorks();

      // On server, isPrevent returns false, but feature is not available
      // so service should not work
      expect(result).toBe(false);

      cleanupServerEnvironment();
    });
  });

  describe('integration', () => {
    it('should work correctly when checkLocationHash is called before isServiceWorks', async () => {
      global.window.location.hash = MOCK_SERVICE_WORKS_HASH;

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash, isServiceWorks } = useCashboxServiceWorks();

      // First set the prevent flag
      checkLocationHash();
      expect(localStorageMock[MOCK_SERVICE_WORKS_KEY]).toBe(PREVENT_VALUE);

      // Then check if service works (should be false due to prevent flag)
      const result = await isServiceWorks();
      expect(result).toBe(false);
    });

    it('should allow service to work when hash is not set', async () => {
      global.window.location.hash = '#some-other-hash';

      const mockLoadUserFeatures = createMockLoadUserFeatures([
        { feature: HIDE_CASHBOX_FEATURE, isAvailable: true },
      ]);

      vi.mocked(useUserInfoLoad).mockReturnValue(createUserInfoLoadMock(mockLoadUserFeatures));

      const { checkLocationHash, isServiceWorks } = useCashboxServiceWorks();

      checkLocationHash();
      expect(localStorageMock[MOCK_SERVICE_WORKS_KEY]).toBeUndefined();

      const result = await isServiceWorks();
      expect(result).toBe(true);
    });
  });
});
