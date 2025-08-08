import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { IClientContextResource } from '../../../shared/types';

export const useContextStore = defineStore('context', () => {
  const context = ref<IClientContextResource>();

  function setContext(value: IClientContextResource) {
    context.value = value;
  }

  return {
    context,
    setContext,
    isMobile: computed(() => context.value?.isMobile),
    isIOS: computed(() => context.value?.isIOS),
    isMacOS: computed(() => context.value?.isMacOS),
    browser: computed(() => context.value?.browser),
    isBot: computed(() => context.value?.isBot),
  };
});
