import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { SchemaHost, SchemaNode, SchemasByPath } from '../types';
import { selectActiveSchemas } from '../helpers';

export const useSchemaOrgStore = defineStore('schemaOrg', () => {
  const schemasByPath = ref<SchemasByPath | null>(null);
  const loadedForHost = ref<SchemaHost | null>(null);
  const isLoading = ref(false);
  const activeRoutePath = ref<string | null>(null);

  const activeSchemas = computed<SchemaNode[]>(() =>
    selectActiveSchemas(schemasByPath.value, activeRoutePath.value ?? ''),
  );

  function setActivePath(path: string): void {
    activeRoutePath.value = path;
  }

  function setSchemas(host: SchemaHost, schemas: SchemasByPath): void {
    schemasByPath.value = schemas;
    loadedForHost.value = host;
    isLoading.value = false;
  }

  function setLoading(value: boolean): void {
    isLoading.value = value;
  }

  function isLoadedForHost(host: SchemaHost): boolean {
    return loadedForHost.value === host;
  }

  return {
    schemasByPath,
    loadedForHost,
    isLoading,
    activeRoutePath,
    activeSchemas,
    setActivePath,
    setSchemas,
    setLoading,
    isLoadedForHost,
  };
});