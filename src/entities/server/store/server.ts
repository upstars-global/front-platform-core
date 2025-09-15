import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ServerData } from '../types';
import { serverAPI } from '../api';
import { DEFAULT_CURRENCY } from '../../../shared/config';

export const useServerStore = defineStore('server', () => {
  const apiUrl = ref('/');
  const serverData = ref<ServerData>({
    currencies: [],
    defaultCurrency: DEFAULT_CURRENCY,
    metrics: {},
  });

  const captchaKey = computed(() => serverData.value.captcha?.site_key);
  const captchaForRegistration = computed(() => serverData.value.captcha?.enabled_register);
  const captchaForLogin = computed(() => serverData.value.captcha?.enabled_login);
  const communicationChanelUrl = computed(() => serverData.value.promoTelegramChannelUrl);
  const currencies = computed(() => serverData.value.currencies);
  const defaultCurrency = computed(() => serverData.value.defaultCurrency);
  const freshChatConfig = computed(() => serverData.value.callCenterConfig?.freshchat);
  const liveChatConfig = computed(() => serverData.value.callCenterConfig?.livechat);
  const metricsConfig = computed(() => serverData.value.metrics);
  const valdemoroConfig = computed(() => serverData.value.valdemoro);
  const webPushKey = computed(() => serverData.value.webPushKey);

  const setApiUrl = (url: string) => {
    apiUrl.value = url;
  };
  const setServerData = (payload?: ServerData) => {
    if (!payload) {
      return;
    }

    serverData.value = {
      ...serverData.value,
      ...payload,
    };
  };

  const loadServerData = async (): Promise<ServerData | undefined> => {
    if (serverData.value.isLoaded) {
      return Promise.resolve(serverData.value);
    }

    const data = await serverAPI.loadServerData();
    setServerData(data);

    return data;
  };

  return {
    apiUrl,
    captchaKey,
    captchaForLogin,
    captchaForRegistration,
    communicationChanelUrl,
    currencies,
    defaultCurrency,
    freshChatConfig,
    liveChatConfig,
    metricsConfig,
    valdemoroConfig,
    webPushKey,
    serverData,
    setApiUrl,
    loadServerData,
  };
});
