import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useWebsocketsStatusStore = defineStore("websocketsStatus", () => {
    const isConnected = ref(false);

    function setConnected(value: boolean) {
        isConnected.value = value;
    }

    return {
        isConnected: computed(() => isConnected.value),
        setConnected,
    };
});
