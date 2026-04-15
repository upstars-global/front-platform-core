import { isServer } from '../ssr';
import { LocalStorageKeyController } from '../storages/localStorage';

const IOS_APP_NAME_QUERY_PARAM = 'iosappname';
export const IOS_APP_NAME_KEY = 'ios_app_name';

const storageController = new LocalStorageKeyController<string | null>(IOS_APP_NAME_KEY, {
    defaultValue: () => null,
});

let cachedIosAppName: string | null | undefined = undefined;

export function iosAppName(): string | null {
    if (cachedIosAppName !== undefined) {
        return cachedIosAppName;
    }

    if (!isServer) {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(IOS_APP_NAME_QUERY_PARAM);
        if (value !== null) {
            storageController.set(value);
            cachedIosAppName = value;
            return cachedIosAppName;
        }
    }

    cachedIosAppName = storageController.get();
    return cachedIosAppName;
}
