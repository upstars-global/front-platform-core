import { jsonHttp } from '../../http';
import { type JsonApiParams } from './types';

export function jsonApi<R = unknown>(url: string, params: JsonApiParams = {}) {
  const { data } = params;
  const method = params.method || 'POST';

  const trimmedUrl = url[0] === '/' ? url.slice(1) : url;
  return jsonHttp<R>(`/json-api/${trimmedUrl}`, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
}
