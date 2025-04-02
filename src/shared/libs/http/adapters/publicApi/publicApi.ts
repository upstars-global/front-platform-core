import { jsonHttp } from '../../http';
import { type PublicApiParams } from './types';

export function publicApi<R = unknown>(url: string, params: PublicApiParams = {}) {
  const { data } = params;
  const method = params.method || 'POST';

  const trimmedUrl = url[0] === '/' ? url.slice(1) : url;
  return jsonHttp<R>(`/public-api/json/${trimmedUrl}`, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
}
