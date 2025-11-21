import { computed } from "vue";
import { useCashboxStore } from "../../store";
import { PAYMENT_METHOD } from '../../../../entities/cashbox';
import { isTargetPaymentProcessor } from '../../helpers';

export const usePaymentProcessingDisclaimer = () => {
    const cashboxStore = useCashboxStore();

    const activeDepositPaymentIsInterac = computed(() => {
        return isTargetPaymentProcessor({
            processorId:  cashboxStore.depositPayment?.routeName,
            targetId: PAYMENT_METHOD.INTERAC,
        });
    });

    return {
        activeDepositPaymentIsInterac,
    };
};
