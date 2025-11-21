import { configCashbox } from '../../../../entities/cashbox';
import { isServer } from '../../../../shared';
import { useUserInfoLoad } from '../../../../entities/user';

const PREVENT_VALUE = '1';

const HIDE_CASHBOX_FEATURE = 'hide-cashbox';

export function useCashboxServiceWorks() {
  const { loadUserFeatures } = useUserInfoLoad();

  const serviceWorksKey = configCashbox.getPreventCashboxServiceWorksKey();

  function isPrevent(): boolean {
    if (isServer) {
      return false;
    }

    const value = window.localStorage.getItem(serviceWorksKey);
    return value === PREVENT_VALUE;
  }

  async function isServiceWorks(): Promise<boolean> {
    const features = await loadUserFeatures();
    const hideCashboxFeature = features.find((item) => {
      return item.feature === HIDE_CASHBOX_FEATURE;
    });

    const indicator = Boolean(hideCashboxFeature?.isAvailable);
    return indicator && !isPrevent();
  }

  function checkLocationHash() {
    if (isServer) {
      return;
    }

    if (window.location.hash === configCashbox.getPreventCashboxServiceWorksHash()) {
      window.localStorage.setItem(serviceWorksKey, PREVENT_VALUE);
    }
  }

  return {
    isServiceWorks,
    checkLocationHash,
  };
}
