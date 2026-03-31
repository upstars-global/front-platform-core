import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { reactive } from 'vue';
import { useCoolingOffStatus } from './useCoolingOffStatus';
import { useLimitsStore } from '../../../entities/limits';
import { useUserProfile, useUserProfileStore, SelfExclusionStatus } from '../../../entities/user';

vi.mock('../../../entities/limits', () => ({
  useLimitsStore: vi.fn(),
}));

vi.mock('../../../entities/user', () => ({
  useUserProfile: vi.fn(),
  useUserProfileStore: vi.fn(),
  SelfExclusionStatus: {
    COOLING_OFF_INIT: 'cooling_off_init',
    COOLING_OFF_ACTIVE: 'cooling_off_active',
    SELF_EXCLUSION_WAITING: 'self_exclusion_waiting',
  },
}));

interface MockLimitsStore {
  selfExclusionLimit: { tillDate?: string | null } | null;
  loadSelfExclusionLimit: ReturnType<typeof vi.fn>;
}

interface MockUserProfileStore {
  userInfo: {
    selfExclusionStatus: string | null;
  };
}

describe('useCoolingOffStatus', () => {
  let pinia: ReturnType<typeof createPinia>;
  let mockLimitsStore: MockLimitsStore;
  let mockUserProfileStore: MockUserProfileStore;
  let mockIsLoggedAsync: ReturnType<typeof vi.fn>;
  let mockLoadSelfExclusionLimit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();

    mockIsLoggedAsync = vi.fn().mockResolvedValue(true);
    mockLoadSelfExclusionLimit = vi.fn().mockResolvedValue(undefined);

    mockLimitsStore = reactive({
      selfExclusionLimit: null,
      loadSelfExclusionLimit: mockLoadSelfExclusionLimit,
    });

    mockUserProfileStore = reactive({
      userInfo: {
        selfExclusionStatus: null,
      },
    });

    vi.mocked(useLimitsStore).mockReturnValue(mockLimitsStore as unknown as ReturnType<typeof useLimitsStore>);
    vi.mocked(useUserProfile).mockReturnValue({
      isLoggedAsync: mockIsLoggedAsync,
    } as unknown as ReturnType<typeof useUserProfile>);
    vi.mocked(useUserProfileStore).mockReturnValue(mockUserProfileStore as unknown as ReturnType<typeof useUserProfileStore>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isCoolingOff', () => {
    it('should return true when selfExclusionStatus is COOLING_OFF_ACTIVE', () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;

      const { isCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(true);
    });

    it('should return false when selfExclusionStatus is SELF_EXCLUSION_WAITING', () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.SELF_EXCLUSION_WAITING;

      const { isCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(false);
    });

    it('should return false when selfExclusionStatus is null', () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = null;

      const { isCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(false);
    });

    it('should return false when selfExclusionStatus is COOLING_OFF_INIT', () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_INIT;

      const { isCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(false);
    });
  });

  describe('coolingOffDate', () => {
    it('should return Date object when tillDate is present', () => {
      const mockDate = '2025-12-31T23:59:59Z';
      mockLimitsStore.selfExclusionLimit = {
        tillDate: mockDate,
      };

      const { coolingOffDate } = useCoolingOffStatus();

      expect(coolingOffDate.value).toBeInstanceOf(Date);
      expect(coolingOffDate.value?.toISOString()).toBe(new Date(mockDate).toISOString());
    });

    it('should return undefined when selfExclusionLimit is null', () => {
      mockLimitsStore.selfExclusionLimit = null;

      const { coolingOffDate } = useCoolingOffStatus();

      expect(coolingOffDate.value).toBeUndefined();
    });

    it('should return undefined when tillDate is not present', () => {
      mockLimitsStore.selfExclusionLimit = {
        tillDate: null,
      };

      const { coolingOffDate } = useCoolingOffStatus();

      expect(coolingOffDate.value).toBeUndefined();
    });

    it('should return undefined when tillDate is undefined', () => {
      mockLimitsStore.selfExclusionLimit = {
        tillDate: undefined,
      };

      const { coolingOffDate } = useCoolingOffStatus();

      expect(coolingOffDate.value).toBeUndefined();
    });

    it('should parse different date formats correctly', () => {
      const mockDate = '2025-06-15';
      mockLimitsStore.selfExclusionLimit = {
        tillDate: mockDate,
      };

      const { coolingOffDate } = useCoolingOffStatus();

      expect(coolingOffDate.value).toBeInstanceOf(Date);
      expect(coolingOffDate.value?.getFullYear()).toBe(2025);
      expect(coolingOffDate.value?.getMonth()).toBe(5); // June is month 5 (0-indexed)
    });
  });

  describe('checkIsCoolingOff', () => {
    it('should call isLoggedAsync and loadSelfExclusionLimit', async () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;

      const { checkIsCoolingOff } = useCoolingOffStatus();
      await checkIsCoolingOff();

      expect(mockIsLoggedAsync).toHaveBeenCalledTimes(1);
      expect(mockLoadSelfExclusionLimit).toHaveBeenCalledTimes(1);
    });

    it('should return true when user is cooling off', async () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;

      const { checkIsCoolingOff } = useCoolingOffStatus();
      const result = await checkIsCoolingOff();

      expect(result).toBe(true);
    });

    it('should return false when user is not cooling off', async () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.SELF_EXCLUSION_WAITING;

      const { checkIsCoolingOff } = useCoolingOffStatus();
      const result = await checkIsCoolingOff();

      expect(result).toBe(false);
    });

    it('should wait for both promises to resolve', async () => {
      let isLoggedResolved = false;
      let loadLimitResolved = false;

      mockIsLoggedAsync.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        isLoggedResolved = true;
        return true;
      });

      mockLoadSelfExclusionLimit.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        loadLimitResolved = true;
      });

      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;

      const { checkIsCoolingOff } = useCoolingOffStatus();
      const result = await checkIsCoolingOff();

      expect(isLoggedResolved).toBe(true);
      expect(loadLimitResolved).toBe(true);
      expect(result).toBe(true);
    });

    it('should handle errors from isLoggedAsync', async () => {
      const error = new Error('Auth error');
      mockIsLoggedAsync.mockRejectedValue(error);

      const { checkIsCoolingOff } = useCoolingOffStatus();

      await expect(checkIsCoolingOff()).rejects.toThrow('Auth error');
    });

    it('should handle errors from loadSelfExclusionLimit', async () => {
      const error = new Error('API error');
      mockLoadSelfExclusionLimit.mockRejectedValue(error);

      const { checkIsCoolingOff } = useCoolingOffStatus();

      await expect(checkIsCoolingOff()).rejects.toThrow('API error');
    });

    it('should return current cooling off status after loading data', async () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = null;

      mockLoadSelfExclusionLimit.mockImplementation(async () => {
        // Simulate status update after loading
        mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;
      });

      const { checkIsCoolingOff } = useCoolingOffStatus();
      const result = await checkIsCoolingOff();

      expect(result).toBe(true);
    });
  });

  describe('computed reactivity', () => {
    it('isCoolingOff should react to userInfo changes', () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = null;

      const { isCoolingOff } = useCoolingOffStatus();
      expect(isCoolingOff.value).toBe(false);

      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;
      expect(isCoolingOff.value).toBe(true);
    });

    it('coolingOffDate should react to selfExclusionLimit changes', () => {
      mockLimitsStore.selfExclusionLimit = null;

      const { coolingOffDate } = useCoolingOffStatus();
      expect(coolingOffDate.value).toBeUndefined();

      const mockDate = '2025-12-31T23:59:59Z';
      mockLimitsStore.selfExclusionLimit = { tillDate: mockDate };
      expect(coolingOffDate.value).toBeInstanceOf(Date);
    });
  });

  describe('integration', () => {
    it('should work correctly with all properties together', async () => {
      const mockDate = '2025-12-31T23:59:59Z';
      mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;
      mockLimitsStore.selfExclusionLimit = { tillDate: mockDate };

      const { isCoolingOff, coolingOffDate, checkIsCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(true);
      expect(coolingOffDate.value).toBeInstanceOf(Date);

      const result = await checkIsCoolingOff();
      expect(result).toBe(true);
    });

    it('should reflect updates after checkIsCoolingOff', async () => {
      mockUserProfileStore.userInfo.selfExclusionStatus = null;
      mockLimitsStore.selfExclusionLimit = null;

      const { isCoolingOff, coolingOffDate, checkIsCoolingOff } = useCoolingOffStatus();

      expect(isCoolingOff.value).toBe(false);
      expect(coolingOffDate.value).toBeUndefined();

      // Simulate data update
      mockLoadSelfExclusionLimit.mockImplementation(async () => {
        mockUserProfileStore.userInfo.selfExclusionStatus = SelfExclusionStatus.COOLING_OFF_ACTIVE;
        mockLimitsStore.selfExclusionLimit = { tillDate: '2025-12-31' };
      });

      await checkIsCoolingOff();

      expect(isCoolingOff.value).toBe(true);
      expect(coolingOffDate.value).toBeInstanceOf(Date);
    });
  });
});
