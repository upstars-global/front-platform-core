import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useSmarticoStore = defineStore('smartico', () => {
  const isSmarticoLoaded = ref(false);

  function setSmarticoLoaded(value: boolean) {
    isSmarticoLoaded.value = value;
  }

  return { isSmarticoLoaded: computed(() => isSmarticoLoaded.value), setSmarticoLoaded };
});
