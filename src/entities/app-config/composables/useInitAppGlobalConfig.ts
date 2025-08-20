import { onMounted } from 'vue';
import { LocalStorageService } from '../../../shared/helpers/storages';
import { useFetchAppGlobalConfig } from './useFetchAppGlobalConfig';
import { useAppGlobalConfigStore } from '../store';
import { log } from '../../../shared/helpers';

type MirrorDomainKeyGetter = string | null;
type FreshChatConfigKeyGetter = string | null;

let mirrorDomainKeyGetter: MirrorDomainKeyGetter = null;
let freshChatConfigKeyGetter: FreshChatConfigKeyGetter = null;

export function useInitAppGlobalConfig() {
  const appGlobalConfigStore = useAppGlobalConfigStore();
  const { loadAppGlobalConfig } = useFetchAppGlobalConfig();

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

export const configAppGlobalConfig = {
  setMirrorDomainKey: (value: string) => {
    mirrorDomainKeyGetter = value;
  },
  setFreshChatConfigKey: (value: string) => {
    freshChatConfigKeyGetter = value;
  },
};
