import type { IGiftActivateResource, IGiftResource } from "../../../shared/api";
import { giftsAPI } from "../api";
import { log } from "../../../shared/helpers/log";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserProfileStore } from "../../user/store";
import { GIFT_UNSELECTED } from "../config";

export const useGiftsStore = defineStore("gifts", () => {
    const userProfileStore = useUserProfileStore();

    const gifts = ref<IGiftResource[]>([]);
    const giftsLoaded = ref<boolean>(false);

    async function loadGiftsData(): Promise<void> {
        if (!userProfileStore.userInfo.multi_account) {
            const { items } = await giftsAPI.getGiftsList();
            gifts.value = items;
            giftsLoaded.value = true;
            loadPayoutGiftCount();
        }
    }
    function removeGiftById(id: string): void {
        gifts.value = gifts.value.filter((item) => {
            return item.id !== id;
        });
    }
    async function activateGift(id: string): Promise<IGiftActivateResource | undefined> {
        return await giftsAPI.activateGift(id);
    }
    async function activatePromoGift(giftName: string): Promise<void> {
        await giftsAPI.activatePromoGift(giftName);
        loadGiftsData();
    }
    function cleanGiftsData(): void {
        gifts.value = [];
        currentGiftId.value = "";
        payoutGiftCount.value = 0;
    }
    const getCashboxGifts = computed<IGiftResource[]>(() => {
        return gifts.value.filter((gift: IGiftResource) => {
            const depositLimit: number = gift.restrictions.depositLimit || 0;

            const depositProgress: number = gift.restrictionsState.depositProgress || 0;

            return depositLimit - depositProgress > 0;
        });
    });
    function getCashboxGiftsByDepositNumber(depositNumber: number): IGiftResource[] {
        return getCashboxGifts.value.filter((gift: IGiftResource) => {
            return gift.depositNumber === depositNumber;
        });
    }
    const getGiftCounter = computed<number>(() => {
        const now: number = Date.now();
        return gifts.value.filter((gift: IGiftResource) => {
            return Number(new Date(gift.expiredAt)) - now > 0;
        }).length;
    });
    function getGiftByGiftId(giftId: string): IGiftResource | undefined {
        return gifts.value.find((gift: IGiftResource) => {
            return gift.giftId === giftId;
        });
    }
    function getGiftById(id: string): IGiftResource | undefined {
        return gifts.value.find((gift: IGiftResource) => {
            return gift.id === id;
        });
    }
    const getMinDepositToReceiveBonus = computed<number>(() => {
        const array = [ ...getCashboxGifts.value ];
        if (array.length === 0) {
            return 0;
        }

        array.sort((giftA: IGiftResource, giftB: IGiftResource) => {
            return giftA.restrictions.depositLimit - giftB.restrictions.depositLimit;
        });
        return array[0].restrictions.depositLimit;
    });

    async function takeNonDepositGift(id: string): Promise<void> {
        const data = await giftsAPI.takeNonDepositGiftPrize(id);
        if (data) {
            if (data.success) {
                loadGiftsData();
                return;
            }
            log.error("Gift was not taked", data.error);
        }
    }

    const currentGiftId = ref<string>(GIFT_UNSELECTED.id);
    function setCurrentGift(giftId: string) {
        currentGiftId.value = giftId;
    }

    async function sendCurrentGift(operationId: string): Promise<void> {
        if (currentGiftId.value !== GIFT_UNSELECTED.id) {
            await giftsAPI.sendCurrentGift(currentGiftId.value, operationId);
        }
    }
    const getCurrentGift = computed<IGiftResource | undefined>(() => {
        return gifts.value.find((gift: IGiftResource) => {
            return gift.id === currentGiftId.value;
        });
    });

    const payoutGiftCount = ref<number>(0);
    async function loadPayoutGiftCount(): Promise<void> {
        const count = await giftsAPI.loadPayoutGiftCount();
        setPayoutGiftCount(count);
    }
    function setPayoutGiftCount(count: number): void {
        payoutGiftCount.value = count;
    }

    return {
        gifts,
        giftsLoaded,
        loadGiftsData,
        removeGiftById,
        activateGift,
        activatePromoGift,
        cleanGiftsData,
        getCashboxGifts,
        getCashboxGiftsByDepositNumber,
        getGiftCounter,
        getGiftByGiftId,
        getGiftById,
        getMinDepositToReceiveBonus,

        takeNonDepositGift,

        currentGiftId,
        setCurrentGift,
        sendCurrentGift,
        getCurrentGift,

        payoutGiftCount,
        loadPayoutGiftCount,
        setPayoutGiftCount,
    };
});
