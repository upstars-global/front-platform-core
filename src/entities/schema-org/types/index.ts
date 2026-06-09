export type SchemaNode = Record<string, unknown>;

export type SchemasByPath = Record<string, SchemaNode[]>;

export interface SchemaJsonLd {
  '@context': 'https://schema.org';
  '@graph': SchemaNode[];
}

/**
 * The unhead script entry we pass to useHead().
 * `innerHTML` is required (not `textContent`) — @unhead/ssr's tagToString() runs
 * textContent through escapeHtml() which encodes " → &quot; and / → &#x2F;,
 * breaking JSON parsing in SSR output. innerHTML is used verbatim.
 */
export interface SchemaScriptEntry {
  type: 'application/ld+json';
  key: 'schema-org';
  innerHTML: string;
}

export interface SchemaFetchAssets {
  bookmarkPath: string;
  logoPath: string;
}

export type SchemaHost = string;
