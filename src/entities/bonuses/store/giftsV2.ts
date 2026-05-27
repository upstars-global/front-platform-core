import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { giftsAPI } from "../api";
import { BonusType, GetUserGiftsAvailability, GetUserGiftsSubtype, type IGiftResourceV2 } from "../api/types";
import { promiseMemo } from "../../../shared";
import { useUserProfileStore, useUserProfile } from "../../user";

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

interface IUpdateGiftItem {
    giftId: string;
    bonus: number;
    bonusWagering: number;
}
interface IUpdateGift {
    [BonusType.CASINO]?: IUpdateGiftItem,
    [BonusType.SPORT]?: IUpdateGiftItem,
    [BonusType.INSURANCE]?: IUpdateGiftItem,
}

export const useGiftsStoreV2 = defineStore("giftsV2", () => {
    const { isLoggedAsync } = useUserProfile();
    const userProfileStore = useUserProfileStore();

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
    function setIsSilentLoading(value: boolean) {
        isSilentLoading.value = value;
    }

    async function request(subType: GetUserGiftsSubtype, availability: GetUserGiftsAvailability) {
        return await giftsAPI.getUserGiftsV2({
            filter: {
                subType,
                availability,
            },
            pagination: {
                pageNumber: 1,
                perPage: 100,
            },
        });
    }

    function setFlagUpdatedSilently(value: boolean) {
        shouldBeUpdatedSilently.value = value;
    }

    async function checkLoadingGifts() {
        const isLogged = await isLoggedAsync();
        return isLogged && !userProfileStore.userInfo.multi_account;
    }

    /** @deprecated Use `useLoadGiftsV2().loadHistoryGifts` instead. */
    const loadHistoryGifts = promiseMemo(async () => {
        if (!await checkLoadingGifts()) {
            return;
        }

        const promises = [ GetUserGiftsSubtype.SPORT, GetUserGiftsSubtype.CASINO ].map(async (subtype) => {
            return await request(subtype, GetUserGiftsAvailability.HISTORY);
        });
        const [ sport, casino ] = await Promise.all(promises);
        historyGifts.value = {
            [BonusType.CASINO]: casino.items,
            [BonusType.SPORT]: sport.items,
        };
    });

    /** @deprecated Use `useLoadGiftsV2().updateActiveGifts` instead. */
    async function updateActiveGifts(update: IUpdateGift, silent?: boolean) {
        const [ activeCasinoGift ] = activeGifts.value[BonusType.CASINO];
        const [ activeSportGift ] = activeGifts.value[BonusType.SPORT];

        const casinoUpdate = update[BonusType.CASINO];
        const sportUpdate = update[BonusType.SPORT];

        const compareGiftUpdate = (gift?: IGiftResourceV2, updateItem?: IUpdateGiftItem) => {
            if (!updateItem && !gift) {
                return true;
            }
            return updateItem && gift && updateItem.giftId === gift.id;
        };

        const activeNeedUpdate = !compareGiftUpdate(activeCasinoGift, casinoUpdate);
        const sportNeedUpdate = !compareGiftUpdate(activeSportGift, sportUpdate);

        if (!silent && (activeNeedUpdate || sportNeedUpdate)) {
            await loadData();
            return;
        }

        if (casinoUpdate && activeCasinoGift?.bonus) {
            activeCasinoGift.bonus = {
                ...activeCasinoGift.bonus,
                value: casinoUpdate.bonus,
                wager: {
                    ...activeCasinoGift.bonus.wager,
                    value: casinoUpdate.bonusWagering,
                },
            };
        }

        if (sportUpdate && activeSportGift?.bonus) {
            activeSportGift.bonus = {
                ...activeSportGift.bonus,
                value: sportUpdate.bonus,
                wager: {
                    ...activeSportGift.bonus.wager,
                    value: sportUpdate.bonusWagering,
                },
            };
        }
    }

    const fetchGifts = async () => {
        const response = await giftsAPI.getAllUserGiftsV2();
        const casinoActive = response[GetUserGiftsAvailability.ACTIVE].filter((gift) => {
            return gift.subType === GetUserGiftsSubtype.CASINO;
        });
        const sportActive = response[GetUserGiftsAvailability.ACTIVE].filter((gift) => {
            return gift.subType === GetUserGiftsSubtype.SPORT;
        });

        const casinoAvailable = response[GetUserGiftsAvailability.AVAILABLE].filter((gift) => {
            return gift.subType === GetUserGiftsSubtype.CASINO;
        });
        const sportAvailable = response[GetUserGiftsAvailability.AVAILABLE].filter((gift) => {
            return gift.subType === GetUserGiftsSubtype.SPORT;
        });

        activeGifts.value = {
            [BonusType.CASINO]: casinoActive,
            [BonusType.SPORT]: sportActive,
        };

        availableGifts.value = {
            [BonusType.CASINO]: casinoAvailable,
            [BonusType.SPORT]: sportAvailable,
        };
    };

    /** @deprecated Use `useLoadGiftsV2().loadDataSilently` instead. */
    const loadDataSilently = async () => {
        if (!shouldBeUpdatedSilently.value) {
            return;
        }
        isSilentLoading.value = true;
        await fetchGifts();
        isSilentLoading.value = false;
        setFlagUpdatedSilently(false);
    };

    /** @deprecated Use `useLoadGiftsV2().loadData` instead. */
    const loadData = promiseMemo(async () => {
        if (!await checkLoadingGifts()) {
            isInit.value = true;
            return;
        }
        await fetchGifts();
        isInit.value = true;
    });

    /** @deprecated Use `useLoadGiftsV2().initData` instead. */
    async function initData() {
        if (!isInit.value && await isLoggedAsync()) {
            await loadData();
        }
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

        loadData,
        loadDataSilently,
        initData,
        resetData,
        updateActiveGifts,
        loadHistoryGifts,
    };
});
