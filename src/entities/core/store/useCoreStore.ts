import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IRegionResource } from '../api/types';

export const useCoreStore = defineStore('core', () => {
  const regionsByCountry = ref<Record<string, IRegionResource[]>>({});

  function setRegions(countryCode: string, data: IRegionResource[]) {
    regionsByCountry.value[countryCode] = data;
  }

  function getRegions(countryCode: string): IRegionResource[] | undefined {
    return regionsByCountry.value[countryCode];
  }

  function clearRegions(countryCode?: string) {
    if (countryCode) {
      delete regionsByCountry.value[countryCode];
    } else {
      regionsByCountry.value = {};
    }
  }

  return {
    setRegions,
    getRegions,
    clearRegions,
    regionsByCountry,
  };
});