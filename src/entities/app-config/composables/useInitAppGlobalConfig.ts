import { onMounted } from 'vue';
import { LocalStorageService } from '../../../shared/helpers/storages';
import { useFetchAppGlobalConfig } from './useFetchAppGlobalConfig';
import { useAppGlobalConfigStore } from '../store';
import { log } from '../../../shared/helpers';
import { getConfig } from '../config';

export function useInitAppGlobalConfig() {
  const appGlobalConfigStore = useAppGlobalConfigStore();
  const { loadAppGlobalConfig } = useFetchAppGlobalConfig();
  const { mirrorDomainKeyGetter, freshChatConfigKeyGetter } = getConfig();

  const localStorageService = new LocalStorageService();

  function setSWMirrorDomain(domain: string) {
    if (!mirrorDomainKeyGetter) {
      log.error('FAILED_TO_SET_MIRROR_DOMAIN_KEY_NOT_FOUND');
      return;
    }

    const mirrorDomain = localStorageService.getItem(mirrorDomainKeyGetter);

    if (mirrorDomain !== domain) {
      localStorageService.setItem(mirrorDomainKeyGetter, domain);
    }
  }

  async function init() {
    const config = await loadAppGlobalConfig();

    if (config) {
      appGlobalConfigStore.setGlobalConfig(config);

      if (config?.mirrorDomain) {
        setSWMirrorDomain(config.mirrorDomain);
      }

      if (config?.freshChatConfig) {
        if (!freshChatConfigKeyGetter) {
          log.error('FAILED_TO_SET_FRESHCHAT_CONFIG_KEY_NOT_FOUND');
          return;
        }

        localStorageService.setItem(freshChatConfigKeyGetter, JSON.stringify(config.freshChatConfig));
      }
    }
  }

  onMounted(async () => {
    await init();
  });
}
