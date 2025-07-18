import { useContextStore } from '../store/contextStore';
import { promiseMemo } from '../../../shared/helpers/promise';
import { contextAPI } from '../api';

export function useLoadContext() {
  const contextStore = useContextStore();

  const loadContext = promiseMemo(
    async () => {
      if (!contextStore.context?.userAgent) {
        const data = await contextAPI.getClientContext();
        contextStore.setContext(data);
      }

      return contextStore.context;
    },
    {
      key: 'loadContext',
    },
  );

  return {
    loadContext,
  };
}
