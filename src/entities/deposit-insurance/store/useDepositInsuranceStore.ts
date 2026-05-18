import { ref } from "vue";
import type { DIInfoResource } from "../api";
import { defineStore } from "pinia";

export const useDepositInsuranceStore = defineStore('depositInsuranceStore', () => {
  const info = ref<DIInfoResource | null>(null);
  const isLoaded = ref(false);

  function setInfo(data: DIInfoResource) {
    info.value = data;
  }

  function setIsLoaded(value: boolean) {
    isLoaded.value = value;
  }

  function resetIsLoaded() {
    isLoaded.value = false;
  }

  function resetInfo() {
    info.value = null;
  }

  return {
    info,
    setInfo,
    resetInfo,
    isLoaded,
    setIsLoaded,
    resetIsLoaded,
  };
});