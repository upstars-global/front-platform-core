import { computed, onMounted, ref } from 'vue';
import type { Pinia } from 'pinia';
import { useAppGlobalConfigStore } from '../../../entities/app-config';
import { DMCA_REFURL_PARAM, DMCA_STATUS_URL_BASE } from '../config';

/**
 * Reusable DMCA badge logic.
 *
 * The site-specific key comes from the global config (resolved per-domain on the
 * server). Rendering off the reactive store getter makes the badge:
 *  - absent during SSG warming (config not loaded — domain unknown),
 *  - present during runtime SSR for bots (config loaded via onServerPrefetch),
 *  - present in SPA after the config is fetched on mount.
 *
 * The `refurl` query param (current page url) is appended on the client only,
 * replicating the official DMCABadgeHelper.min.js so we avoid loading a 3rd-party script.
 */
export function useDmcaBadge(pinia?: Pinia) {
  const appGlobalConfigStore = useAppGlobalConfigStore(pinia);

  const dmcaConfig = computed(() => appGlobalConfigStore.dmcaProtection);

  // Per-domain verification key — used for the `dmca-site-verification` meta tag.
  const dmcaKey = computed(() => dmcaConfig.value?.key);
  // Project-wide account id — used as the badge status link `ID`.
  const accountId = computed(() => dmcaConfig.value?.accountId);

  const isEnabled = computed(() => Boolean(accountId.value && dmcaKey.value));

  const baseHref = computed(() => (accountId.value ? `${DMCA_STATUS_URL_BASE}${accountId.value}` : ''));

  // Filled on the client only — `document` is unavailable during SSR/SSG.
  const refUrl = ref('');

  onMounted(() => {
    if (typeof document !== 'undefined') {
      refUrl.value = document.location.href;
    }
  });

  const href = computed(() => {
    if (!baseHref.value) {
      return '';
    }
    if (!refUrl.value) {
      return baseHref.value;
    }
    const separator = baseHref.value.includes('?') ? '&' : '?';

    return `${baseHref.value}${separator}${DMCA_REFURL_PARAM}=${refUrl.value}`;
  });

  return {
    isEnabled,
    dmcaKey,
    accountId,
    href,
  };
}
