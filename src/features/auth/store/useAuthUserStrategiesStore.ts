import { type UserStrategiesResource, profileType, treasuryType } from "../../../entities/user";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

function baseUserStrategies(): UserStrategiesResource {
    return {
        strategyProfile: {
            type: profileType.HARD,
        },
        strategyTreasury: {
            type: treasuryType.HARD,
        },
    };
}

export const useAuthUserStrategiesStore = defineStore("authUserStrategies", () => {
    const strategies = ref<UserStrategiesResource>(baseUserStrategies());

    function setStrategies(data: UserStrategiesResource) {
        strategies.value = {
            ...strategies.value,
            ...data,
        }
    }

    const isSimpleFlow = computed<boolean>(() => {
        return strategies.value.strategyProfile.type === profileType.SIMPLE;
    });

    const isBrazilFlow = computed<boolean>(() => {
        return strategies.value.strategyProfile.type === profileType.BRAZIL;
    });

    function cleanUserStrategies() {
        strategies.value = baseUserStrategies();
    }

    return {
        strategies,
        setStrategies,
        isSimpleFlow,
        isBrazilFlow,
        cleanUserStrategies,
    };
});
