import { computed, toValue } from 'vue';
import type { Ref } from 'vue';
import { useAppGlobalConfigStore } from '../../../entities/app-config';
import { useMultiLangStore } from '../../../entities/multilang';
import { isServer } from '../../../shared';
import { DMCA_REFURL_PARAM, DMCA_STATUS_URL_BASE } from '../config';

type UseDmcaBadgeOptions = {
  // Current page path (e.g. route.fullPath) used to build the `refurl`.
  // Passed in by the consuming app so this feature stays router-agnostic.
  currentPath?: Ref<string> | (() => string);
};

/**
 * Reusable DMCA badge logic.
 *
 * The config (project-wide account id + per-domain key) comes from the global
 * config, resolved per-domain on the server. Rendering off the reactive store
 * getter makes the badge:
 *  - absent during SSG warming (config not loaded — domain unknown),
 *  - present during runtime SSR for bots (config loaded via onServerPrefetch),
 *  - present in SPA after the config is fetched on mount.
 *
 * The `refurl` query param (current page url) replicates the official
 * DMCABadgeHelper.min.js so we avoid loading a 3rd-party script. It is built
 * deterministically from the runtime host + current path, so it is present in
 * the SSR markup (for bots) and matches on client hydration.
 */
export function useDmcaBadge({ currentPath }: UseDmcaBadgeOptions = {}) {
  const appGlobalConfigStore = useAppGlobalConfigStore();
  const multiLangStore = useMultiLangStore();

  const dmcaConfig = computed(() => appGlobalConfigStore.dmcaProtection);

  // Per-domain verification key — used for the `dmca-site-verification` meta tag.
  const dmcaKey = computed(() => dmcaConfig.value?.key);
  // Project-wide account id — used as the badge status link `ID`.
  const accountId = computed(() => dmcaConfig.value?.accountId);

  const isEnabled = computed(() => Boolean(accountId.value && dmcaKey.value));

  const baseHref = computed(() => (accountId.value ? `${DMCA_STATUS_URL_BASE}${accountId.value}` : ''));

  // Host is known during runtime SSR (bots) via the store, and on the client via
  // window.location — both available at hydration, so the value stays consistent.
  const refUrl = computed(() => {
    const host = multiLangStore.runtimeHostnameDuringSSR || (isServer ? '' : window.location.hostname);
    if (!host) {
      return '';
    }
    const path = currentPath ? toValue(currentPath) || '/' : '/';

    return `https://${host}${path}`;
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
