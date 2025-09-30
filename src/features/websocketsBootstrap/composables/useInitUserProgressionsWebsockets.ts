import { onMounted } from 'vue';
import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import {
  userWebsocketsEvents,
  useUserProfileStore,
  StatusProgressionsWebsocketType,
  userEvents,
  type StatusProgressionsStaticWebsocket,
  type StatusProgressionsDynamicWebsocket,
} from '../../../entities/user';
import { useLoadStatusData, useStatusStore } from '../../../entities/status';

function useInitProgressionsWebsocketsBridge() {
  useWebsocketsBridge({
    emitter: userWebsocketsEvents,
    websocketConfigMap: {
      [StatusProgressionsWebsocketType.STATIC_UPDATE]: {
        event: StatusProgressionsWebsocketType.STATIC_UPDATE,
        verifyTimestamp: true,
      },
      [StatusProgressionsWebsocketType.DYNAMIC_UPDATE]: {
        event: StatusProgressionsWebsocketType.DYNAMIC_UPDATE,
        verifyTimestamp: true,
      },
    },
  });
}

function useInitProgressionsWebsocketsHandlers() {
  const userProfileStore = useUserProfileStore();
  const { loadStatusData } = useLoadStatusData();
  const statusStore = useStatusStore();

  async function handleStaticUpdate(data: StatusProgressionsStaticWebsocket) {
    if (userProfileStore.userInfo && userProfileStore.userInfo.progressions) {
      const { order } = userProfileStore.userInfo.progressions.static;

      userProfileStore.setUserInfo({
        ...userProfileStore.userInfo,
        progressions: {
          ...userProfileStore.userInfo.progressions,
          static: data.data,
        },
      });

      await loadStatusData();
      const lastLevel = statusStore.levels[statusStore.staticLevels.length - 1];
      if (data.data.order > order && data.data.order <= lastLevel.data.order) {
        userEvents.emit('progressions.static.level-up');
      }
    }
  }
  function handleDynamicUpdate(data: StatusProgressionsDynamicWebsocket) {
    if (userProfileStore.userInfo && userProfileStore.userInfo.progressions) {
      const { isConfirmed, code } = userProfileStore.userInfo.progressions.dynamic;

      userProfileStore.setUserInfo({
        ...userProfileStore.userInfo,
        progressions: {
          ...userProfileStore.userInfo.progressions,
          dynamic: data.data,
        },
      });

      if (data.data.code > code) {
        userEvents.emit('progressions.dynamic.level-up');
      }
      if (code > 0 && !isConfirmed && data.data.isConfirmed) {
        userEvents.emit('progressions.dynamic.level-confirm');
      }
    }
  }

  onMounted(() => {
    userWebsocketsEvents.on(StatusProgressionsWebsocketType.STATIC_UPDATE, handleStaticUpdate);
    userWebsocketsEvents.on(StatusProgressionsWebsocketType.DYNAMIC_UPDATE, handleDynamicUpdate);
  });
}

export function useInitUserProgressionsWebsockets() {
  useInitProgressionsWebsocketsBridge();
  useInitProgressionsWebsocketsHandlers();
}
