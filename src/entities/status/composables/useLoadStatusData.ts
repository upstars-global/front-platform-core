import { useStatusStore } from '../store';
import { statusApi, type StatusDataResources } from '../api';
import { promiseMemo } from '../../../shared/helpers/promise';

export type LoadStatusDataParams = {
  reload?: boolean;
};

export function useLoadStatusData() {
  const statusStore = useStatusStore();

  const loadStatusData = promiseMemo(
    async (params?: LoadStatusDataParams): Promise<StatusDataResources | null> => {
      const { reload = false } = params || {};

      if (statusStore.isLoaded && !reload) {
        return statusStore.statusData;
      }

      statusStore.isPending = true;
      try {
        const data = await statusApi.loadStatusData();
        statusStore.setStatusData(data);
        return data;
      } finally {
        statusStore.isPending = false;
      }
    },
    {
      key: 'loadStatusData',
    },
  );

  return {
    loadStatusData,
  };
}
