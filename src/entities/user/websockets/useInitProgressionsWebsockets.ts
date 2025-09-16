import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import { userWebsocketsEvents } from './emitter';
import { useUserProfileStore } from '../store';
import {
  type StatusProgressionsDynamicWebsocket,
  type StatusProgressionsStaticWebsocket,
  StatusProgressionsWebsocketType,
} from './types';
import { onMounted } from 'vue';
import { userEvents } from '../emitter';

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

  function handleStaticUpdate(data: StatusProgressionsStaticWebsocket) {
    if (userProfileStore.userInfo && userProfileStore.userInfo.progressions) {
      const { order } = userProfileStore.userInfo.progressions.static;

      userProfileStore.setUserInfo({
        ...userProfileStore.userInfo,
        progressions: {
          ...userProfileStore.userInfo.progressions,
          static: data.data,
        },
      });

      if (data.data.order > order) {
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
      if (!isConfirmed && data.data.isConfirmed) {
        userEvents.emit('progressions.dynamic.level-confirm');
      }
    }
  }

  onMounted(() => {
    userWebsocketsEvents.on(StatusProgressionsWebsocketType.STATIC_UPDATE, handleStaticUpdate);
    userWebsocketsEvents.on(StatusProgressionsWebsocketType.DYNAMIC_UPDATE, handleDynamicUpdate);
  });
}

export function useInitProgressionsWebsockets() {
  useInitProgressionsWebsocketsBridge();
  useInitProgressionsWebsocketsHandlers();
}
