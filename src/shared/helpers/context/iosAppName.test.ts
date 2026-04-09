import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageKeyController } from '../storages/localStorage';
import type { iosAppName as iosAppNameType } from './iosAppName';

const { mockSet, mockGet } = vi.hoisted(() => {
  return {
    mockSet: vi.fn(),
    mockGet: vi.fn().mockReturnValue(null),
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

describe('iosAppName', () => {
  let iosAppName: typeof iosAppNameType;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);

    vi.stubGlobal('window', {
      location: { search: '' },
    });

    const module = await import('./iosAppName');
    iosAppName = module.iosAppName;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize LocalStorageKeyController with correct key and default value', () => {
    const MockedController = vi.mocked(LocalStorageKeyController);
    expect(MockedController).toHaveBeenCalled();

    const [key, options] = MockedController.mock.calls[0];

    expect(key).toBe('ios_app_name');
    expect(typeof options.defaultValue).toBe('function');
    expect(options.defaultValue()).toBeNull();
  });

  it('should return null if there is no URL parameter and no saved value', () => {
    window.location.search = '';

    const result = iosAppName();

    expect(result).toBeNull();
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should save and return the app name if iosappname param is present', () => {
    window.location.search = '?iosappname=MyApp';

    const result = iosAppName();

    expect(result).toBe('MyApp');
    expect(mockSet).toHaveBeenCalledWith('MyApp');
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should return null if iosappname param is absent', () => {
    window.location.search = '?other=value';

    const result = iosAppName();

    expect(result).toBeNull();
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should return saved string from localStorage when no URL param', () => {
    window.location.search = '';
    mockGet.mockReturnValue('SavedApp');

    const result = iosAppName();

    expect(result).toBe('SavedApp');
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should use the cached value on repeated calls', () => {
    window.location.search = '?iosappname=MyApp';

    iosAppName();

    window.location.search = '';

    const result2 = iosAppName();

    expect(result2).toBe('MyApp');
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should return null safely if window is undefined (SSR simulation)', async () => {
    vi.unstubAllGlobals();
    vi.resetModules();

    const module = await import('./iosAppName');
    mockGet.mockReturnValue(null);

    const result = module.iosAppName();

    expect(result).toBeNull();
  });
});
