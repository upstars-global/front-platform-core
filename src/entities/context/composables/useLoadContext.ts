import { useContextStore } from '../store/contextStore';
import { promiseMemo } from '../../../shared/helpers/promise';
import { contextAPI } from '../api';
import type { IClientContextResource } from '../../../shared/types';

export function useLoadContext() {
  const contextStore = useContextStore();

  const loadContext = promiseMemo(
    async () => {
      if (!contextStore.context?.userAgent) {
        const data = await contextAPI.getClientContext();
        contextStore.setContext(data);
      }

      return contextStore.context as IClientContextResource;
    },
    {
      key: 'loadContext',
    },
  );

  return {
    loadContext,
  };
}
