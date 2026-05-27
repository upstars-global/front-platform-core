import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { BonusType, type IGiftResourceV2 } from "../api/types";

interface IGiftsByType {
    [BonusType.CASINO]: IGiftResourceV2[];
    [BonusType.SPORT]: IGiftResourceV2[];
    [BonusType.INSURANCE]?: IGiftResourceV2[];
}

const defaultGiftsByType = (): IGiftsByType => ({
    [BonusType.CASINO]: [],
    [BonusType.SPORT]: [],
    [BonusType.INSURANCE]: [],
});

export type { IGiftsByType };

export const useGiftsStoreV2 = defineStore("giftsV2", () => {
    const isInit = ref<boolean>(false);
    const shouldBeUpdatedSilently = ref<boolean>(false);
    const isSilentLoading = ref<boolean>(false);

    const activeGifts = ref<IGiftsByType>(defaultGiftsByType());
    const availableGifts = ref<IGiftsByType>(defaultGiftsByType());
    // will be implemented with pagination
    const historyGifts = ref<IGiftsByType>(defaultGiftsByType());

    const giftsCount = computed(() => {
        const activeCount = Object.values(activeGifts.value).reduce((acc, cur) => acc + cur.length, 0);
        const availableCount = Object.values(availableGifts.value).reduce((acc, cur) => acc + cur.length, 0);
        return activeCount + availableCount;
    });

    function setActiveGifts(data: IGiftsByType) {
        activeGifts.value = data;
    }
    function setAvailableGifts(data: IGiftsByType) {
        availableGifts.value = data;
    }
    function setHistoryGifts(data: IGiftsByType) {
        historyGifts.value = data;
    }
    function setIsInit(value: boolean) {
        isInit.value = value;
    }
    function setFlagUpdatedSilently(value: boolean) {
        shouldBeUpdatedSilently.value = value;
    }
    function setIsSilentLoading(value: boolean) {
        isSilentLoading.value = value;
    }

    function resetData() {
        activeGifts.value = defaultGiftsByType();
        availableGifts.value = defaultGiftsByType();
        historyGifts.value = defaultGiftsByType();
        isInit.value = false;
    }

    return {
        availableGifts,
        activeGifts,
        historyGifts,
        giftsCount,
        isInit,
        shouldBeUpdatedSilently,
        isSilentLoading,

        setActiveGifts,
        setAvailableGifts,
        setHistoryGifts,
        setIsInit,
        setFlagUpdatedSilently,
        setIsSilentLoading,
        resetData,
    };
});
