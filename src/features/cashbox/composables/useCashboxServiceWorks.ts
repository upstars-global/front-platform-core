import { serverFeaturesMap } from "@theme/configs/serverFeaturesMap";
import {
    PREVENT_CASHBOX_SERVICE_WORKS_HASH,
    PREVENT_CASHBOX_SERVICE_WORKS_KEY,
} from "@controllers/services/cashbox/serviceWorks/config";
import { isServer } from "@helpers/ssrHelpers";
import { useUserInfo } from "@store/userInfo";

const PREVENT_VALUE = "1";

export function useCashboxServiceWorks() {
    const userInfoStore = useUserInfo();

    function isPrevent(): boolean {
        if (isServer) {
            return false;
        }
        const value = window.localStorage.getItem(PREVENT_CASHBOX_SERVICE_WORKS_KEY);
        return value === PREVENT_VALUE;
    }

    async function isServiceWorks(): Promise<boolean> {
        const features = await userInfoStore.loadUserFeatures();
        const hideCashboxFeature = features.find((item) => {
            return item.feature === serverFeaturesMap.hideCashbox;
        });

        const indicator = Boolean(hideCashboxFeature?.isAvailable);
        return indicator && !isPrevent();
    }

    function checkLocationHash() {
        if (isServer) {
            return;
        }
        if (window.location.hash === PREVENT_CASHBOX_SERVICE_WORKS_HASH) {
            window.localStorage.setItem(PREVENT_CASHBOX_SERVICE_WORKS_KEY, PREVENT_VALUE);
        }
    }

    return {
        isServiceWorks,
        checkLocationHash,
    };
}
