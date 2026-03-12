import { isServer } from '../ssr';
import { LocalStorageKeyController } from '../storages/localStorage';

const IOS_APP_QUERY_PARAM = 'iosapp';
const IOS_APP_QUERY_VALUE = 'true';
export const IOS_NATIVE_APP_KEY = 'ios_native_app';

const storageController = new LocalStorageKeyController<boolean>(IOS_NATIVE_APP_KEY, {
    defaultValue: () => false,
});

function detectIosNativeAppFromUrl(): boolean {
    if (isServer) {
        return false;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get(IOS_APP_QUERY_PARAM) === IOS_APP_QUERY_VALUE;
}

let cachedIsIosApp: boolean | null = null;

export function isIosNativeApp(): boolean {
    if (cachedIsIosApp !== null) {
        return cachedIsIosApp;
    }

    if (detectIosNativeAppFromUrl()) {
        storageController.set(true);
        cachedIsIosApp = true;
    } else {
        cachedIsIosApp = storageController.get();
    }

    return cachedIsIosApp;
}