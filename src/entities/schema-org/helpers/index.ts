import type { SchemaFetchAssets, SchemaJsonLd, SchemaNode, SchemaScriptEntry } from '../types';

/**
 * Builds the URLSearchParams string sent to /fe-api/schema-org.
 * The host is NOT in the URL — the server reads it from the HTTP Host header
 * (or x-custom-host for SSR). These are static per-brand asset paths.
 */
export function buildSchemaFetchParams(assets: SchemaFetchAssets): string {
  return new URLSearchParams({
    bookmarkPath: assets.bookmarkPath,
    logoPath: assets.logoPath,
  }).toString();
}

/**
 * Converts an array of schema nodes into a single unhead script entry.
 * Returns null when the array is empty so callers can easily return script:[].
 *
 * Uses innerHTML (not textContent): @unhead/ssr's tagToString() passes textContent
 * through escapeHtml(), encoding " → &quot; and / → &#x2F;, which breaks JSON.
 * innerHTML is used verbatim in the SSR HTML string.
 */
export function buildSchemaScriptEntry(nodes: SchemaNode[]): SchemaScriptEntry | null {
  if (nodes.length === 0) {
    return null;
  }

  const jsonLd: SchemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };

  return {
    type: 'application/ld+json',
    key: 'schema-org',
    innerHTML: JSON.stringify(jsonLd),
  };
}

/**
 * Whether the server-side schema fetch should run.
 * False during SSG builds where runtimeHostnameDuringSSR is empty —
 * static HTML must not embed host-specific data that may be wrong for other brands.
 */
export function isServerSchemaFetchAllowed(isServerEnv: boolean, runtimeHost: string): boolean {
  return isServerEnv && runtimeHost.length > 0;
}

/**
 * Reads the current schema nodes for a route path from the full domain map.
 * Returns an empty array (not null/undefined) so callers have a uniform type.
 */
export function selectActiveSchemas(
  schemasByPath: Record<string, SchemaNode[]> | null,
  routePath: string,
): SchemaNode[] {
  return schemasByPath?.[routePath] ?? [];
}
