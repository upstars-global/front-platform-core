import { computed, ref, type Ref, watch } from "vue";

export interface CryptoPayment {
    tags: string[];
    originalRouteName: string;
}

export const CRYPTO_TAG = "crypto";
const CRYPTO_SHORT_COUNT = 3;
const CRYPTO_OVERRIDE_ORDER = [
    "btc", // Bitcoin
    "eth", // Ethereum
    "usdt", // Tether
];

export function useFiatCryptoSplit<T extends CryptoPayment>(payments: Ref<T[]>) {
    const fiatPayments = computed(() => {
        return payments.value.filter((payment) => {
            return !payment.tags.includes(CRYPTO_TAG);
        });
    });
    
    const cryptoPayments = computed(() => {
        return payments.value.filter((payment) => {
            return payment.tags.includes(CRYPTO_TAG);
        }).sort((paymentA, paymentB) => {
            let indexA = CRYPTO_OVERRIDE_ORDER.findIndex((name) => {
                return name === paymentA.originalRouteName;
            });
            let indexB = CRYPTO_OVERRIDE_ORDER.findIndex((name) => {
                return name === paymentB.originalRouteName;
            });

            indexA = indexA === -1 ? CRYPTO_OVERRIDE_ORDER.length : indexA;
            indexB = indexB === -1 ? CRYPTO_OVERRIDE_ORDER.length : indexB;

            return indexA - indexB;
        });
    });

    const showAllCrypto = ref<boolean>(true);

    const shortCryptoPayments = computed(() => {
        if (showAllCrypto.value) {
            return cryptoPayments.value;
        }

        return cryptoPayments.value.slice(0, CRYPTO_SHORT_COUNT);
    });

    watch(payments, () => {
        showAllCrypto.value = cryptoPayments.value.length <= CRYPTO_SHORT_COUNT;
    }, {
        immediate: true,
    });

    return {
        showAllCrypto,
        fiatPayments,
        cryptoPayments,
        shortCryptoPayments,
    };
}
