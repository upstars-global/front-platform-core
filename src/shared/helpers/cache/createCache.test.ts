import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createCache } from './createCache';

interface MockData {
  id: string;
  label: string;
}

const mockData: MockData[] = [
  { id: '1', label: 'Main Street, New York, USA' },
  { id: '2', label: 'Broadway, New York, USA' },
];

const defaultOptions = {
  ttlMs: 5 * 60 * 1000,
  maxSize: 50,
};

describe('createCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for a missing key', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    expect(cache.get('missing')).toBeNull();
  });

  it('returns stored data', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    cache.set('main-street', mockData);
    expect(cache.get('main-street')).toEqual(mockData);
  });

  it('returns null after TTL expires', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    cache.set('main-street', mockData);

    vi.advanceTimersByTime(defaultOptions.ttlMs + 1);

    expect(cache.get('main-street')).toBeNull();
  });

  it('returns result before TTL expires', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    cache.set('main-street', mockData);

    vi.advanceTimersByTime(defaultOptions.ttlMs - 1);

    expect(cache.get('main-street')).toEqual(mockData);
  });

  it('removes entry from cache after TTL expires', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    cache.set('main-street', mockData);

    vi.advanceTimersByTime(defaultOptions.ttlMs + 1);
    cache.get('main-street');

    expect(cache.get('main-street')).toBeNull();
  });

  it('evicts the oldest entry when max size is reached', () => {
    const cache = createCache<MockData[]>(defaultOptions);

    for (let i = 0; i < defaultOptions.maxSize; i++) {
      cache.set(`key-${i}`, mockData);
    }

    cache.set('new-key', mockData);

    expect(cache.get('key-0')).toBeNull();
    expect(cache.get('new-key')).toEqual(mockData);
  });

  it('does not exceed max cache size', () => {
    const cache = createCache<MockData[]>(defaultOptions);

    for (let i = 0; i < defaultOptions.maxSize + 5; i++) {
      cache.set(`key-${i}`, mockData);
    }

    let count = 0;
    for (let i = 0; i < defaultOptions.maxSize + 5; i++) {
      if (cache.get(`key-${i}`) !== null) count++;
    }

    expect(count).toBeLessThanOrEqual(defaultOptions.maxSize);
  });

  it('overwrites an existing key', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    const newData: MockData[] = [{ id: '3', label: 'Broadway, Los Angeles, USA' }];

    cache.set('main-street', mockData);
    cache.set('main-street', newData);

    expect(cache.get('main-street')).toEqual(newData);
  });

  it('stores an empty array', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    cache.set('unknown', []);
    expect(cache.get('unknown')).toEqual([]);
  });

  it('different keys do not conflict', () => {
    const cache = createCache<MockData[]>(defaultOptions);
    const other: MockData[] = [{ id: '3', label: 'Broadway, Los Angeles, USA' }];

    cache.set('main-street', mockData);
    cache.set('broadway', other);

    expect(cache.get('main-street')).toEqual(mockData);
    expect(cache.get('broadway')).toEqual(other);
  });

  it('respects custom ttlMs option', () => {
    const cache = createCache<MockData[]>({ ttlMs: 1000, maxSize: 10 });
    cache.set('main-street', mockData);

    vi.advanceTimersByTime(1001);

    expect(cache.get('main-street')).toBeNull();
  });

  it('respects custom maxSize option', () => {
    const cache = createCache<MockData[]>({ ttlMs: 1000, maxSize: 3 });

    cache.set('key-1', mockData);
    cache.set('key-2', mockData);
    cache.set('key-3', mockData);
    cache.set('key-4', mockData);

    expect(cache.get('key-1')).toBeNull();
    expect(cache.get('key-4')).toEqual(mockData);
  });
});