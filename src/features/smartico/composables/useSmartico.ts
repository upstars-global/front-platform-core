import { watch } from 'vue';
import { type Pinia, storeToRefs } from 'pinia';
import { isServer, log } from '../../../shared';
import { useAppGlobalConfigStore } from '../../../entities/app-config';
import { useUserProfileStore } from '../../../entities/user';
import { useSmarticoStore } from '../store';

export function useSmartico(pinia?: Pinia) {
  const { globalConfig } = storeToRefs(useAppGlobalConfigStore(pinia));
  const userProfileStore = useUserProfileStore(pinia);
  const { setSmarticoLoaded } = useSmarticoStore(pinia);

  function setSmarticoUserId(userId: string | null) {
    window._smartico_user_id = userId;
  }

  function setSmarticoUserLocale(locale: string | null) {
    window._smartico_language = locale;
  }

  function setSmarticoUser(isLogged: boolean) {
    if (isServer) {
      return;
    }

    if (isLogged) {
      setSmarticoUserId(userProfileStore.userInfo.user_id);
      setSmarticoUserLocale(userProfileStore.userInfo.localization);
    } else {
      setSmarticoUserId(null);
      setSmarticoUserLocale(null);
    }
  }

  function initSmartico() {
    if (isServer || window?._smartico_lib_loaded__smartico) {
      return;
    }

    window._smartico_allow_localhost = window.location.hostname === 'localhost';

    const smarticoConfig = globalConfig.value?.smartico;
    if (!smarticoConfig) {
      return;
    }

    const { key, token, scriptUrl } = smarticoConfig;

    if (!key || !token || !scriptUrl) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.onload = () => {
      _smartico?.init(token, { brand_key: key });
      _smartico?.on('init', () => {
        setSmarticoUser(userProfileStore.isLogged);
      })
      _smartico?.on('identify', (errCode: number) => {
        setSmarticoLoaded(errCode === 0);
      });
    };
    script.onerror = (error) => {
      log.error('SMARTICO_SCRIPT_LOAD_ERROR', error);
    };
    script.src = scriptUrl;

    document.head.appendChild(script);
  }

  watch(
    () => globalConfig.value?.smartico,
    (value, oldValue) => {
      if (value?.key === oldValue?.key) {
        initSmartico();
      }
    },
    { once: true },
  );

  watch(
    () => userProfileStore.isLogged,
    (isLogged) => setSmarticoUser(isLogged),
    { immediate: true },
  );

  return { initSmartico };
}
