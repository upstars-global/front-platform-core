import { promiseMemo } from '../../../shared/helpers';
import { useAuthUserStrategiesStore } from '../store/useAuthUserStrategiesStore';
import type { Pinia } from 'pinia';
import { userAPI } from '../../../entities/user';

export function useLoadAuthUserStrategies(pinia?: Pinia) {
  const authUserStrategiesStore = useAuthUserStrategiesStore(pinia);

  const loadAuthUserStrategies = promiseMemo(
    async () => {
      const data = await userAPI.loadUserStrategies();

      authUserStrategiesStore.setStrategies(data)

      return data
    },
    {
      key: 'loadAuthUserStrategies',
    },
  );

  return {
    loadAuthUserStrategies,
  };
}
