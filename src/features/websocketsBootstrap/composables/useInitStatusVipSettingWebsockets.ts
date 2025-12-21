import { onMounted } from 'vue';
import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import { useUserProfile } from '../../../entities/user';
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
  const { loadUserProfile } = useUserProfile();

  async function handleStaticUpdate() {
    await Promise.all([loadStatusData(), loadUserProfile({ reload: true })]);
  }

  onMounted(() => {
    statusVipSettingWebsocketsEvents.on(VipSettingWebsocketType.SEASON_CHANGED, handleStaticUpdate);
  });
}

export function useInitStatusVipSettingWebsockets() {
  useInitProgressionsWebsocketsBridge();
  useInitProgressionsWebsocketsHandlers();
}
