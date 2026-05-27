import type { Pinia } from "pinia";
import { giftsAPI } from "../api";
import { log } from "../../../shared/helpers/log";
import { useGiftsStore } from "../store";
import { useUserProfileStore } from "../../user/store";
import { GIFT_UNSELECTED } from "../config";

export function useLoadGifts(pinia?: Pinia) {
    const store = useGiftsStore(pinia);
    const userProfileStore = useUserProfileStore(pinia);

    async function loadGiftsData() {
        if (!userProfileStore.userInfo.multi_account) {
            const { items } = await giftsAPI.getGiftsList();
            store.setGifts(items);
            store.setGiftsLoaded(true);
            loadPayoutGiftCount();
        }
    }

    async function activateGift(id: string) {
        return await giftsAPI.activateGift(id);
    }

    async function activatePromoGift(giftName: string) {
        await giftsAPI.activatePromoGift(giftName);
        loadGiftsData();
    }

    async function takeNonDepositGift(id: string) {
        const data = await giftsAPI.takeNonDepositGiftPrize(id);
        if (data) {
            if (data.success) {
                loadGiftsData();
                return;
            }
            log.error("Gift was not taked", data.error);
        }
    }

    async function sendCurrentGift(operationId: string) {
        if (store.currentGiftId !== GIFT_UNSELECTED.id) {
            await giftsAPI.sendCurrentGift(store.currentGiftId, operationId);
        }
    }

    async function loadPayoutGiftCount(){
        const count = await giftsAPI.loadPayoutGiftCount();
        store.setPayoutGiftCount(count);
    }

    return {
        loadGiftsData,
        activateGift,
        activatePromoGift,
        takeNonDepositGift,
        sendCurrentGift,
        loadPayoutGiftCount,
    };
}
