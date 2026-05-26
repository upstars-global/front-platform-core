import { coreAPI } from "../api";
import { useCoreStore } from "../store";
import { promiseMemo } from "../../../shared/helpers/promise";
import { createCache } from "../../../shared/helpers/cache";
import type { IRegionResource } from "../api/types";

const regionsCache = createCache<IRegionResource[]>({
  ttlMs: 5 * 60 * 1000,
  maxSize: 100,
});

export function useLoadRegions() {
  const coreStore = useCoreStore();

  const loadRegions = promiseMemo(async (countryCode: string) => {
    const cachedRegions = regionsCache.get(countryCode);
    
    if (cachedRegions) {
      coreStore.setRegions(countryCode, cachedRegions);
      return cachedRegions;
    }

    const data = await coreAPI.getRegionsByCountryCode(countryCode);

    regionsCache.set(countryCode, data);
    coreStore.setRegions(countryCode, data);

    return data;
  }, {
    key: 'loadRegions',
    passArgumentsToKey: true,
  });

  return {
    loadRegions,
  };
}