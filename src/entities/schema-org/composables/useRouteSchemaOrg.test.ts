// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { ref, nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';

import { useRouteSchemaOrg } from './useRouteSchemaOrg';
import { useSchemaOrgStore } from '../store';
import { isServerSchemaFetchAllowed } from '../helpers';
import { configAPI } from '../../app-config';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let headInputCapture: (() => { script: unknown[] }) | null = null;

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn((input: () => { script: unknown[] }) => {
    headInputCapture = input;
  }),
}));

vi.mock('../../../shared/helpers/ssr', () => ({ isServer: false }));

const mockRuntimeHostname = { value: '' };

vi.mock('../../multilang', () => ({
  useMultiLangStore: vi.fn(() => ({
    get runtimeHostnameDuringSSR() { return mockRuntimeHostname.value; },
  })),
}));

const mockFetchResult = { value: null as Record<string, unknown[]> | null };

vi.mock('../../app-config', () => ({
  configAPI: {
    loadSchemaOrgByPath: vi.fn(async () => mockFetchResult.value),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

let currentPath = ref('/');

function setupPinia() {
  const pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn });
  setActivePinia(pinia);
  return pinia;
}

function mountComposable() {
  const TestHost = {
    setup() {
      useRouteSchemaOrg({ bookmarkPath: '/bookmark.svg', logoPath: '/logo.png', currentPath });
      return {};
    },
    template: '<div />',
  };
  return mount(TestHost);
}

function getHeadScripts(): unknown[] {
  return headInputCapture?.()?.script ?? [];
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useRouteSchemaOrg — CSR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headInputCapture = null;
    mockRuntimeHostname.value = '';
    mockFetchResult.value = null;
    currentPath = ref('/');
    setupPinia();
  });

  it('passes a getter function to useHead', () => {
    mountComposable();
    expect(typeof headInputCapture).toBe('function');
  });

  it('head script is [] on initial mount before fetch resolves', () => {
    mountComposable();
    expect(getHeadScripts()).toEqual([]);
  });

  it('triggers a fetch on initial mount', () => {
    mountComposable();
    expect(configAPI.loadSchemaOrgByPath).toHaveBeenCalledTimes(1);
  });

  it('populates head scripts after fetch resolves with schemas for the current route', async () => {
    const store = useSchemaOrgStore();
    const homeNode = { '@type': 'WebSite', url: 'https://example.com' };
    mockFetchResult.value = { '/': [homeNode] };

    mountComposable();
    await flushPromises();

    expect(store.activeSchemas).toEqual([homeNode]);

    const scripts = getHeadScripts();
    expect(scripts).toHaveLength(1);
    const script = scripts[0] as { type: string; key: string; innerHTML: string };
    expect(script.type).toBe('application/ld+json');
    expect(script.key).toBe('schema-org');
    const parsed = JSON.parse(script.innerHTML);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toEqual([homeNode]);
  });

  it('clears head scripts synchronously when navigating to a route with no schema', async () => {
    const homeNode = { '@type': 'WebSite' };
    mockFetchResult.value = { '/': [homeNode] };

    mountComposable();
    await flushPromises();

    currentPath.value = '/blog';
    await nextTick();

    expect(getHeadScripts()).toEqual([]);
  });

  it('shows schema for new route after navigation when schemas are cached', async () => {
    const casinoNode = { '@type': 'GameServer' };
    mockFetchResult.value = { '/': [], '/casino': [casinoNode] };

    mountComposable();
    await flushPromises();

    currentPath.value = '/casino';
    await nextTick();

    expect(getHeadScripts()).toHaveLength(1);
    const parsed = JSON.parse((getHeadScripts()[0] as { innerHTML: string }).innerHTML);
    expect(parsed['@graph']).toEqual([casinoNode]);
  });

  it('restores schema after schema → no-schema → schema navigation (no dispose() bug)', async () => {
    const casinoNode = { '@type': 'GameServer' };
    mockFetchResult.value = { '/': [], '/casino': [casinoNode] };

    mountComposable();
    await flushPromises();

    currentPath.value = '/casino';
    await nextTick();
    expect(getHeadScripts()).toHaveLength(1);

    currentPath.value = '/blog';
    await nextTick();
    expect(getHeadScripts()).toEqual([]);

    currentPath.value = '/casino';
    await nextTick();
    expect(getHeadScripts()).toHaveLength(1);
  });

  it('fetches exactly once on mount regardless of how many path changes occur', async () => {
    mockFetchResult.value = { '/': [], '/casino': [], '/blog': [] };

    mountComposable();
    currentPath.value = '/casino';
    currentPath.value = '/blog';
    currentPath.value = '/';
    await flushPromises();

    expect(configAPI.loadSchemaOrgByPath).toHaveBeenCalledTimes(1);
  });

  it('sets isLoading before fetch and clears it after', async () => {
    const store = useSchemaOrgStore();
    mockFetchResult.value = { '/': [] };

    let loadingDuringFetch = false;
    (configAPI.loadSchemaOrgByPath as Mock).mockImplementationOnce(async () => {
      loadingDuringFetch = store.isLoading;
      return {};
    });

    mountComposable();
    await flushPromises();

    expect(loadingDuringFetch).toBe(true);
    expect(store.isLoading).toBe(false);
  });

  it('treats API null response as empty map (no retry loop)', async () => {
    mockFetchResult.value = null;

    mountComposable();
    await flushPromises();

    const store = useSchemaOrgStore();
    expect(store.schemasByPath).toEqual({});
    expect(store.isLoading).toBe(false);
    expect(configAPI.loadSchemaOrgByPath).toHaveBeenCalledTimes(1);
  });

  it('sets isLoading to false and does not crash on API error', async () => {
    (configAPI.loadSchemaOrgByPath as Mock).mockRejectedValueOnce(new Error('network error'));

    mountComposable();
    await flushPromises();

    const store = useSchemaOrgStore();
    expect(store.isLoading).toBe(false);
  });

  it('setActivePath tracks path changes independently of the fetch', async () => {
    const store = useSchemaOrgStore();
    const casinoNode = { '@type': 'GameServer' };

    let resolveFetch!: (v: Record<string, unknown[]>) => void;
    (configAPI.loadSchemaOrgByPath as Mock)
      .mockImplementationOnce(() => new Promise((res) => { resolveFetch = res; }));

    mountComposable();
    expect(store.activeRoutePath).toBe('/');

    currentPath.value = '/casino';
    await nextTick();
    expect(store.activeRoutePath).toBe('/casino');

    expect(store.schemasByPath).toBeNull();

    resolveFetch({ '/casino': [casinoNode] });
    await flushPromises();

    expect(store.activeSchemas).toEqual([casinoNode]);
  });
});

describe('useRouteSchemaOrg — SSR helpers', () => {
  it('isServerSchemaFetchAllowed returns true when host is set', () => {
    expect(isServerSchemaFetchAllowed(true, 'example.com')).toBe(true);
  });

  it('isServerSchemaFetchAllowed returns false without host (SSG build)', () => {
    expect(isServerSchemaFetchAllowed(true, '')).toBe(false);
  });
});
