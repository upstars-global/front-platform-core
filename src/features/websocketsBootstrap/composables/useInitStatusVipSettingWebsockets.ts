import { onMounted } from 'vue';
import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import { useLoadStatusData, statusVipSettingWebsocketsEvents, VipSettingWebsocketType } from '../../../entities/status';

function useInitProgressionsWebsocketsBridge() {
  useWebsocketsBridge({
    emitter: statusVipSettingWebsocketsEvents,
    websocketConfigMap: {
      [VipSettingWebsocketType.SEASON_CHANGED]: {
        event: VipSettingWebsocketType.SEASON_CHANGED,
        verifyTimestamp: true,
      },
    },
  });
}

function useInitProgressionsWebsocketsHandlers() {
  const { loadStatusData } = useLoadStatusData();

  async function handleStaticUpdate() {
    await Promise.all([loadStatusData()]);
  }

  onMounted(() => {
    statusVipSettingWebsocketsEvents.on(VipSettingWebsocketType.SEASON_CHANGED, handleStaticUpdate);
  });
}

export function useInitStatusVipSettingWebsockets() {
  useInitProgressionsWebsocketsBridge();
  useInitProgressionsWebsocketsHandlers();
}
