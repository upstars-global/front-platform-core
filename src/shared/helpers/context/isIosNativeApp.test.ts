import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageKeyController } from '../storages/localStorage';
import type { isIosNativeApp as isIosNativeAppType } from './isIosNativeApp'; // Adjust the path if needed

const { mockSet, mockGet } = vi.hoisted(() => {
  return {
    mockSet: vi.fn(),
    mockGet: vi.fn().mockReturnValue(false),
  };
});

vi.mock('../storages/localStorage', () => {
  return {
    LocalStorageKeyController: vi.fn().mockImplementation(() => ({
      set: mockSet,
      get: mockGet,
    })),
  };
});

describe('isIosNativeApp', () => {
  let isIosNativeApp: typeof isIosNativeAppType;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    mockGet.mockReturnValue(false);

    vi.stubGlobal('window', {
      location: { search: '' },
    });

    const module = await import('./isIosNativeApp');
    isIosNativeApp = module.isIosNativeApp;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize LocalStorageKeyController with correct default value (100% coverage)', () => {
    const MockedController = vi.mocked(LocalStorageKeyController);
    expect(MockedController).toHaveBeenCalled();
    
    const [key, options] = MockedController.mock.calls[0];

    expect(key).toBe('ios_native_app');
    expect(typeof options.defaultValue).toBe('function');
    
    expect(options.defaultValue()).toBe(false); 
  });

  it('should return false if there is no URL parameter and no saved value', () => {
    window.location.search = '';

    const result = isIosNativeApp();

    expect(result).toBe(false);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should return true and save to LocalStorage if the iosapp=true parameter is present', () => {
    window.location.search = '?iosapp=true';

    const result = isIosNativeApp();

    expect(result).toBe(true);
    expect(mockSet).toHaveBeenCalledWith(true);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should ignore the iosapp parameter if its value is not true', () => {
    window.location.search = '?iosapp=false';

    const result = isIosNativeApp();

    expect(result).toBe(false);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should return true if true is saved in LocalStorage (without a URL parameter)', () => {
    window.location.search = '';
    mockGet.mockReturnValue(true);

    const result = isIosNativeApp();

    expect(result).toBe(true);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should use the cached value on repeated calls', () => {
    window.location.search = '?iosapp=true';

    isIosNativeApp();
    
    window.location.search = '';

    const result2 = isIosNativeApp();

    expect(result2).toBe(true);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should return false safely if window is actually undefined (SSR simulation)', async () => {
    vi.unstubAllGlobals();
    vi.resetModules();
    
    const module = await import('./isIosNativeApp');
    mockGet.mockReturnValue(false);

    const result = module.isIosNativeApp();

    expect(result).toBe(false);
  });
});