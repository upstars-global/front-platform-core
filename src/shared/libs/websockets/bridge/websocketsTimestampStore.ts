import { defineStore } from "pinia";
import { ref } from "vue";

export const useWebsocketsTimestampsStore = defineStore("websocketsTimestamps", () => {
  const eventTimestamps = ref<Record<string, number>>({});

  function verifyEventTimestamp(event: string, value: number) {
    const existingTimestamp = getEventTimestamp(event);
    if (existingTimestamp !== null && existingTimestamp >= value) {
      return false;
    }

    eventTimestamps.value = {
      ...eventTimestamps.value,
      [event]: value,
    };

    return true;
  }
  function getEventTimestamp(event: string) {
    if (eventTimestamps.value[event]) {
      return eventTimestamps.value[event];
    }

    return null;
  }

  return {
    verifyEventTimestamp,
  };
});
