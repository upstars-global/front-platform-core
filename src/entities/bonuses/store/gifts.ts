import type { IGiftResource } from "../api/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { GIFT_UNSELECTED } from "../config";

export const useGiftsStore = defineStore("gifts", () => {
    const gifts = ref<IGiftResource[]>([]);
    const giftsLoaded = ref<boolean>(false);

    function setGifts(data: IGiftResource[]) {
        gifts.value = data;
    }
    function setGiftsLoaded(value: boolean) {
        giftsLoaded.value = value;
    }
    function removeGiftById(id: string): void {
        gifts.value = gifts.value.filter((item) => {
            return item.id !== id;
        });
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

    const currentGiftId = ref<string>(GIFT_UNSELECTED.id);
    function setCurrentGift(giftId: string) {
        currentGiftId.value = giftId;
    }

    const getCurrentGift = computed<IGiftResource | undefined>(() => {
        return gifts.value.find((gift: IGiftResource) => {
            return gift.id === currentGiftId.value;
        });
    });

    const payoutGiftCount = ref<number>(0);
    function setPayoutGiftCount(count: number): void {
        payoutGiftCount.value = count;
    }

    return {
        gifts,
        giftsLoaded,
        setGifts,
        setGiftsLoaded,
        removeGiftById,
        cleanGiftsData,
        getCashboxGifts,
        getCashboxGiftsByDepositNumber,
        getGiftCounter,
        getGiftByGiftId,
        getGiftById,
        getMinDepositToReceiveBonus,

        currentGiftId,
        setCurrentGift,
        getCurrentGift,

        payoutGiftCount,
        setPayoutGiftCount,
    };
});
