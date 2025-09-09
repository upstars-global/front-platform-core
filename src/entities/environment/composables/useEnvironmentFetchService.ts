import type { Pinia } from 'pinia';
import { useEnvironmentStore } from '../store';

export function useEnvironmentFetchService(pinia?: Pinia) {
  useEnvironmentStore(pinia);

  function loadEnvironment() {
    return Promise.resolve();
  }

  return {
    loadEnvironment,
  };
}
