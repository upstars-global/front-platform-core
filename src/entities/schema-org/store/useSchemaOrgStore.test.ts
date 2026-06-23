import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSchemaOrgStore } from './useSchemaOrgStore';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('useSchemaOrgStore', () => {
  describe('initial state', () => {
    it('has null schemasByPath', () => {
      expect(useSchemaOrgStore().schemasByPath).toBeNull();
    });

    it('has null loadedForHost', () => {
      expect(useSchemaOrgStore().loadedForHost).toBeNull();
    });

    it('has isLoading false', () => {
      expect(useSchemaOrgStore().isLoading).toBe(false);
    });

    it('has null activeRoutePath', () => {
      expect(useSchemaOrgStore().activeRoutePath).toBeNull();
    });

    it('activeSchemas is [] when store is empty', () => {
      expect(useSchemaOrgStore().activeSchemas).toEqual([]);
    });
  });

  describe('setActivePath', () => {
    it('updates activeRoutePath', () => {
      const store = useSchemaOrgStore();
      store.setActivePath('/casino');
      expect(store.activeRoutePath).toBe('/casino');
    });

    it('activeSchemas reflects the new path immediately', () => {
      const store = useSchemaOrgStore();
      const node = { '@type': 'WebSite' };
      store.setSchemas('example.com', { '/casino': [node] });
      store.setActivePath('/casino');
      expect(store.activeSchemas).toEqual([node]);
    });

    it('activeSchemas returns [] when new path has no schema', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('example.com', { '/casino': [{ '@type': 'WebSite' }] });
      store.setActivePath('/slots');
      expect(store.activeSchemas).toEqual([]);
    });
  });

  describe('setSchemas', () => {
    it('stores the schemas map', () => {
      const store = useSchemaOrgStore();
      const schemas = { '/': [{ '@type': 'Organization' }] };
      store.setSchemas('example.com', schemas);
      expect(store.schemasByPath).toEqual(schemas);
    });

    it('records the host', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('example.com', {});
      expect(store.loadedForHost).toBe('example.com');
    });

    it('resets isLoading to false', () => {
      const store = useSchemaOrgStore();
      store.setLoading(true);
      store.setSchemas('example.com', {});
      expect(store.isLoading).toBe(false);
    });

    it('overwrites a previous host cache (multi-brand safety)', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('brand-a.com', { '/': [{ '@type': 'WebSite' }] });
      store.setSchemas('brand-b.com', { '/casino': [{ '@type': 'WebSite' }] });
      expect(store.loadedForHost).toBe('brand-b.com');
      expect(store.schemasByPath).toEqual({ '/casino': [{ '@type': 'WebSite' }] });
    });
  });

  describe('setLoading', () => {
    it('sets isLoading to true', () => {
      const store = useSchemaOrgStore();
      store.setLoading(true);
      expect(store.isLoading).toBe(true);
    });

    it('sets isLoading to false', () => {
      const store = useSchemaOrgStore();
      store.setLoading(true);
      store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('isLoadedForHost', () => {
    it('returns false when no host has been loaded', () => {
      expect(useSchemaOrgStore().isLoadedForHost('example.com')).toBe(false);
    });

    it('returns true for the host that was loaded', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('example.com', {});
      expect(store.isLoadedForHost('example.com')).toBe(true);
    });

    it('returns false for a different host', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('example.com', {});
      expect(store.isLoadedForHost('other.com')).toBe(false);
    });
  });

  describe('activeSchemas computed', () => {
    it('returns [] when schemasByPath is null', () => {
      const store = useSchemaOrgStore();
      store.setActivePath('/casino');
      expect(store.activeSchemas).toEqual([]);
    });

    it('returns [] when schemasByPath is loaded but the route is absent', () => {
      const store = useSchemaOrgStore();
      store.setSchemas('example.com', { '/': [{ '@type': 'WebSite' }] });
      store.setActivePath('/casino');
      expect(store.activeSchemas).toEqual([]);
    });

    it('returns nodes for the active route', () => {
      const store = useSchemaOrgStore();
      const node = { '@type': 'WebSite', url: 'https://example.com' };
      store.setSchemas('example.com', { '/': [node] });
      store.setActivePath('/');
      expect(store.activeSchemas).toEqual([node]);
    });

    it('reacts when setActivePath is called after schemas are loaded', () => {
      const store = useSchemaOrgStore();
      const casinoNode = { '@type': 'WebSite', name: 'Casino' };
      store.setSchemas('example.com', { '/casino': [casinoNode] });

      store.setActivePath('/');
      expect(store.activeSchemas).toEqual([]);

      store.setActivePath('/casino');
      expect(store.activeSchemas).toEqual([casinoNode]);
    });
  });
});
