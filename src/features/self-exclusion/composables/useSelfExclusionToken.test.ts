import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSelfExclusionToken, type UseGetSelfExclusionToken } from './useSelfExclusionToken';
import { limitsAPI } from '../../../entities/limits';

vi.mock('../../../entities/limits', () => ({
  limitsAPI: {
    checkSelfExclusionToken: vi.fn(),
  },
}));

describe('useSelfExclusionToken', () => {
  let mockGetToken: ReturnType<UseGetSelfExclusionToken>['getToken'];
  let mockRemoveToken: ReturnType<UseGetSelfExclusionToken>['removeToken'];
  let mockUseGetToken: UseGetSelfExclusionToken;
  let expiredCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetToken = vi.fn();
    mockRemoveToken = vi.fn();
    expiredCallback = vi.fn();

    mockUseGetToken = vi.fn(() => ({
      getToken: mockGetToken,
      removeToken: mockRemoveToken,
    })) as UseGetSelfExclusionToken;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleSelfExclusionToken', () => {
    it('should return true and not call API when token is valid', async () => {
      const mockToken = 'valid-token-123';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(true);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      const result = await handleSelfExclusionToken();

      expect(result).toBe(true);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
      expect(limitsAPI.checkSelfExclusionToken).toHaveBeenCalledWith(mockToken);
      expect(mockRemoveToken).not.toHaveBeenCalled();
    });

    it('should call expiredCallback and removeToken when token is invalid', async () => {
      const mockToken = 'expired-token-456';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(false);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken, expiredCallback);
      const result = await handleSelfExclusionToken();

      expect(result).toBe(true);
      expect(limitsAPI.checkSelfExclusionToken).toHaveBeenCalledWith(mockToken);
      expect(expiredCallback).toHaveBeenCalledTimes(1);
      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    });

    it('should return false when token is null', async () => {
      vi.mocked(mockGetToken).mockReturnValue(null);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      const result = await handleSelfExclusionToken();

      expect(result).toBe(false);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
      expect(limitsAPI.checkSelfExclusionToken).not.toHaveBeenCalled();
      expect(mockRemoveToken).not.toHaveBeenCalled();
    });

    it('should return false when token is empty string', async () => {
      vi.mocked(mockGetToken).mockReturnValue('');

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      const result = await handleSelfExclusionToken();

      expect(result).toBe(false);
      expect(limitsAPI.checkSelfExclusionToken).not.toHaveBeenCalled();
    });

    it('should work without expiredCallback', async () => {
      const mockToken = 'expired-token';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(false);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      const result = await handleSelfExclusionToken();

      expect(result).toBe(true);
      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
      // Should not throw when expiredCallback is not provided
    });

    it('should handle API errors gracefully', async () => {
      const mockToken = 'error-token';
      const error = new Error('API Error');
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockRejectedValue(error);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken, expiredCallback);

      await expect(handleSelfExclusionToken()).rejects.toThrow('API Error');
      expect(mockRemoveToken).not.toHaveBeenCalled();
      expect(expiredCallback).not.toHaveBeenCalled();
    });

    it('should call removeToken only when token is invalid', async () => {
      const mockToken = 'token';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(true);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      await handleSelfExclusionToken();

      expect(mockRemoveToken).not.toHaveBeenCalled();
    });

    it('should handle multiple calls correctly', async () => {
      const mockToken = 'token-multiple';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(true);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);

      await handleSelfExclusionToken();
      await handleSelfExclusionToken();

      expect(mockGetToken).toHaveBeenCalledTimes(2);
      expect(limitsAPI.checkSelfExclusionToken).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration with useGetToken', () => {
    it('should correctly use getToken from useGetToken', async () => {
      const mockToken = 'integration-token';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(true);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      await handleSelfExclusionToken();

      expect(mockUseGetToken).toHaveBeenCalledTimes(1);
      expect(mockGetToken).toHaveBeenCalledTimes(1);
    });

    it('should correctly use removeToken from useGetToken', async () => {
      const mockToken = 'integration-token-2';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(false);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken);
      await handleSelfExclusionToken();

      expect(mockUseGetToken).toHaveBeenCalledTimes(1);
      expect(mockRemoveToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('expiredCallback behavior', () => {
    it('should call expiredCallback before removeToken', async () => {
      const mockToken = 'callback-order-token';
      const callOrder: string[] = [];

      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(false);

      const trackingExpiredCallback = vi.fn(() => {
        callOrder.push('expiredCallback');
      });

      const trackingRemoveToken = vi.fn(() => {
        callOrder.push('removeToken');
      });

      mockRemoveToken = trackingRemoveToken;
      mockUseGetToken = vi.fn(() => ({
        getToken: mockGetToken,
        removeToken: trackingRemoveToken,
      })) as UseGetSelfExclusionToken;

      const { handleSelfExclusionToken } = useSelfExclusionToken(
        mockUseGetToken,
        trackingExpiredCallback
      );
      await handleSelfExclusionToken();

      expect(callOrder).toEqual(['expiredCallback', 'removeToken']);
    });

    it('should not call expiredCallback when token is valid', async () => {
      const mockToken = 'valid-callback-token';
      vi.mocked(mockGetToken).mockReturnValue(mockToken);
      vi.mocked(limitsAPI.checkSelfExclusionToken).mockResolvedValue(true);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken, expiredCallback);
      await handleSelfExclusionToken();

      expect(expiredCallback).not.toHaveBeenCalled();
    });

    it('should not call expiredCallback when token is null', async () => {
      vi.mocked(mockGetToken).mockReturnValue(null);

      const { handleSelfExclusionToken } = useSelfExclusionToken(mockUseGetToken, expiredCallback);
      await handleSelfExclusionToken();

      expect(expiredCallback).not.toHaveBeenCalled();
    });
  });
});
