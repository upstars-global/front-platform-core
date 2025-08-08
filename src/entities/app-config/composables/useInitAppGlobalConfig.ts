import { onMounted } from 'vue';
import { LocalStorageService } from '../../../shared/helpers/storages';
import { useFetchAppGlobalConfig } from './useFetchAppGlobalConfig';
import { useAppGlobalConfigStore } from '../store';

const SW_MIRROR_DOMAIN_LOCAL_STORAGE_KEY = 'sw:mirrorDomain';
const SW_FRESHCHAT_CONFIG_LOCAL_STORAGE_KEY = 'sw:freshChatConfig';

export function useInitAppGlobalConfig() {
  const appGlobalConfigStore = useAppGlobalConfigStore();
  const { loadAppGlobalConfig } = useFetchAppGlobalConfig();

  const localStorageService = new LocalStorageService();

  function setSWMirrorDomain(domain: string) {
    const mirrorDomain = localStorageService.getItem(SW_MIRROR_DOMAIN_LOCAL_STORAGE_KEY);

    if (mirrorDomain !== domain) {
      localStorageService.setItem(SW_MIRROR_DOMAIN_LOCAL_STORAGE_KEY, domain);
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
        localStorageService.setItem(SW_FRESHCHAT_CONFIG_LOCAL_STORAGE_KEY, JSON.stringify(config.freshChatConfig));
      }
    }
  }

  onMounted(async () => {
    await init();
  });
}
