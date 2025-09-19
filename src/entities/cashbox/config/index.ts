type CashboxState = {
    coins: number;
    withdrawCancelMinBalance: {
        [key: string]: number;
    };
    preventCashboxServiceWorksHash: string;
    preventCashboxServiceWorksKey: string;
}

const COINS = 100;

export const DEFAULT_VALUES = {
    refillAmount: 500 * COINS,
};

const PREVENT_CASHBOX_SERVICE_WORKS_HASH = "#show-cashbox-force";
const PREVENT_CASHBOX_SERVICE_WORKS_KEY = "PREVENT_CASHBOX_SERVICE_WORKS_KEY";

export enum PAYMENT_METHOD {
    INTERAC = "interac",
}

const defaultCashboxState: CashboxState = {
    coins: COINS,
    withdrawCancelMinBalance: {
        RUB: 20000,
        INR: 20000,
        EUR: 200,
        USD: 200,
        AUD: 200,
        NZD: 200,
        CAD: 200,
        KZT: 80000,
    },
    preventCashboxServiceWorksHash: PREVENT_CASHBOX_SERVICE_WORKS_HASH,
    preventCashboxServiceWorksKey: PREVENT_CASHBOX_SERVICE_WORKS_KEY,
}

let cashboxState: CashboxState = {
    ...defaultCashboxState,
}

export const configCashbox = {
    getCoins: () => {
        return cashboxState.coins;
    },
    setCoins: (coins: number) => {
        cashboxState.coins = coins;
    },
    getWithdrawCancelMinBalance: () => {
        return cashboxState.withdrawCancelMinBalance;
    },
    setWithdrawCancelMinBalance: (withdrawCancelMinBalance: CashboxState['withdrawCancelMinBalance']) => {
        cashboxState.withdrawCancelMinBalance = withdrawCancelMinBalance;
    },
    getPreventCashboxServiceWorksHash: () => {
        return cashboxState.preventCashboxServiceWorksHash;
    },
    setPreventCashboxServiceWorksHash: (preventCashboxServiceWorksHash: CashboxState['preventCashboxServiceWorksHash']) => {
        cashboxState.preventCashboxServiceWorksHash = preventCashboxServiceWorksHash;
    },
    getPreventCashboxServiceWorksKey: () => {
        return cashboxState.preventCashboxServiceWorksKey;
    },
    setPreventCashboxServiceWorksKey: (preventCashboxServiceWorksKey: CashboxState['preventCashboxServiceWorksKey']) => {
        cashboxState.preventCashboxServiceWorksKey = preventCashboxServiceWorksKey;
    },
    resetCashboxConfig: () => {
        cashboxState = {
            ...defaultCashboxState,
        };
    },
}