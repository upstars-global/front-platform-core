import { useCountriesDataStore } from '../store/useCountriesDataStore';
import { promiseMemo } from '../../../shared/helpers/promise';
import { serverAPI } from '../api';
import type { PhoneCodeList } from '../types';
import type { Pinia } from 'pinia';

export function useLoadCountriesData(pinia?: Pinia) {
  const countriesDataStore = useCountriesDataStore(pinia);

  const loadCountriesData = promiseMemo(
    async () => {
      if (!countriesDataStore.phoneCodeLoaded) {
        const data = await serverAPI.loadCountriesData();

        if (data) {
          countriesDataStore.setPhoneCodes(data);
        }

        countriesDataStore.setPhoneCodeLoaded(true);

        return countriesDataStore.phoneCodes as PhoneCodeList;
      }

      return countriesDataStore.phoneCodes as PhoneCodeList;
    },
    {
      key: 'loadCountriesData',
    },
  );

  return {
    loadCountriesData,
  };
}

