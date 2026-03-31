import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clientABTest } from './index';

vi.mock('../ssr', () => {
  return {
    get isServer() {
      return false;
    }
  };
});

const { mockGet, mockSet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock('../storages', () => ({
  LocalStorageKeyController: vi.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
  })),
}));

vi.mock('../log', () => ({
  log: {
    error: vi.fn(),
  },
}));

describe('clientABTest', () => {
  let mathRandomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue({});
    mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false if testKey exists but is true in storage', () => {
    mockGet.mockReturnValue({ testKey1: true });
    
    const result = clientABTest('testKey1');
    
    expect(result).toBe(true);
    expect(mockGet).toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled();
    expect(mathRandomSpy).not.toHaveBeenCalled();
  });

  it('should return false if testKey exists but is false in storage', () => {
    mockGet.mockReturnValue({ testKey1: false });
    
    const result = clientABTest('testKey1');
    
    expect(result).toBe(false);
    expect(mockGet).toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should generate value based on chance if not in storage (Math.random() < chance -> true)', () => {
    mockGet.mockReturnValue({});
    mathRandomSpy.mockReturnValue(0.4);
    
    const result = clientABTest('testKey2');
    
    expect(result).toBe(true);
    expect(mockSet).toHaveBeenCalledWith({ testKey2: true });
  });

  it('should generate value based on chance if not in storage (Math.random() >= chance -> false)', () => {
    mockGet.mockReturnValue({});
    mathRandomSpy.mockReturnValue(0.6);
    
    const result = clientABTest('testKey3');
    
    expect(result).toBe(false);
    expect(mockSet).toHaveBeenCalledWith({ testKey3: false });
  });

  it('should use provided chance coefficient', () => {
    mockGet.mockReturnValue({});
    mathRandomSpy.mockReturnValue(0.8);
    
    const result = clientABTest('testKey4', 0.9);
    
    expect(result).toBe(true);
    expect(mockSet).toHaveBeenCalledWith({ testKey4: true });
  });

  it('should catch error, log it and return false', async () => {
    const error = new Error('Storage fails');
    mockGet.mockImplementation(() => {
      throw error;
    });
    
    const { log } = await import('../log');

    const result = clientABTest('testKey5');

    expect(result).toBe(false);
    expect(log.error).toHaveBeenCalledWith('ERROR_IN_AB_TEST_EVALUATION', {
      testKey: 'testKey5',
      error,
    });
  });

  it('should return false immediately when isServer is true', async () => {
    const ssrMock = await import('../ssr');
    vi.spyOn(ssrMock, 'isServer', 'get').mockReturnValue(true);

    const result = clientABTest('testKeyServer');

    expect(result).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
