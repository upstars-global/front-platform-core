import type { Pinia } from 'pinia';
import { useMultiLangStore } from '../../../entities/multilang/store';

export function useMultiLangFetchService(pinia?: Pinia) {
  useMultiLangStore(pinia);

  function loadMultiLang() {
    return Promise.resolve();
  }

  return { loadMultiLang };
}
