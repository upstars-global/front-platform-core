import { giftsAPI } from "../api";
import { BonusType, GetUserGiftsAvailability, GetUserGiftsSubtype, type IGiftResourceV2 } from "../api/types";
import { promiseMemo } from '../../../shared';
import { useUserProfileStore, useUserProfile } from "../../user";
import { useGiftsStoreV2 } from "../store";

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

export function useLoadGiftsV2() {
    const store = useGiftsStoreV2();
    const { isLoggedAsync } = useUserProfile();
    const userProfileStore = useUserProfileStore();

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

    async function checkLoadingGifts() {
        const isLogged = await isLoggedAsync();
        return isLogged && !userProfileStore.userInfo.multi_account;
    }

    const loadHistoryGifts = promiseMemo(async () => {
        if (!await checkLoadingGifts()) {
            return;
        }

        const promises = [ GetUserGiftsSubtype.SPORT, GetUserGiftsSubtype.CASINO ].map(async (subtype) => {
            return await request(subtype, GetUserGiftsAvailability.HISTORY);
        });
        const [ sport, casino ] = await Promise.all(promises);
        store.setHistoryGifts({
            [BonusType.CASINO]: casino.items,
            [BonusType.SPORT]: sport.items,
        });
    });

    async function updateActiveGifts(update: IUpdateGift, silent?: boolean) {
        const [ activeCasinoGift ] = store.activeGifts[BonusType.CASINO];
        const [ activeSportGift ] = store.activeGifts[BonusType.SPORT];

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

        store.setActiveGifts({
            [BonusType.CASINO]: casinoActive,
            [BonusType.SPORT]: sportActive,
        });

        store.setAvailableGifts({
            [BonusType.CASINO]: casinoAvailable,
            [BonusType.SPORT]: sportAvailable,
        });
    };

    const loadDataSilently = async () => {
        if (!store.shouldBeUpdatedSilently) {
            return;
        }
        store.setIsSilentLoading(true);
        await fetchGifts();
        store.setIsSilentLoading(false);
        store.setFlagUpdatedSilently(false);
    };

    const loadData = promiseMemo(async () => {
        if (!await checkLoadingGifts()) {
            store.setIsInit(true);
            return;
        }
        await fetchGifts();
        store.setIsInit(true);
    });

    async function initData() {
        if (!store.isInit && await isLoggedAsync()) {
            await loadData();
        }
    }

    return {
        loadData,
        loadDataSilently,
        initData,
        updateActiveGifts,
        loadHistoryGifts,
    };
}
