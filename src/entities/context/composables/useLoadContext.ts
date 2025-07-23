import { useContextStore } from '../store/contextStore';
import { promiseMemo } from '../../../shared/helpers/promise';
import { contextAPI, type IClientContextResource } from '../api';

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
