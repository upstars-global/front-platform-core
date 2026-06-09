interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface CacheOptions {
  ttlMs: number;
  maxSize: number;
}

export function createCache<T>(options: CacheOptions) {
  const cache = new Map<string, CacheEntry<T>>();

  function get(key: string): T | null {
    const entry = cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }

  function set(key: string, data: T): void {
    if (cache.size >= options.maxSize) {
      cache.delete(cache.keys().next().value ?? '');
    }

    cache.set(key, {
      data,
      expiresAt: Date.now() + options.ttlMs,
    });
  }

  return { get, set };
}