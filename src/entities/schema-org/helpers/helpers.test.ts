import { describe, expect, it } from 'vitest';
import {
  buildSchemaFetchParams,
  buildSchemaScriptEntry,
  isServerSchemaFetchAllowed,
  selectActiveSchemas,
} from './index';
import type { SchemaNode } from '../types';

describe('buildSchemaFetchParams', () => {
  it('produces a URLSearchParams string with bookmarkPath and logoPath', () => {
    const result = buildSchemaFetchParams({
      bookmarkPath: '/img/bookmark.svg',
      logoPath: '/img/logo.png',
    });
    const params = new URLSearchParams(result);
    expect(params.get('bookmarkPath')).toBe('/img/bookmark.svg');
    expect(params.get('logoPath')).toBe('/img/logo.png');
  });

  it('does not include a host parameter', () => {
    const result = buildSchemaFetchParams({ bookmarkPath: '/b', logoPath: '/l' });
    expect(result).not.toContain('host');
  });
});

describe('buildSchemaScriptEntry', () => {
  it('returns null for an empty node array', () => {
    expect(buildSchemaScriptEntry([])).toBeNull();
  });

  it('returns a script entry with type application/ld+json', () => {
    const nodes: SchemaNode[] = [{ '@type': 'WebSite', name: 'Acme' }];
    const entry = buildSchemaScriptEntry(nodes);
    expect(entry?.type).toBe('application/ld+json');
  });

  it('uses the stable key schema-org', () => {
    const entry = buildSchemaScriptEntry([{ '@type': 'Organization' }]);
    expect(entry?.key).toBe('schema-org');
  });

  it('wraps nodes in @context + @graph', () => {
    const nodes: SchemaNode[] = [{ '@type': 'WebSite' }];
    const entry = buildSchemaScriptEntry(nodes);
    const parsed = JSON.parse(entry!.innerHTML);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toEqual(nodes);
  });

  it('serialises multiple nodes into the @graph array', () => {
    const nodes: SchemaNode[] = [
      { '@type': 'WebSite', url: 'https://example.com' },
      { '@type': 'Organization', name: 'Acme' },
    ];
    const entry = buildSchemaScriptEntry(nodes);
    const parsed = JSON.parse(entry!.innerHTML);
    expect(parsed['@graph']).toHaveLength(2);
  });

  it('produces valid JSON in innerHTML', () => {
    const entry = buildSchemaScriptEntry([{ '@type': 'WebSite', url: 'https://a.com' }]);
    expect(() => JSON.parse(entry!.innerHTML)).not.toThrow();
  });
});

describe('isServerSchemaFetchAllowed', () => {
  it('returns true when on server and runtimeHost is provided', () => {
    expect(isServerSchemaFetchAllowed(true, 'example.com')).toBe(true);
  });

  it('returns false when on server but runtimeHost is empty (SSG build)', () => {
    expect(isServerSchemaFetchAllowed(true, '')).toBe(false);
  });

  it('returns false when not on server, even if host is provided', () => {
    expect(isServerSchemaFetchAllowed(false, 'example.com')).toBe(false);
  });

  it('returns false when not on server and host is empty', () => {
    expect(isServerSchemaFetchAllowed(false, '')).toBe(false);
  });
});

describe('selectActiveSchemas', () => {
  it('returns [] when schemasByPath is null (not yet loaded)', () => {
    expect(selectActiveSchemas(null, '/casino')).toEqual([]);
  });

  it('returns [] when the route is absent from the map', () => {
    expect(selectActiveSchemas({ '/': [] }, '/casino')).toEqual([]);
  });

  it('returns the nodes for a matching route', () => {
    const node: SchemaNode = { '@type': 'WebSite' };
    expect(selectActiveSchemas({ '/casino': [node] }, '/casino')).toEqual([node]);
  });

  it('returns [] when the matching route has an explicit empty array', () => {
    expect(selectActiveSchemas({ '/casino': [] }, '/casino')).toEqual([]);
  });

  it('returns [] for an empty routePath string', () => {
    expect(selectActiveSchemas({ '/': [{ '@type': 'WebSite' }] }, '')).toEqual([]);
  });
});