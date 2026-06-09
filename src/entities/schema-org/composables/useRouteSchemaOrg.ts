import { onServerPrefetch, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useMultiLangStore } from '../../multilang';
import { configAPI } from '../../app-config';
import { isServer } from '../../../shared';
import { useSchemaOrgStore } from '../store';
import { buildSchemaFetchParams, buildSchemaScriptEntry, isServerSchemaFetchAllowed } from '../helpers';
import type { SchemaFetchAssets, SchemaHost, SchemasByPath } from '../types';


async function fetchSchemasForHost(fetchParams: string): Promise<SchemasByPath> {
  const raw = await configAPI.loadSchemaOrgByPath<SchemasByPath>(fetchParams);
  return raw ?? {};
}

export function useRouteSchemaOrg(options: SchemaFetchAssets): void {
  const { bookmarkPath, logoPath } = options;

  const route = useRoute();
  const multiLangStore = useMultiLangStore();
  const store = useSchemaOrgStore();

  const fetchParams = buildSchemaFetchParams({ bookmarkPath, logoPath });

  // UseHeadInput<T> accepts () => ReactiveHead as a getter function.
  // Fresh object literals bypass the DataKeys index signature check on Script<E>.
  useHead(() => {
    const entry = buildSchemaScriptEntry(store.activeSchemas);
    if (!entry) {
      return { script: [] };
    }
    const { type, key, innerHTML } = entry;
    return { script: [{ type, key, innerHTML }] };
  });

  const ssrHost = multiLangStore.runtimeHostnameDuringSSR ?? '';

  if (isServerSchemaFetchAllowed(isServer, ssrHost)) {
    onServerPrefetch(async () => {
      store.setActivePath(route.path);
      if (!store.isLoadedForHost(ssrHost)) {
        store.setLoading(true);
        const schemas = await fetchSchemasForHost(fetchParams);
        store.setSchemas(ssrHost, schemas);
      }
    });
    return;
  }

  if (isServer) {
    // SSG build: skip fetch, register activePath so head getter returns []
    onServerPrefetch(() => {
      store.setActivePath(route.path);
    });
    return;
  }

  // CSR: track navigation synchronously, fetch once per host
  watch(
    () => route.path,
    (newPath) => store.setActivePath(newPath),
    { immediate: true },
  );

  const host: SchemaHost = window.location.hostname;
  if (!store.isLoadedForHost(host) && !store.isLoading) {
    store.setLoading(true);
    fetchSchemasForHost(fetchParams)
      .then((schemas) => store.setSchemas(host, schemas))
      .catch(() => store.setLoading(false));
  }
}
