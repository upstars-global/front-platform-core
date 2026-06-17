import { onServerPrefetch, toValue, watch } from 'vue';
import type { Ref } from 'vue';
import { useHead } from '@unhead/vue';
import { useMultiLangStore } from '../../multilang';
import { configAPI } from '../../app-config';
import { isServer } from '../../../shared';
import { useSchemaOrgStore } from '../store';
import { buildSchemaFetchParams, buildSchemaScriptEntry, isServerSchemaFetchAllowed } from '../helpers';
import type { SchemaFetchAssets, SchemaHost, SchemasByPath } from '../types';

type SchemaOrgOptions = SchemaFetchAssets & {
  currentPath: Ref<string> | (() => string);
}

async function fetchSchemasForHost(fetchParams: string): Promise<SchemasByPath> {
  const raw = await configAPI.loadSchemaOrgByPath<SchemasByPath>(fetchParams);
  return raw ?? {};
}

export function useRouteSchemaOrg(options: SchemaOrgOptions): void {
  const { bookmarkPath, logoPath, currentPath } = options;

  const multiLangStore = useMultiLangStore();
  const store = useSchemaOrgStore();

  const fetchParams = buildSchemaFetchParams({ bookmarkPath, logoPath });

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
      store.setActivePath(toValue(currentPath));
      if (!store.isLoadedForHost(ssrHost)) {
        store.setLoading(true);
        const schemas = await fetchSchemasForHost(fetchParams);
        store.setSchemas(ssrHost, schemas);
      }
    });
    return;
  }

  if (isServer) {
    onServerPrefetch(() => {
      store.setActivePath(toValue(currentPath));
    });
    return;
  }

  // currentPath is a Ref<string> or () => string — both are valid watch sources
  watch(currentPath, (newPath) => store.setActivePath(newPath), { immediate: true });

  const host: SchemaHost = window.location.hostname;
  if (!store.isLoadedForHost(host) && !store.isLoading) {
    store.setLoading(true);
    fetchSchemasForHost(fetchParams)
      .then((schemas) => store.setSchemas(host, schemas))
      .catch(() => store.setLoading(false));
  }
}
