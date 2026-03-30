import { log } from '../log';
import { isServer } from '../ssr';
import { LocalStorageKeyController } from '../storages';

const abTestsStorage = new LocalStorageKeyController<Record<string, boolean>>('abTests', {
  defaultValue: () => ({}),
});

export const clientABTest = (testKey: string, chance = 0.5): boolean => {
  if (isServer) {
    return false;
  }

  try {
    const tests = abTestsStorage.get();

    if (testKey in tests) {
      return tests[testKey];
    }

    const value = Math.random() < chance;
    tests[testKey] = value;
    abTestsStorage.set(tests);

    return value;
  } catch (error) {
    log.error(`ERROR_IN_AB_TEST_EVALUATION`, { testKey, error });
    return false;
  }
};
